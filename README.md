# Face to Emoji Converter

Face-to-Emoji Generator is a web application that transforms facial images into realistic emojis utilizing the fofr/face-to-many model from Replicate ([fofr/face-to-many – Run with an API on Replicate](https://replicate.com/fofr/face-to-many)). The application also automatically removes the background, providing a clean and seamless emoji creation process.

## Project Structure

The project is divided into two main parts:

1. Backend (Flask)
2. Frontend (Next.js)

### Backend

The backend is built with Flask and handles the image processing and AI conversion tasks.

Key files:

- `backend/app.py`: Main Flask application
- `backend/deploy.prototxt`: Configuration file for the face detection model
- `backend/requirements.txt`: Python dependencies

Main features:

- Face detection using OpenCV
- Image processing and resizing
- Integration with Replicate API for emoji generation
- Background removal from generated emoji
- Asynchronous task processing

### Frontend

The frontend is built with Next.js and provides the user interface for image upload and result display.

Key files:

- `frontend/app/page.tsx`: Main page component
- `frontend/components/`: UI components (FileUploader, ImagePreview, ProcessingStatus, EmojiResult)
- `frontend/lib/utils.ts`: Utility functions
- `frontend/hooks/use-toast.ts`: Custom hook for toast notifications

Main features:

- File upload via drag-and-drop or file selection
- Image preview
- Progress indication during processing
- Display of the generated emoji
- Error handling and user feedback

## How It Works

1. User uploads an image through the frontend interface.
2. The image is sent to the backend for processing.
3. The backend detects faces in the image using OpenCV.
4. If a face is detected, it's cropped and resized.
5. The processed image is sent to the Replicate API for emoji generation.
6. The generated emoji undergoes background removal.
7. The final emoji is sent back to the frontend for display.

## Technologies Used

- Backend:

  - Flask
  - OpenCV
  - Replicate API
  - Threading for asynchronous processing

- Frontend:
  - Next.js
  - React
  - TypeScript
  - Tailwind CSS
  - Shadcn UI components

## Setup and Installation

(Include instructions for setting up both the backend and frontend, including environment variables, dependencies, and how to run the application locally.)

## API Endpoints

- `POST /generate`: Initiates the image processing and emoji generation
- `GET /task_status/<task_id>`: Checks the status of a processing task

## Future Improvements

(List any planned features or improvements for the project.)

## Contributors

(List the main contributors to the project.)

## License

(Include license information if applicable.)
