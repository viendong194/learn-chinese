import { useState, useMemo } from 'react';

export default function useLessonsFilter(allLessons, lessonsPerPage = 20) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newer"); // Mặc định là 'newer'
  const [currentPage, setCurrentPage] = useState(1);

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

  const totalPages = Math.ceil(filteredAndSortedLessons.length / lessonsPerPage);
  const indexOfLastLesson = currentPage * lessonsPerPage;
  const indexOfFirstLesson = indexOfLastLesson - lessonsPerPage;
  const currentLessons = filteredAndSortedLessons.slice(indexOfFirstLesson, indexOfLastLesson);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); 
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    setCurrentPage(1);
  };

  return {
    searchTerm,
    sortOrder,
    currentPage,
    currentLessons,
    totalPages,
    hasResults: filteredAndSortedLessons.length > 0,
    handleSearchChange,
    handleSortChange,
    setCurrentPage
  };
}
