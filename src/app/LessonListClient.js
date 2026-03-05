"use client";

import useLessonsFilter from '@/hooks/useLessonsFilter';
import SearchBar from '@/components/home/SearchBar';
import LessonCard from '@/components/home/LessonCard';
import Pagination from '@/components/home/Pagination';

export default function LessonListClient({ allLessons }) {
  const {
    searchTerm,
    sortOrder,
    currentPage,
    currentLessons,
    totalPages,
    hasResults,
    handleSearchChange,
    handleSortChange,
    setCurrentPage
  } = useLessonsFilter(allLessons);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SearchBar
        searchTerm={searchTerm}
        sortOrder={sortOrder}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortChange}
      />

      <div className="container mx-auto px-4 mt-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          {currentLessons.map((lesson) => (
            <LessonCard key={lesson.id} lesson={lesson} />
          ))}
        </div>

        {!hasResults && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-500">Không tìm thấy bài học nào phù hợp với "{searchTerm}"</p>
          </div>
        )}

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}