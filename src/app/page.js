import { getLessons } from '@/lib/googleSheet';
import LessonListClient from './LessonListClient';

export const metadata = {
  title: 'Bài học',
  description:
    'Danh sách bài học tiếng Trung giao tiếp qua podcast. Mỗi bài có video YouTube, tài liệu và bài tập kèm theo.',
  openGraph: {
    title: 'Bài học tiếng Trung | Mr. Chinese Channel',
    description: 'Danh sách bài học tiếng Trung giao tiếp qua podcast. Video, tài liệu, bài tập.',
  },
};

export default async function Page() {
  const lessons = await getLessons();

  return (
    <LessonListClient allLessons={lessons} />
  );
}