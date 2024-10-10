export function ProcessingStatus() {
  return (
    <div className="mt-4 text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      <p className="mt-2 text-sm text-gray-600">Processing your image...</p>
    </div>
  );
}
