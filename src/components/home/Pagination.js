export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex justify-center items-center mt-12 gap-1 md:gap-2">
            <button
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="p-2 md:px-4 py-2 rounded-lg border bg-white disabled:opacity-20 hover:bg-gray-50 text-sm font-medium transition"
            >
                Trước
            </button>

            <div className="flex gap-1">
                {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    if (totalPages > 5 && Math.abs(pageNum - currentPage) > 2) return null;

                    return (
                        <button
                            key={pageNum}
                            onClick={() => onPageChange(pageNum)}
                            className={`w-9 h-9 md:w-10 md:h-10 rounded-lg border text-sm font-bold transition-all ${currentPage === pageNum
                                    ? 'bg-orange-600 text-white border-orange-600 shadow-md shadow-blue-200'
                                    : 'bg-white text-gray-600 hover:border-blue-400'
                                }`}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>

            <button
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
                className="p-2 md:px-4 py-2 rounded-lg border bg-white disabled:opacity-20 hover:bg-gray-50 text-sm font-medium transition"
            >
                Sau
            </button>
        </div>
    );
}
