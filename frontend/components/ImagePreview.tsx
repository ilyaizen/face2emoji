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
      <Image
        src={imageSource}
        alt="Preview"
        width={300}
        height={300}
        objectFit="contain"
        className="rounded-md"
      />
    </div>
  );
}
