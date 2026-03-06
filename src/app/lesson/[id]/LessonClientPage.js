"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import FillBlank from '@/components/FillBlank';
import Matching from '@/components/Matching';
import MCQ from '@/components/MCQ';
import OrderTask from '@/components/OrderTask';
import TrueFalse from '@/components/TrueFalse';

export default function LessonClientPage({ lesson, allLessons }) {
  const [scriptUnlocked, setScriptUnlocked] = useState(false);
  const [exerciseUnlocked, setExerciseUnlocked] = useState(false);

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
            ) : exerciseData?.exercises && exerciseData.exercises.length > 0 ? (
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
