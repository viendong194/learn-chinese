"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function LessonListClient({ allLessons }) {
  // 1. Khởi tạo State
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newer"); // Mặc định là 'newer' (ID lớn đến bé)
  const [currentPage, setCurrentPage] = useState(1);
  const lessonsPerPage = 20;

  // 2. Logic Lọc và Sắp xếp dữ liệu
  const filteredAndSortedLessons = useMemo(() => {
    if (!allLessons) return [];
    
    // Bước lọc
    let result = allLessons.filter(lesson =>
      lesson.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lesson.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Bước sắp xếp theo ID
    result.sort((a, b) => {
      if (sortOrder === "newer") {
        return b.id - a.id; // Lớn đến bé
      } else {
        return a.id - b.id; // Bé đến lớn
      }
    });

    return result;
  }, [searchTerm, sortOrder, allLessons]);

  // 3. Logic Phân trang
  const totalPages = Math.ceil(filteredAndSortedLessons.length / lessonsPerPage);
  const indexOfLastLesson = currentPage * lessonsPerPage;
  const indexOfFirstLesson = indexOfLastLesson - lessonsPerPage;
  const currentLessons = filteredAndSortedLessons.slice(indexOfFirstLesson, indexOfLastLesson);

  // Xử lý khi gõ tìm kiếm
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  // Xử lý khi đổi kiểu sắp xếp
  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* THANH TÌM KIẾM & SORT (STICKY) */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            
            <div className="flex flex-col sm:flex-row gap-3 w-full md:max-w-2xl">
              {/* Ô tìm kiếm */}
              <div className="relative flex-grow">
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

              {/* Dropdown Sort */}
              <div className="relative min-w-[140px]">
                <select
                  value={sortOrder}
                  onChange={handleSortChange}
                  className="w-full pl-3 pr-8 py-2.5 bg-gray-100 border-none rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-sm appearance-none cursor-pointer font-medium text-gray-700"
                >
                  <option value="newer">Mới nhất (Newer)</option>
                  <option value="older">Cũ nhất (Older)</option>
                </select>
                <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-8">
        {/* GRID HIỂN THỊ */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {currentLessons.map((lesson) => (
            <Link key={lesson.id} href={`/lesson/${lesson.id}`} className="group">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                <div className="relative aspect-video overflow-hidden bg-gray-200">
                  <img
                    src={lesson.thumbnail || `https://img.youtube.com/vi/${lesson.youtubeId}/maxresdefault.jpg`}
                    alt={lesson.title}
                    className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  {/* Badge hiển thị ID để dễ kiểm tra sort */}
                  <span className="absolute top-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full backdrop-blur-sm">
                    ID: {lesson.id}
                  </span>
                </div>
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
        {filteredAndSortedLessons.length === 0 && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500">Không tìm thấy bài học nào phù hợp với "{searchTerm}"</p>
          </div>
        )}

        {/* THANH PHÂN TRANG */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-12 gap-1 md:gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
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
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-9 h-9 md:w-10 md:h-10 rounded-lg border text-sm font-bold transition-all ${
                      currentPage === pageNum 
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