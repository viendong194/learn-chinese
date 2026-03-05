"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import FillBlank from '@/components/FillBlank';
import Matching from '@/components/Matching';
import MCQ from '@/components/MCQ';
import OrderTask from '@/components/OrderTask';

export default function LessonClientPage({ lesson, allLessons }) {
  const [scriptUnlocked, setScriptUnlocked] = useState(false);
  const [exerciseUnlocked, setExerciseUnlocked] = useState(false);

  const exerciseData = useMemo(() => {
    if (!lesson?.tasks) return null;
    try {
      return typeof lesson.tasks === 'string' ? JSON.parse(lesson.tasks) : lesson.tasks;
    } catch (e) {
      console.error("Lỗi parse bài tập JSON");
      return null;
    }
  }, [lesson?.tasks]);

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="text-6xl mb-4">😢</div>
        <h2 className="text-xl font-bold text-gray-800">Không tìm thấy bài học!</h2>
        <Link href="/" className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition">
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  const handleUnlockAndGo = () => {
    setScriptUnlocked(true);
    window.open(lesson.shopeeLinkDesc, '_blank');
  };

  const handleUnlockExercise = () => {
    setExerciseUnlocked(true);
    window.open(lesson.shopeeLinkExercise, '_blank');
  };

  const handleDownload = () => {
    if (lesson.script) window.open(lesson.script, '_blank');
    else alert("Không tìm thấy link tài liệu!");
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-20 selection:bg-blue-100">
      {/* VIDEO */}
      <div className="bg-[#0f172a] shadow-2xl">
        <div className="max-w-5xl mx-auto aspect-video shadow-2xl overflow-hidden md:rounded-b-2xl">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${lesson.youtubeId}?rel=0&modestbranding=1`}
            title={lesson.title}
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-10">
        {/* TITLE */}
        <div className="mb-12">
          <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
            <span className="inline-block w-2 h-8 bg-blue-600 rounded-full mr-3"></span>
            {lesson.title}
          </h1>
        </div>

        <div className="space-y-16">
          {/* SCRIPT */}
          <section>
            <h3 className="font-bold text-lg mb-6">📂 Tài liệu bài giảng</h3>
            <div className="bg-white rounded-3xl p-8 border">
              {!scriptUnlocked ? (
                <div className="text-center">
                  <p className="text-gray-500 mb-6">
                    Click ủng hộ để nhận link tải Script.
                  </p>
                  <button
                    onClick={handleUnlockAndGo}
                    className="bg-[#ee4d2d] text-white px-10 py-3 rounded-2xl font-bold"
                  >
                    🛒 Mở khóa qua Shopee
                  </button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-green-600 font-bold mb-4">🔓 Đã mở khóa</p>
                  <button
                    onClick={handleDownload}
                    className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-bold"
                  >
                    📥 Tải Script
                  </button>
                </div>
              )}
            </div>
          </section>

          {/* EXERCISE */}
          <section>
            <h2 className="text-2xl font-bold mb-8">📝 Bài tập</h2>
            {!exerciseUnlocked ? (
              <div className="text-center bg-orange-50 p-10 rounded-3xl">
                <button
                  onClick={handleUnlockExercise}
                  className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold"
                >
                  🚀 Mở khóa bài tập
                </button>
              </div>
            ) : (
              <div className="space-y-10">
                {exerciseData?.exercises?.map((item, index) => (
                  <div key={index} className="bg-white rounded-3xl p-4 border">
                    {item.type === 'fill_blank' && <FillBlank data={item} />}
                    {item.type === 'mcq' && <MCQ data={item} />}
                    {item.type === 'matching' && <Matching data={item} />}
                    {item.type === 'order' && <OrderTask data={item} />}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Link Từ vựng HSK */}
          <section className="bg-white rounded-[2.5rem] p-8 border shadow-sm">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="flex-1 text-center md:text-left">
                <h3 className="text-xl font-bold mb-2">📚 Từ vựng HSK</h3>
                <p className="text-gray-500 text-sm">
                  Học từ vựng HSK 1–6 bằng flashcard, có phát âm và đánh dấu đã thuộc.
                </p>
              </div>
              <Link
                href="/vocab"
                className="flex-shrink-0 px-8 py-4 rounded-2xl bg-orange-600 text-white font-bold hover:bg-orange-700 transition shadow-lg shadow-orange-200"
              >
                Vào học từ vựng →
              </Link>
            </div>
          </section>
        </div>

        {/* FOOTER */}
        <footer className="mt-20 pt-10 border-t">
          <div className="grid grid-cols-3 items-center">
            <div>{prevLesson && <Link href={`/lesson/${prevLesson.id}`}>←</Link>}</div>
            <div className="text-center"><Link href="/">🏠</Link></div>
            <div className="text-right">{nextLesson && <Link href={`/lesson/${nextLesson.id}`}>→</Link>}</div>
          </div>
        </footer>
      </div>
    </div>
  );
}
