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
      {/* 1. Video Player Section */}
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
        {/* Tiêu đề bài học */}
        <div className="mb-12">
            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 leading-tight antialiased">
                <span className="inline-block w-2 h-8 bg-blue-600 rounded-full mr-3 align-middle"></span>
                {lesson.title}
            </h1>
        </div>

        <div className="space-y-16">
          {/* PHẦN 1: TÀI LIỆU */}
          <section>
            <h3 className="font-bold text-lg text-gray-800 mb-6 flex items-center gap-2 antialiased">
              📂 Tài liệu bài giảng
            </h3>
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 transition-all hover:shadow-md">
                {!scriptUnlocked ? (
                  <div className="text-center py-4">
                    <div className="bg-blue-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 transform rotate-3">
                      <span className="text-3xl">🔒</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-6 max-w-[280px] mx-auto leading-relaxed">
                      Vui lòng click ủng hộ qua Shopee để nhận link tải tài liệu (Script).
                    </p>
                    <button
                      onClick={handleUnlockAndGo}
                      className="w-full sm:w-auto bg-[#ee4d2d] text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-[#ff5733] active:scale-95 transition-all shadow-lg shadow-orange-100 flex items-center justify-center gap-2 mx-auto font-sans"
                    >
                      🛒 Mở khóa qua Shopee
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-4 animate-in fade-in zoom-in duration-500">
                    <div className="bg-green-50 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6">
                      <span className="text-3xl text-green-500">🔓</span>
                    </div>
                    <p className="text-green-600 font-bold mb-6">Đã sẵn sàng tải xuống!</p>
                    <button
                      onClick={handleDownload}
                      className="w-full sm:w-auto bg-blue-600 text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-100 flex items-center justify-center gap-2 mx-auto"
                    >
                      📥 Tải xuống Script ngay
                    </button>
                  </div>
                )}
            </div>
          </section>

          {/* PHẦN 2: BÀI TẬP */}
          <section>
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2 antialiased tracking-tight text-gray-900">
              <span className="bg-orange-500 text-white p-1.5 rounded-lg shadow-sm flex items-center justify-center text-xl">📝</span> 
              Bài tập củng cố
            </h2>

            {!exerciseUnlocked ? (
              <div className="bg-orange-50 border-2 border-dashed border-orange-200 rounded-[2rem] p-12 text-center">
                <div className="text-4xl mb-4">⭐</div>
                <p className="text-orange-800 font-medium mb-6">Luyện tập để ghi nhớ bài học lâu hơn</p>
                <button
                  onClick={handleUnlockExercise}
                  className="bg-gray-900 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-black hover:-translate-y-1 transition-all active:translate-y-0 font-sans"
                >
                  🚀 Mở khóa hệ thống bài tập
                </button>
              </div>
            ) : (
              <div className="space-y-10 animate-in fade-in slide-in-from-bottom-5 duration-700">
                {exerciseData?.exercises?.map((item, index) => (
                  <div key={`ex-${index}`} className="bg-white rounded-3xl p-1 border border-gray-100 shadow-sm overflow-hidden transition-all hover:shadow-md">
                     <div className="p-1">
                        {item.type === 'fill_blank' && <FillBlank data={item} />}
                        {item.type === 'mcq' && <MCQ data={item} />}
                        {item.type === 'matching' && <Matching data={item} />}
                        {item.type === 'order' && <OrderTask data={item} />}
                     </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* PHẦN 3: ỦNG HỘ (Đặt ở cuối cùng trước footer) */}
          <section className="bg-white rounded-[2.5rem] p-8 md:p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
            {/* Họa tiết trang trí nhẹ nhàng */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-50 rounded-full blur-3xl group-hover:bg-orange-50 transition-colors duration-500"></div>
            
            <div className="relative flex flex-col md:flex-row items-center gap-10">
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4">
                   <span className="text-2xl">☕</span>
                   <h3 className="text-xl font-bold text-gray-800">Cảm ơn bạn đã học tập!</h3>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Nếu bạn thấy những bài học này hữu ích, hãy mời mình một ly cà phê để tiếp thêm động lực duy trì kênh và phát triển thêm nhiều nội dung miễn phí nhé. Cảm ơn sự ủng hộ của bạn! 
                </p>
              </div>
              
              <div className="flex-shrink-0">
                <div className="bg-white p-3 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-50 transform transition-transform hover:scale-105 duration-300">
                  <img 
                    src="/images/qr-code.png" 
                    alt="QR Donation" 
                    className="w-36 h-36 md:w-40 md:h-40 object-contain"
                  />
                  <div className="text-center mt-3">
                    <span className="text-[10px] font-black text-gray-800 uppercase bg-gray-100 px-3 py-1 rounded-full">Quét mã QR</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* 3. ĐIỀU HƯỚNG BÀI HỌC */}
        <footer className="mt-20 pt-10 border-t border-gray-200">
          <div className="grid grid-cols-3 items-center">
            <div className="flex justify-start">
              {prevLesson && (
                <Link href={`/lesson/${prevLesson.id}`} className="group max-w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 group-hover:border-blue-500 group-hover:bg-blue-50 transition-all text-gray-400 group-hover:text-blue-600">
                      ←
                    </div>
                    <div className="hidden sm:block overflow-hidden">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Quay lại</p>
                      <p className="text-sm font-bold text-gray-700 group-hover:text-blue-600 truncate max-w-[140px]">{prevLesson.title}</p>
                    </div>
                  </div>
                </Link>
              )}
            </div>

            <div className="flex justify-center">
              <Link href="/" className="w-12 h-12 flex items-center justify-center bg-gray-100 rounded-2xl text-gray-400 hover:bg-orange-600 hover:text-white transition-all duration-300 shadow-sm">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Link>
            </div>

            <div className="flex justify-end text-right">
              {nextLesson && (
                <Link href={`/lesson/${nextLesson.id}`} className="group max-w-full">
                  <div className="flex items-center gap-3">
                    <div className="hidden sm:block overflow-hidden">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Tiếp theo</p>
                      <p className="text-sm font-bold text-gray-700 group-hover:text-blue-600 truncate max-w-[140px]">{nextLesson.title}</p>
                    </div>
                    <div className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 group-hover:border-blue-500 group-hover:bg-blue-50 transition-all text-gray-400 group-hover:text-blue-600">
                      →
                    </div>
                  </div>
                </Link>
              )}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}