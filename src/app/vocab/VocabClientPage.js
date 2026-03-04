"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';

export default function VocabClientPage({ levels, vocab }) {
  const [selectedLevel, setSelectedLevel] = useState(levels[0] || 'HSK 1');
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [shuffle, setShuffle] = useState(false);

  const list = useMemo(() => {
    const arr = vocab[selectedLevel] || [];
    if (shuffle) {
      const copy = [...arr];
      for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
      }
      return copy;
    }
    return arr;
  }, [selectedLevel, vocab, shuffle]);

  const current = list[index];
  const total = list.length;

  const goPrev = () => {
    setIndex((i) => (i <= 0 ? total - 1 : i - 1));
    setFlipped(false);
  };
  const goNext = () => {
    setIndex((i) => (i >= total - 1 ? 0 : i + 1));
    setFlipped(false);
  };

  if (!current) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <p className="text-gray-500 mb-4">Chưa có dữ liệu từ vựng. Chạy: node scripts/excel-to-json.js</p>
        <Link href="/" className="text-orange-600 font-medium hover:underline">← Về trang chủ</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50/30 pb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Breadcrumb / Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 text-sm font-medium mb-6 transition">
          ← Trang chủ
        </Link>

        {/* Level selector */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="text-sm font-bold text-gray-500">Cấp độ:</span>
          {levels.map((level) => (
            <button
              key={level}
              onClick={() => {
                setSelectedLevel(level);
                setIndex(0);
                setFlipped(false);
              }}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                selectedLevel === level
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300 hover:bg-orange-50'
              }`}
            >
              {level}
            </button>
          ))}
          <label className="ml-auto flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={shuffle}
              onChange={(e) => {
                setShuffle(e.target.checked);
                setIndex(0);
                setFlipped(false);
              }}
              className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <span className="text-sm font-medium text-gray-600">Xáo trộn</span>
          </label>
        </div>

        {/* Counter */}
        <p className="text-center text-gray-500 text-sm mb-4">
          {index + 1} / {total}
        </p>

        {/* Flashcard */}
        <div
          className="relative aspect-[4/3] max-h-[320px] cursor-pointer"
          style={{ perspective: '1000px' }}
          onClick={() => setFlipped((f) => !f)}
        >
          <div
            className="relative w-full h-full rounded-2xl shadow-xl transition-transform duration-500"
            style={{
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
            }}
          >
            {/* Front: word + pinyin */}
            <div
              className="absolute inset-0 rounded-2xl bg-white border border-gray-100 flex flex-col items-center justify-center p-8"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <p className="text-6xl md:text-7xl font-bold text-gray-900 mb-3">{current.word}</p>
              <p className="text-xl text-orange-600 font-medium">{current.pinyin}</p>
              {current.type && (
                <span className="mt-2 text-xs text-gray-400 font-medium">{current.type}</span>
              )}
              <p className="mt-4 text-sm text-gray-400">Nhấn hoặc chạm để xem nghĩa</p>
            </div>

            {/* Back: meaning + tip */}
            <div
              className="absolute inset-0 rounded-2xl bg-orange-600 text-white flex flex-col items-center justify-center p-8"
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <p className="text-4xl md:text-5xl font-bold mb-2">{current.word}</p>
              <p className="text-lg text-orange-100 mb-4">{current.pinyin}</p>
              <p className="text-2xl font-bold mb-4">{current.meaning}</p>
              {current.tip && (
                <p className="text-sm text-orange-100/90 leading-relaxed text-center max-h-24 overflow-y-auto">
                  {current.tip}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={goPrev}
            className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 text-gray-600 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center text-2xl font-bold transition-all shadow-sm"
            aria-label="Từ trước"
          >
            ←
          </button>
          <button
            onClick={() => setFlipped((f) => !f)}
            className="px-6 py-3 rounded-xl bg-orange-600 text-white font-bold shadow-lg shadow-orange-200 hover:bg-orange-700 transition"
          >
            {flipped ? 'Xem chữ' : 'Xem nghĩa'}
          </button>
          <button
            onClick={goNext}
            className="w-14 h-14 rounded-full bg-white border-2 border-gray-200 text-gray-600 hover:border-orange-400 hover:bg-orange-50 hover:text-orange-600 flex items-center justify-center text-2xl font-bold transition-all shadow-sm"
            aria-label="Từ tiếp"
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}
