"use client";

import { useState } from 'react';
import Link from 'next/link';
import BOOKS from '@/data/bilingual-books.json';

const ITEMS_PER_PAGE = 5;

export default function BilingualBooksPage() {
    const [selectedBook, setSelectedBook] = useState(null);
    const [iframeLoading, setIframeLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(BOOKS.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentBooks = BOOKS.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const handleSelectBook = (book) => {
        setSelectedBook(book);
        setIframeLoading(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBack = () => {
        setSelectedBook(null);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20 pb-12 px-4">
            <div className="max-w-6xl mx-auto">
                <header className="mb-10 text-center">
                    <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 text-sm font-medium mb-4 transition">
                        ← Trang chủ
                    </Link>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Sách Song Ngữ</h1>
                    <p className="text-gray-600">
                        Tổng hợp các đầu sách song ngữ Trung - Việt hay nhất.
                    </p>
                </header>

                {!selectedBook ? (
                    <div className="space-y-4 max-w-4xl mx-auto">
                        <div className="space-y-4">
                            {currentBooks.map((book) => (
                                <div
                                    key={book.id}
                                    className="bg-white rounded-2xl p-4 flex items-center gap-4 border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group cursor-pointer"
                                    onClick={() => handleSelectBook(book)}
                                >
                                    <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:bg-orange-100 transition-colors">
                                        <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.246 18.477 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1 group-hover:text-orange-600 transition-colors truncate">
                                            {book.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm line-clamp-2">
                                            {book.description}
                                        </p>
                                    </div>
                                    <div className="flex-shrink-0 hidden sm:block">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSelectBook(book);
                                            }}
                                            className="px-6 py-2.5 bg-orange-50 text-orange-600 font-bold rounded-xl hover:bg-orange-600 hover:text-white transition-all"
                                        >
                                            Đọc ngay
                                        </button>
                                    </div>
                                    <div className="sm:hidden text-orange-400 group-hover:translate-x-1 transition-transform">
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-8 pt-4 border-t border-gray-100">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-white hover:border-orange-300 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    aria-label="Trang trước"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                <div className="flex items-center gap-1">
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${currentPage === page
                                                ? 'bg-orange-600 text-white shadow-md shadow-orange-100'
                                                : 'text-gray-500 hover:bg-white hover:text-orange-600'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-white hover:border-orange-300 hover:text-orange-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                    aria-label="Trang sau"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-lg">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
                            <button
                                onClick={handleBack}
                                className="flex items-center gap-2 text-gray-600 hover:text-orange-600 font-medium transition"
                            >
                                ← Quay lại danh sách
                            </button>
                            <h2 className="text-lg font-bold text-gray-900 hidden sm:block truncate px-4">
                                {selectedBook.title}
                            </h2>
                            <div className="w-20 sm:w-auto"></div>
                        </div>
                        <div className="relative aspect-[3/4] sm:aspect-video w-full bg-gray-50">
                            {iframeLoading && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                    <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-600 rounded-full animate-spin"></div>
                                    <p className="text-sm text-gray-500 font-medium">Đang tải sách...</p>
                                </div>
                            )}
                            <iframe
                                src={`https://drive.google.com/file/d/${selectedBook.driveId}/preview`}
                                className="w-full h-full border-none"
                                allow="autoplay"
                                title={selectedBook.title}
                                onLoad={() => setIframeLoading(false)}
                            ></iframe>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
