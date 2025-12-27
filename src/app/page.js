import { getLessons } from '@/lib/googleSheet';
import LessonListClient from './LessonListClient';



export default async function Page() {
  const lessons = await getLessons(); // Lấy dữ liệu từ Apps Script tại Server

  return (
    <LessonListClient allLessons={lessons} />
  );
}