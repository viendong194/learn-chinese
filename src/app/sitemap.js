import { getLessons } from '@/lib/googleSheet';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://mrchinese.viendong.online/';

export default async function sitemap() {
  const lessons = await getLessons();
  const lessonUrls = Array.isArray(lessons)
    ? lessons
        .filter((l) => l.id)
        .map((lesson) => ({
          url: `${BASE_URL}/lesson/${lesson.id}`,
          lastModified: new Date(),
          changeFrequency: 'weekly',
          priority: 0.8,
        }))
    : [];

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${BASE_URL}/vocab`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    ...lessonUrls,
  ];
}
