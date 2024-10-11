"use client";

import Image from "next/image";

interface ImagePreviewProps {
  file: File | null;
}

export function ImagePreview({ file }: ImagePreviewProps) {
  if (!file) return null;

  const imageSource = URL.createObjectURL(file);

  return (
    <div className="mt-4">
      <h3 className="text-lg font-semibold mb-2">Preview</h3>
      <div className="relative w-full h-64">
        <Image
          src={imageSource}
          alt="Preview"
          fill
          style={{ objectFit: "cover" }}
          className="rounded-lg"
        />
      </div>
    </div>
  );
}
