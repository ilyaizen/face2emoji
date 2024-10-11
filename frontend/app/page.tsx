"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FileUploader } from "@/components/FileUploader";
import { ImagePreview } from "@/components/ImagePreview";
import { ProcessingStatus } from "@/components/ProcessingStatus";
import { EmojiResult } from "@/components/EmojiResult";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import Image from "next/image";

// Main component for the Face to Emoji Converter application
export default function Home() {
  // State variables for managing file selection, processing status, and results
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [emojiUrl, setEmojiUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [taskId, setTaskId] = useState<string | null>(null);
  const [generatedEmojis, setGeneratedEmojis] = useState<string[]>([]);

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
      toast({
        title: "Error",
        description: "Please select a file",
        variant: "destructive",
      });
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
      toast({
        title: "Error",
        description: "Error processing image. Please try again.",
        variant: "destructive",
      });
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
          setGeneratedEmojis((prev) => [...prev, resultUrl]);
          setIsProcessing(false);
          setTaskId(null);
        } else if (response.data.status === "error") {
          // Handle error in processing
          toast({
            title: "Error",
            description: response.data.error,
            variant: "destructive",
          });
          setIsProcessing(false);
          setTaskId(null);
        } else {
          // Continue polling if task is still in progress
          setTimeout(pollTaskStatus, 2000);
        }
      } catch (err) {
        toast({
          title: "Error",
          description: "Error checking task status. Please try again.",
          variant: "destructive",
        });
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">
        Face-to-Emoji Generator
      </h1>
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Upload Image</h2>
          <FileUploader onFileSelect={handleFileSelect} />
          {selectedFile && <ImagePreview file={selectedFile} />}
        </Card>
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Generated Emoji</h2>
          <div className="flex items-center justify-center h-64 bg-gray-100 rounded-lg">
            {isProcessing ? (
              <ProcessingStatus />
            ) : emojiUrl ? (
              <EmojiResult url={emojiUrl} />
            ) : (
              <span className="text-sm text-gray-500">
                No emoji generated yet
              </span>
            )}
          </div>
          <Button
            onClick={handleSubmit}
            disabled={isProcessing || !selectedFile}
            className="w-full mt-4"
          >
            {isProcessing ? "Generating..." : "Generate Emoji"}
          </Button>
        </Card>
      </div>
      {generatedEmojis.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Generated Emojis</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {generatedEmojis.map((emoji, index) => (
              <Image
                key={index}
                src={emoji}
                alt={`Generated emoji ${index + 1}`}
                width={100}
                height={100}
                className="w-full h-auto"
              />
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
}
