"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FileUploader } from "@/components/FileUploader";
import { ImagePreview } from "@/components/ImagePreview";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { EmojiResult } from "@/components/EmojiResult";

// Main component for the Face to Emoji Converter application
export default function Home() {
  // State variables for managing file selection, processing status, and results
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [emojiUrl, setEmojiUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);

  // Handler for file selection
  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
    setEmojiUrl(null); // Clear previous results
    setError(null); // Clear any previous errors
  };

  // Handler for submitting the selected file for processing
  const handleSubmit = async () => {
    setIsProcessing(true);
    setError(null);
    setTaskId(null);

    const formData = new FormData();
    if (selectedFile) {
      formData.append("image", selectedFile);
    } else {
      setError("Please select a file");
      setIsProcessing(false);
      return;
    }

    try {
      // Send the image to the backend for processing
      const response = await axios.post(
        "http://127.0.0.1:5000/generate",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      setTaskId(response.data.task_id);
    } catch (err) {
      setError("Error processing image. Please try again.");
      console.error(err);
      setIsProcessing(false);
    }
  };

  // Effect hook for polling task status
  useEffect(() => {
    const pollTaskStatus = async () => {
      if (!taskId) return;

      try {
        // Check the status of the processing task
        const response = await axios.get(
          `http://127.0.0.1:5000/task_status/${taskId}`
        );
        console.log("Task status response:", response.data);

        if (response.data.status === "completed") {
          // Handle successful completion
          const resultUrl = Array.isArray(response.data.result)
            ? response.data.result[0]
            : response.data.result;

          setEmojiUrl(resultUrl);
          setIsProcessing(false);
          setTaskId(null);
        } else if (response.data.status === "error") {
          // Handle error in processing
          setError(response.data.error);
          setIsProcessing(false);
          setTaskId(null);
        } else {
          // Continue polling if task is still in progress
          setTimeout(pollTaskStatus, 2000);
        }
      } catch (err) {
        setError("Error checking task status. Please try again.");
        console.error(err);
        setIsProcessing(false);
        setTaskId(null);
      }
    };

    // Start polling when a taskId is available
    if (taskId) {
      pollTaskStatus();
    }
  }, [taskId]);

  // Render the UI components
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-4xl font-bold mb-8">Face to Emoji Converter</h1>
      <div className="w-full max-w-md">
        <FileUploader onFileSelect={handleFileSelect} />
        {selectedFile && <ImagePreview file={selectedFile} />}
        <button
          onClick={handleSubmit}
          disabled={isProcessing || !selectedFile}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-md mt-4 hover:bg-blue-600 disabled:bg-gray-400"
        >
          Generate Emoji
        </button>
        {isProcessing && <ProcessingStatus />}
        {emojiUrl && <EmojiResult url={emojiUrl} />}
        {error && <p className="text-red-500 mt-4">{error}</p>}
      </div>
    </div>
  );
}
