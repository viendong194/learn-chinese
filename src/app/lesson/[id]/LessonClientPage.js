"use client";

import { useState } from 'react';
import Link from 'next/link';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function LessonClientPage({ lesson, allLessons }) {
  // Trạng thái mở khóa riêng biệt
  const [scriptUnlocked, setScriptUnlocked] = useState(false);
  const [exerciseUnlocked, setExerciseUnlocked] = useState(false);

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-xl font-semibold text-gray-600">Không tìm thấy bài học!</h2>
        <Link href="/" className="mt-4 text-blue-600 hover:underline">Quay lại danh sách</Link>
      </div>
    );
  }

  // Tìm bài trước và bài sau trong danh sách
  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Logic mở khóa
  const handleUnlockScript = () => {
    window.open(lesson.shopeeLinkScript, '_blank');
    setScriptUnlocked(true);
  };

  const handleUnlockExercise = () => {
    window.open(lesson.shopeeLinkExercise, '_blank');
    setExerciseUnlocked(true);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* 1. Video Player */}
      <div className="bg-black w-full shadow-2xl">
        <div className="max-w-5xl mx-auto aspect-video">
          <iframe
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${lesson.youtubeId}?rel=0`}
            title={lesson.title}
            allowFullScreen
          ></iframe>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-8">
        {/* Tiêu đề bài học */}
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-10 border-l-4 border-blue-600 pl-4">
          {lesson.title}
        </h1>

        <div className="space-y-12">
          {/* PHẦN 1: SCRIPT VIDEO */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="p-1.5 bg-blue-100 text-blue-700 rounded-md font-bold text-[10px] uppercase tracking-widest">Phần 1</span>
              <h2 className="text-xl font-bold text-gray-800">Script chi tiết</h2>
            </div>

            {!scriptUnlocked ? (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center transition-all">
                <p className="text-gray-600 mb-5 font-medium">Click Shopee để xem nội dung Script</p>
                <button
                  onClick={handleUnlockScript}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform active:scale-95"
                >
                  🛒 Mở khóa Script
                </button>
              </div>
            ) : (
              <div className="bg-blue-50/40 p-6 rounded-2xl border border-blue-100 text-gray-700 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-500">
                <p className="whitespace-pre-wrap italic">"{lesson.script}"</p>
              </div>
            )}
          </section>

          {/* PHẦN 2: BÀI TẬP THỰC HÀNH */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <span className="p-1.5 bg-green-100 text-green-700 rounded-md font-bold text-[10px] uppercase tracking-widest">Phần 2</span>
              <h2 className="text-xl font-bold text-gray-800">Bài tập thực hành</h2>
            </div>

            {!exerciseUnlocked ? (
              <div className="bg-orange-50 border-2 border-dashed border-orange-200 rounded-2xl p-8 text-center transition-all">
                <p className="text-orange-800/70 mb-5 font-medium">Làm bài tập để củng cố kiến thức</p>
                <button
                  onClick={handleUnlockExercise}
                  className="bg-[#ee4d2d] hover:bg-[#d73211] text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform active:scale-95"
                >
                  🛒 Mở khóa Bài tập
                </button>
              </div>
            ) : (
              <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-gray-800 animate-in fade-in slide-in-from-top-2 duration-500 shadow-sm">
                <div className="whitespace-pre-wrap font-medium">{lesson.exercise}</div>
              </div>
            )}
          </section>
        </div>

        {/* 3. ĐIỀU HƯỚNG BÀI HỌC */}
        <div className="flex justify-between items-center mt-20 pt-8 border-t border-gray-100">
          {prevLesson ? (
            <Link href={`/lesson/${prevLesson.id}`} className="group flex flex-col items-start gap-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Bài trước</span>
              <div className="flex items-center gap-2 text-gray-700 group-hover:text-blue-600 transition">
                <div className="p-2 border rounded-full group-hover:border-blue-500 group-hover:bg-blue-50">←</div>
                <span className="text-sm font-bold hidden sm:inline truncate max-w-[150px]">{prevLesson.title}</span>
              </div>
            </Link>
          ) : <div />}

          <Link href="/" className="p-2 text-gray-400 hover:text-gray-900 transition">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </Link>

          {nextLesson ? (
            <Link href={`/lesson/${nextLesson.id}`} className="group flex flex-col items-end gap-1 text-right">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Bài tiếp theo</span>
              <div className="flex items-center gap-2 text-gray-700 group-hover:text-blue-600 transition">
                <span className="text-sm font-bold hidden sm:inline truncate max-w-[150px]">{nextLesson.title}</span>
                <div className="p-2 border rounded-full group-hover:border-blue-500 group-hover:bg-blue-50">→</div>
              </div>
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}

