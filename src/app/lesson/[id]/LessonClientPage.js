"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import FillBlank from '@/components/FillBlank';
import Matching from '@/components/Matching';
import MCQ from '@/components/MCQ';
import OrderTask from '@/components/OrderTask';
import TrueFalse from '@/components/TrueFalse';

export default function LessonClientPage({ lesson, allLessons }) {
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Quiz Mode states
  const [currentExIndex, setCurrentExIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  // Audio refs
  const playSound = (type) => {
    try {
      const audio = new Audio(type === 'correct' ? '/sounds/correct.mp3' : '/sounds/wrong.mp3');
      audio.volume = 0.5;
      audio.play().catch(e => console.log("Audio play failed:", e));
    } catch (e) { }
  };

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
    setIsUnlocked(true);
    window.open(lesson.shopeeLinkDesc || lesson.shopeeLinkExercise || 'https://shopee.vn', '_blank');
  };

  const handleDownload = () => {
    if (lesson.script) window.open(lesson.script, '_blank');
    else alert("Không tìm thấy link tài liệu!");
  };

  const handleExerciseComplete = (isCorrect) => {
    playSound(isCorrect ? 'correct' : 'wrong');

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (currentExIndex < (exerciseData?.exercises?.length || 0) - 1) {
        setCurrentExIndex(prev => prev + 1);
      } else {
        setQuizFinished(true);
      }
    }, 500); // Thêm một chút delay trước khi chuyển câu tiếp theo
  };

  const currentExercise = exerciseData?.exercises?.[currentExIndex];

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
          {/* UNLOCK OVERVIEW / SCRIPT */}
          {!isUnlocked ? (
            <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-[2.5rem] p-8 md:p-12 border border-blue-800 shadow-2xl overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5 transform translate-x-1/4 -translate-y-1/4">
                <span className="text-[15rem]">🔒</span>
              </div>
              <div className="relative z-10 text-center md:text-left flex flex-col md:flex-row items-center gap-8">
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-4">
                    Nâng cấp trải nghiệm học tập
                  </h2>
                  <p className="text-blue-200 text-lg mb-6">
                    Ấn link Shopee để xem <strong>tài liệu Script</strong> và <strong>bài tập</strong> cho bài học này.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-blue-100 mb-8 md:mb-0">
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">✓</div>
                      <span>Tải script nội dung video chi tiết</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">✓</div>
                      <span>Bài tập đa dạng (Trắc nghiệm, nối từ...)</span>
                    </div>
                    <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center shrink-0">✓</div>
                      <span>Chấm điểm và phản hồi tức thì</span>
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 w-full md:w-auto">
                  <button
                    onClick={handleUnlockAndGo}
                    className="w-full group relative inline-flex items-center justify-center gap-3 px-8 py-5 font-bold text-white transition-all duration-300 bg-gradient-to-r from-[#ee4d2d] to-[#ff7357] rounded-2xl hover:shadow-lg hover:shadow-[#ee4d2d]/40 focus:outline-none hover:-translate-y-1"
                  >
                    <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 24c6.627 0 12-5.373 12-12S18.627 0 12 0 0 5.373 0 12s5.373 12 12 12zm3.328-15.01l-1.636-.505c-.378-.112-.516-.27-.516-.484 0-.175.145-.333.407-.333.3 0 .618.15.823.364l1.205-1.127a3.004 3.004 0 00-2.164-.86c-1.396 0-2.316.812-2.316 1.838 0 1.15.863 1.554 2.14 1.942l1.246.388c.371.109.53.284.53.506 0 .204-.15.352-.468.352-.352 0-.745-.194-1.018-.466l-1.284 1.258c.642.661 1.536 1.012 2.457 1.012 1.503 0 2.417-.899 2.417-1.921 0-1.2-1.026-1.57-2.167-1.95v-.012h.344zm-7.669 3.08l1.458-6.195h2.15l-1.458 6.195h-2.15zM5.529 8h8.053l-.297 1.242H7.39l-.49 2.05h5.454l-.295 1.24h-5.455l-.657 2.76H3.8l1.729-7.292z" />
                    </svg>
                    <span className="text-lg">Mở khóa ngay lập tức</span>
                  </button>
                </div>
              </div>
            </section>
          ) : (
            <section className="bg-white rounded-3xl p-6 border shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-2xl">
                  📄
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">Tài liệu bài giảng</h3>
                  <p className="text-gray-500 text-sm">Nội dung text của video và từ vựng.</p>
                </div>
              </div>
              <button
                onClick={handleDownload}
                className="w-full sm:w-auto flex justify-center items-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-3 rounded-xl font-bold transition-colors"
              >
                📥 Tải Script PDF
              </button>
            </section>
          )}

          {/* EXERCISE */}
          {isUnlocked && (
            <section>
              <h2 className="text-2xl font-bold mb-8">📝 Bài tập</h2>
              {exerciseData?.exercises && exerciseData.exercises.length > 0 ? (
                <div className="bg-white rounded-3xl p-6 md:p-10 border shadow-lg relative overflow-hidden">
                  {!quizFinished ? (
                    <>
                      {/* Progress Bar */}
                      <div className="mb-8">
                        <div className="flex justify-between text-sm font-bold text-gray-500 mb-2">
                          <span>Câu {currentExIndex + 1} / {exerciseData.exercises.length}</span>
                          <span className="text-orange-500">Điểm: {score}</span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-orange-500 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${((currentExIndex) / exerciseData.exercises.length) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Current Exercise */}
                      <div className="min-h-[300px] flex flex-col justify-center">
                        <div key={currentExIndex} className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                          {currentExercise.type === 'fill_blank' && <FillBlank data={currentExercise} onComplete={handleExerciseComplete} />}
                          {currentExercise.type === 'mcq' && <MCQ data={currentExercise} onComplete={handleExerciseComplete} />}
                          {currentExercise.type === 'matching' && <Matching data={currentExercise} onComplete={handleExerciseComplete} />}
                          {currentExercise.type === 'order' && <OrderTask data={currentExercise} onComplete={handleExerciseComplete} />}
                          {currentExercise.type === 'true_false' && <TrueFalse data={currentExercise} onComplete={handleExerciseComplete} />}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-10 animate-in zoom-in duration-500">
                      <div className="text-6xl mb-6">🎉</div>
                      <h3 className="text-3xl font-black text-gray-900 mb-4">Hoàn thành bài tập!</h3>
                      <p className="text-xl text-gray-600 mb-8">
                        Bạn đã đạt được <span className="font-bold text-orange-600 text-2xl">{score}/{exerciseData.exercises.length}</span> điểm.
                      </p>
                      <button
                        onClick={() => {
                          setCurrentExIndex(0);
                          setScore(0);
                          setQuizFinished(false);
                        }}
                        className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-2xl font-bold transition-colors shadow-lg shadow-orange-200"
                      >
                        🔄 Làm lại từ đầu
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center bg-gray-50 p-10 rounded-3xl text-gray-500">
                  Chưa có dữ liệu bài tập cho bài học này.
                </div>
              )}
            </section>
          )}

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
