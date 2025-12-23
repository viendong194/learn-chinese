export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center p-10">
      <div className="relative">
        {/* Vòng xoay ngoài */}
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        {/* Điểm nhấn ở giữa */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-gray-500 animate-pulse">Đang tải dữ liệu...</p>
    </div>
  );
}