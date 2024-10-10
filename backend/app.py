import os
from flask import Flask, request, jsonify
import cv2
import numpy as np
from dotenv import load_dotenv
from flask_cors import CORS
import replicate
import threading
import uuid

# Load environment variables from .env file for configuration
load_dotenv()

# Initialize Flask application and enable CORS for all routes
app = Flask(__name__)
CORS(app)

# Configure upload folder for temporary image storage
UPLOAD_FOLDER = 'uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Ensure the upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load the pre-trained face detection model
try:
    face_net = cv2.dnn.readNet(
        "./deploy.prototxt",
        "./res10_300x300_ssd_iter_140000.caffemodel"
    )
except cv2.error as e:
    print(f"Error loading the face detection model: {e}")
    exit(1)

# Dictionary to store task results, keyed by task ID
task_results = {}

def process_image_task(image_path, task_id):
    """
    Process the uploaded image to detect faces, generate an emoji, and remove the background.
    This function runs as a background task.

    Args:
        image_path (str): Path to the uploaded image
        task_id (str): Unique identifier for the task

    The function performs the following steps:
    1. Detect faces in the image
    2. Crop and resize the detected face
    3. Generate an emoji using Replicate API
    4. Remove the background from the emoji
    5. Store the result in the task_results dictionary
    """
    try:
        # Load the image and prepare it for face detection
        image = cv2.imread(image_path)
        (h, w) = image.shape[:2]
        blob = cv2.dnn.blobFromImage(image, 1.0, (300, 300), (104.0, 177.0, 123.0))

        # Perform face detection
        face_net.setInput(blob)
        detections = face_net.forward()

        if detections.shape[2] > 0:
            # Find the detection with the highest confidence
            i = np.argmax(detections[0, 0, :, 2])
            confidence = detections[0, 0, i, 2]

            if confidence > 0.5:
                # Extract the face region with added margin
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")

                face_size = max(endX - startX, endY - startY)
                centerX = (startX + endX) // 2
                centerY = (startY + endY) // 2

                margin = int(face_size * 0.25)
                face_size += 2 * margin

                startX = max(0, centerX - face_size // 2)
                startY = max(0, centerY - face_size // 2)
                endX = min(w, startX + face_size)
                endY = min(h, startY + face_size)

                face_img = image[startY:endY, startX:endX]
                
                # Resize the face image to 400x400 pixels
                resized_img = cv2.resize(face_img, (400, 400), interpolation=cv2.INTER_AREA)
                
                # Save the cropped face image temporarily
                temp_face_path = os.path.join(app.config['UPLOAD_FOLDER'], 'temp_face.jpg')
                cv2.imwrite(temp_face_path, resized_img)
                
                # Use Replicate API to generate an emoji from the face image
                with open(temp_face_path, 'rb') as file:
                    input_data = {
                        "image": file,
                        "style": "Emoji",
                        "prompt": "a person",
                        "instant_id_strength": 0.8,
                        "width": 512  # Request a 512x512 image
                    }
                    emoji_output = replicate.run(
                        "fofr/face-to-many:a07f252abbbd832009640b27f063ea52d87d7a23a185ca165bec23b5adc8deaf",
                        input=input_data
                    )

                # Use Replicate API to remove the background from the emoji
                bg_removal_input = {
                    "image": emoji_output[0] if isinstance(emoji_output, list) else emoji_output
                }
                final_output = replicate.run(
                    "lucataco/remove-bg:95fcc2a26d3899cd6c2691c900465aaeff466285a65c14638cc5f36f34befaf1",
                    input=bg_removal_input
                )

                # Store the result in the task_results dictionary
                task_results[task_id] = {'status': 'completed', 'result': final_output}

            else:
                task_results[task_id] = {'status': 'error', 'error': 'No face detected with high confidence'}
        else:
            task_results[task_id] = {'status': 'error', 'error': 'No face detected'}

    except Exception as e:
        task_results[task_id] = {'status': 'error', 'error': str(e)}

    finally:
        # Clean up temporary files
        os.remove(temp_face_path)
        os.remove(image_path)

@app.route('/generate', methods=['POST'])
def generate():
    """
    API endpoint to initiate face detection and emoji generation process.
    
    Expects an image file in the POST request.
    Returns a task ID for checking the status of the background process.
    """
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    image_file = request.files['image']

    if image_file.filename == '':
        return jsonify({'error': 'No selected image file'}), 400

    # Save the uploaded image
    image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_file.filename)
    image_file.save(image_path)

    # Generate a unique task ID
    task_id = str(uuid.uuid4())

    # Start the background task for image processing
    thread = threading.Thread(target=process_image_task, args=(image_path, task_id))
    thread.start()

    return jsonify({'task_id': task_id}), 202

@app.route('/task_status/<task_id>', methods=['GET'])
def task_status(task_id):
    """
    API endpoint to check the status of a background task.
    
    Args:
        task_id (str): The unique identifier for the task

    Returns:
        JSON response with the task status and result (if completed)
    """
    if task_id not in task_results:
        return jsonify({'status': 'pending'}), 202

    result = task_results[task_id]
    if result['status'] == 'completed':
        # Remove the result from the dictionary to free up memory
        del task_results[task_id]
        return jsonify({'status': 'completed', 'result': result['result']}), 200
    elif result['status'] == 'error':
        # Remove the result from the dictionary to free up memory
        del task_results[task_id]
        return jsonify({'status': 'error', 'error': result['error']}), 500
    else:
        return jsonify({'status': 'pending'}), 202

if __name__ == '__main__':
    app.run(debug=True)