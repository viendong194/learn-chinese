"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function LessonListClient({ allLessons }) {
  // 1. Khởi tạo State
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const lessonsPerPage = 20; // 4x5 = 20 bài mỗi trang

  // 2. Logic Lọc dữ liệu theo tìm kiếm
  const filteredLessons = useMemo(() => {
    if (!allLessons) return [];
    return allLessons.filter(lesson =>
      lesson.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, allLessons]);

  // 3. Logic Phân trang
  const totalPages = Math.ceil(filteredLessons.length / lessonsPerPage);
  const indexOfLastLesson = currentPage * lessonsPerPage;
  const indexOfFirstLesson = indexOfLastLesson - lessonsPerPage;
  const currentLessons = filteredLessons.slice(indexOfFirstLesson, indexOfLastLesson);

  // Xử lý khi gõ tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset về trang 1 khi tìm kiếm
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* THANH TÌM KIẾM (STIKY) */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-xl font-black text-gray-800 uppercase tracking-tight">
              mr.chinesechannel
            </h1>
            
            <div className="relative w-full md:max-w-md">
              <input
                type="text"
                placeholder="Nhập tên bài học để tìm..."
                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm"
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <svg className="absolute left-3 top-3 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {/* GRID HIỂN THỊ: 2 cột Mobile, 4 cột PC */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {currentLessons.map((lesson) => (
            <Link key={lesson.id} href={`/lesson/${lesson.id}`} className="group">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-gray-200">
                  <img
                    src={lesson.thumbnail || `https://img.youtube.com/vi/${lesson.youtubeId}/maxresdefault.jpg`}
                    alt={lesson.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                {/* Content */}
                <div className="p-3 md:p-4 flex-grow">
                  <h2 className="font-bold text-gray-900 text-sm md:text-base line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {lesson.title}
                  </h2>
                  <p className="text-[11px] md:text-xs text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                    {lesson.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* THÔNG BÁO KHI KHÔNG CÓ KẾT QUẢ */}
        {filteredLessons.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500">Không tìm thấy bài học nào phù hợp với "{searchTerm}"</p>
          </div>
        )}

        {/* THANH PHÂN TRANG (PAGINATION) */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-1 md:gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="p-2 md:px-4 py-2 rounded-lg border bg-white disabled:opacity-20 hover:bg-gray-50 text-sm font-medium transition"
            >
              Trước
            </button>
            
            {/* Hiển thị danh sách số trang */}
            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, i) => {
                const pageNum = i + 1;
                // Chỉ hiển thị tối đa 5 nút trang để tránh tràn màn hình mobile
                if (totalPages > 5 && Math.abs(pageNum - currentPage) > 2) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-lg border text-sm font-bold transition-all ${
                      currentPage === pageNum 
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200' 
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
              onClick={() => setCurrentPage(p => p + 1)}
              className="p-2 md:px-4 py-2 rounded-lg border bg-white disabled:opacity-20 hover:bg-gray-50 text-sm font-medium transition"
            >
              Sau
            </button>
          </div>
        )}
      </div>
    </div>
  );
}