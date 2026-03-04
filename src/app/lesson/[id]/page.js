// app/lesson/[id]/page.js

import { getLessons } from '@/lib/googleSheet';
import LessonClientPage from './LessonClientPage';

export async function generateStaticParams() {
  const lessons = await getLessons();

  if (!lessons || !Array.isArray(lessons)) return [];

  return lessons
    .filter((lesson) => lesson.id)
    .map((lesson) => ({
      id: String(lesson.id),
    }));
}

export async function generateMetadata({ params }) {
  const { id } = await params;
  const allLessons = await getLessons();
  const lesson = allLessons?.find((l) => String(l.id) === id);

  if (!lesson) {
    return { title: 'Bài học không tồn tại' };
  }

  const title = lesson.title || `Bài học ${id}`;
  const description =
    lesson.description ||
    `Học tiếng Trung: ${title}. Video, tài liệu và bài tập kèm theo.`;

  return {
    title,
    description,
    openGraph: {
      title: `${title} | Mr. Chinese Channel`,
      description,
      type: 'article',
      images: lesson.thumbnail
        ? [{ url: lesson.thumbnail, width: 1200, height: 630, alt: title }]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${title} | Mr. Chinese Channel`,
      description,
    },
  };
}

export default async function Page({ params }) {
  const { id } = await params;
  const allLessons = await getLessons();

  const lesson = allLessons?.find((l) => String(l.id) === id);

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