import { useState, useEffect } from 'react';

export default function TrueFalse({ data, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  if (!data || data.answer === undefined) return null;

  const isCorrect = selected === data.answer;

  useEffect(() => {
    if (!showResult || !onComplete) return;
    const t = setTimeout(() => onComplete(isCorrect), 1500);
    return () => clearTimeout(t);
  }, [showResult, isCorrect, onComplete]);

  const handleSelect = (value) => {
    if (showResult) return;
    setSelected(value);
    setShowResult(true);
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">Đúng / Sai</span>
      <p className="text-lg mt-1 mb-6 text-gray-800">{data.question}</p>
      <div className="grid grid-cols-2 gap-4">
        {[true, false].map((value) => {
          const isAnswer = value === data.answer;
          const isUserSelected = selected === value;
          const label = value ? 'Đúng' : 'Sai';
          return (
            <button
              key={String(value)}
              disabled={showResult}
              onClick={() => handleSelect(value)}
              className={`p-4 rounded-xl border-2 font-bold transition-all ${
                showResult
                  ? isAnswer
                    ? 'border-green-500 bg-green-50 text-green-700'
                    : isUserSelected
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-100 opacity-40'
                  : 'border-gray-200 hover:border-orange-400 hover:bg-orange-50'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>
      {showResult && (
        <div className={`mt-6 p-4 rounded-xl text-center ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          <p className="font-bold">{isCorrect ? '✨ Chính xác!' : '🔍 Sai rồi!'}</p>
        </div>
      )}
    </div>
  );
}
