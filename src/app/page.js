import { getLessons } from '@/lib/googleSheet';
import LessonListClient from './LessonListClient';

export const metadata = {
  title: 'Bài học tiếng Trung',
  description:
    'Danh sách bài học học tiếng Trung (Chinese) qua podcast Mr. Chinese Channel: giao tiếp, ngữ pháp, từ vựng. Mỗi bài có video, tài liệu và bài tập. Ôn tập cho luyện thi HSK.',
  keywords: ['bài học tiếng Trung', 'học Chinese', 'podcast tiếng Trung', 'luyện thi HSK', 'Mr. Chinese Channel', 'ngữ pháp tiếng Trung'],
  openGraph: {
    title: 'Bài học tiếng Trung | Mr. Chinese Channel - Học Chinese, Luyện thi HSK',
    description: 'Danh sách bài học tiếng Trung giao tiếp qua podcast. Video, tài liệu, bài tập. Từ vựng, ngữ pháp.',
  },
};

export default async function Page() {
  const lessons = await getLessons();

  return (
    <LessonListClient allLessons={lessons} />
  );
}