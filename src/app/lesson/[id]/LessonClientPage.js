"use client";

import { useState } from 'react';
import Link from 'next/link';
import FillBlank from '@/components/FillBlank';
import Matching from '@/components/Matching';
import MCQ from '@/components/MCQ';
import OrderTask from '@/components/OrderTask';


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

  // Parse JSON từ Google Sheets (Lưu ý: Sheet trả về chuỗi nên cần JSON.parse)
  let exerciseData = null;
  try {
    exerciseData = typeof lesson.tasks === 'string' ? JSON.parse(lesson.tasks) : lesson.tasks;
  } catch (e) {
    console.error("Lỗi parse bài tập JSON");
  }

  // Tìm bài trước và bài sau trong danh sách
  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Logic mở khóa


  const handleUnlockExercise = () => {
    window.open(lesson.shopeeLinkExercise, '_blank');
    setExerciseUnlocked(true);
  };

  const handleUnlockAndGo = () => {
    if (!lesson.shopeeLinkDesc) {
      alert("Link Shopee chưa được cập nhật!");
      return;
    }
    
    setScriptUnlocked(true);
    // Mở link Shopee ở tab mới
    window.open(lesson.shopeeLinkDesc, '_blank');
  };

  const handleDownload = () => {
    // lesson.script bây giờ đang chứa link: https://drive.google.com/uc?export=download&id=...
    if (lesson.script) {
      window.open(lesson.script, '_blank');
    } else {
      alert("Không tìm thấy link tài liệu!");
    }
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
          <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  📂 Tài liệu bài giảng
                </h3>
              </div>

              <div className="p-8 text-center">
                {!scriptUnlocked ? (
                  // Giao diện khi CHƯA click Shopee
                  <div className="space-y-4">
                    <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔒</span>
                    </div>
                    <p className="text-gray-600 text-sm">
                      Vui lòng click ủng hộ qua Shopee để mở khóa link tải Script (File .txt)
                    </p>
                    <button
                      onClick={handleUnlockAndGo}
                      disabled={scriptUnlocked}
                      className="bg-[#ee4d2d] text-white px-8 py-3 rounded-full font-bold hover:scale-105 transition disabled:bg-gray-400 flex items-center gap-2 mx-auto"
                    >
                      {scriptUnlocked ? "Đang xác thực..." : "🛒 Mở khóa qua Shopee"}
                    </button>
                  </div>
                ) : (
                  // Giao diện khi ĐÃ click Shopee
                  <div className="space-y-4 animate-in fade-in zoom-in duration-500">
                    <div className="bg-green-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔓</span>
                    </div>
                    <p className="text-green-600 font-medium">Đã mở khóa thành công!</p>
                    <button
                      onClick={handleDownload}
                      className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 shadow-lg flex items-center gap-2 mx-auto"
                    >
                      📥 Tải xuống Script (.txt)
                    </button>
                    <p className="text-xs text-gray-400">Cảm ơn bạn đã ủng hộ!</p>
                  </div>
                )}
              </div>
            </section>

          {/* PHẦN 2: BÀI TẬP THỰC HÀNH */}
          <section className="mt-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
          <span className="bg-orange-500 text-white p-1 rounded">📝</span> Bài tập củng cố
        </h2>

        {!exerciseUnlocked ? (
          <div className="bg-orange-50 border-2 border-dashed border-orange-200 rounded-2xl p-10 text-center">
            <button
              onClick={handleUnlockExercise}
              className="bg-[#ee4d2d] text-white px-10 py-4 rounded-full font-bold shadow-xl hover:scale-105 transition"
            >
              🛒 Mở khóa bài tập qua Shopee
            </button>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
            {exerciseData?.exercises?.map((item, index) => {
              const uniqueKey = `ex-${index}`;
              switch (item.type) {
                case 'fill_blank': return <FillBlank key={uniqueKey} data={item} />;
                case 'mcq':        return <MCQ key={uniqueKey} data={item} />;
                case 'matching':   return <Matching key={uniqueKey} data={item} />;
                case 'order':      return <OrderTask key={uniqueKey} data={item} />;
                default: return null;
              }
            })}
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

