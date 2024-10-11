import { Loader2 } from "lucide-react";

export function ProcessingStatus() {
  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className="w-12 h-12 text-gray-400 animate-spin" />
      <p className="mt-2 text-sm text-gray-600">Processing your image...</p>
    </div>
  );
}
