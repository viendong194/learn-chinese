// app/lesson/[id]/page.js


import { getLessons } from '@/lib/googleSheet';
import LessonClientPage from './LessonClientPage';

export async function generateStaticParams() {
  const lessons = await getLessons();
  
  // Kiểm tra nếu lessons không phải mảng hoặc rỗng
  if (!lessons || !Array.isArray(lessons)) return [];

  return lessons
    .filter(lesson => lesson.id) // Loại bỏ các hàng không có ID (hàng trống)
    .map((lesson) => ({
      id: String(lesson.id), // Bắt buộc chuyển sang string
    }));
}

export default async function Page({ params }) {
  const { id } = await params;
  const allLessons = await getLessons();
  
  // Tìm bài học (ép kiểu về string để so sánh chính xác)
  const lesson = allLessons.find((l) => String(l.id) === id);

  if (!lesson) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">Bài học không tồn tại!</h2>
        <a href="/" className="text-blue-500 underline">Quay lại trang chủ</a>
      </div>
    );
  }

  return <LessonClientPage lesson={lesson} allLessons={allLessons} />;
}