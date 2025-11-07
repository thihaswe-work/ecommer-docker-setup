export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-gray-600  border-dashed rounded-full animate-spin"></div>
        {/* Loading text */}
        <p className="mt-4 text-gray-600 text-lg font-medium">Loading...</p>
      </div>
    </div>
  );
}
