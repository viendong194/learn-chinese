"use client";

import { useState, useMemo, useEffect, useCallback } from 'react';
import Link from 'next/link';
import MCQ from '@/components/MCQ';
import Matching from '@/components/Matching';
import TrueFalse from '@/components/TrueFalse';

const FREE_PRACTICE_LIMIT = 10;
const PREMIUM_QUESTION_COUNT = 30;

const TYPES = ['meaning_mcq', 'char_mcq', 'matching', 'true_false'];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickRandom(list, n, excludeIndex = -1) {
  const pool = list.filter((_, i) => i !== excludeIndex);
  const shuffled = shuffle(pool);
  return shuffled.slice(0, n);
}

function generateQuestions(vocab, level, count) {
  const list = vocab[level] || [];
  if (list.length < 4) return [];

  const questions = [];
  const typeOrder = shuffle([...TYPES]);

  for (let i = 0; i < count; i++) {
    const type = typeOrder[i % typeOrder.length];
    const idx = Math.floor(Math.random() * list.length);
    const main = list[idx];

    if (type === 'meaning_mcq') {
      const others = pickRandom(list, 3, idx);
      const options = shuffle([main.meaning, others[0].meaning, others[1].meaning, others[2].meaning]);
      questions.push({
        type: 'meaning_mcq',
        data: {
          question: `「${main.word}」 (${main.pinyin}) nghĩa là gì?`,
          options,
          answer: main.meaning,
        },
      });
    } else if (type === 'char_mcq') {
      const others = pickRandom(list, 3, idx);
      const options = shuffle([main.word, others[0].word, others[1].word, others[2].word]);
      questions.push({
        type: 'char_mcq',
        data: {
          question: `Từ nào có nghĩa là 「${main.meaning}」?`,
          options,
          answer: main.word,
        },
      });
    } else if (type === 'matching') {
      const others = pickRandom(list, 3, idx);
      const group = [main, ...others];
      const pairs = group.map((w) => ({ left: w.word, right: w.meaning }));
      questions.push({
        type: 'matching',
        data: { pairs },
      });
    } else {
      const isTrue = Math.random() < 0.5;
      const wrong = list[Math.floor(Math.random() * list.length)];
      const wrongMeaning = wrong.stt === main.stt ? list[(idx + 1) % list.length].meaning : wrong.meaning;
      questions.push({
        type: 'true_false',
        data: {
          question: `「${main.word}」 có nghĩa là 「${isTrue ? main.meaning : wrongMeaning}」`,
          answer: isTrue,
        },
      });
    }
  }

  return questions;
}

export default function PracticeClientPage({ levels, vocab }) {
  const [selectedLevel, setSelectedLevel] = useState(levels?.[0] || 'HSK 1');
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/vocab/status', { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { if (!cancelled) setIsPremium(!!d.premium); })
      .catch(() => { if (!cancelled) setIsPremium(false); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const maxQuestions = isPremium ? PREMIUM_QUESTION_COUNT : FREE_PRACTICE_LIMIT;

  const handleStart = useCallback(() => {
    const list = vocab[selectedLevel] || [];
    if (list.length < 4) return;
    const q = generateQuestions(vocab, selectedLevel, maxQuestions);
    setQuestions(q);
    setCurrentIndex(0);
    setScore(0);
    setFinished(false);
    setStarted(true);
  }, [vocab, selectedLevel, maxQuestions]);

  const handleComplete = useCallback((correct) => {
    if (correct) setScore((s) => s + 1);
    if (currentIndex >= questions.length - 1) {
      setFinished(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }, [currentIndex, questions.length]);

  const current = questions[currentIndex];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-lg mx-auto">
          <Link href="/vocab" className="text-orange-600 font-medium mb-6 inline-block">← Về Từ vựng HSK</Link>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Luyện tập từ vựng</h1>
          <p className="text-gray-600 mb-8">
            {isPremium ? `Làm tối đa ${PREMIUM_QUESTION_COUNT} câu mỗi lượt.` : `Dùng thử ${FREE_PRACTICE_LIMIT} câu. Mở khóa để luyện không giới hạn.`}
          </p>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Chọn cấp độ</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white"
            >
              {(levels || []).map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
          </div>
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-xl bg-orange-600 text-white font-bold text-lg hover:bg-orange-700 transition"
          >
            Bắt đầu ({maxQuestions} câu)
          </button>
          {!isPremium && (
            <p className="mt-4 text-center text-sm text-gray-500">
              Đã mở khóa flashcard? <Link href="/vocab" className="text-orange-600 underline">Vào trang Từ vựng</Link> để dùng mã.
            </p>
          )}
        </div>
      </div>
    );
  }

  if (finished) {
    return (
      <div className="min-h-screen bg-gray-50 py-10 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-lg text-center">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Hoàn thành!</h2>
          <p className="text-2xl font-bold text-orange-600 mb-8">{score} / {questions.length} điểm</p>
          <button
            onClick={handleStart}
            className="w-full py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-700"
          >
            Làm lại
          </button>
          <Link href="/vocab/practice" className="block mt-3 text-gray-500 hover:text-gray-700">
            Đổi cấp độ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-lg mx-auto">
        <div className="flex justify-between items-center mb-6">
          <Link href="/vocab" className="text-orange-600 font-medium">← Từ vựng</Link>
          <span className="text-gray-600 font-medium">
            Câu {currentIndex + 1} / {questions.length} · Điểm: {score}
          </span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-8">
          <div
            className="h-full bg-orange-500 rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>

        {current?.type === 'meaning_mcq' && <MCQ data={current.data} onComplete={handleComplete} />}
        {current?.type === 'char_mcq' && <MCQ data={current.data} onComplete={handleComplete} />}
        {current?.type === 'matching' && <Matching data={current.data} onComplete={handleComplete} />}
        {current?.type === 'true_false' && <TrueFalse data={current.data} onComplete={handleComplete} />}
      </div>
    </div>
  );
}
