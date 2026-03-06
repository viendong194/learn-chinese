// components/TrueFalse.js
import { useState } from 'react';

export default function TrueFalse({ data, onComplete }) {
    const [selected, setSelected] = useState(null);
    const [showResult, setShowResult] = useState(false);

    if (!data) return null;

    const isCorrect = selected === data.answer;

    const handleSelect = (option) => {
        if (showResult) return;
        setSelected(option);
        setShowResult(true);

        // Notify parent component after a short delay to allow user to see result
        if (onComplete) {
            setTimeout(() => {
                onComplete(option === data.answer);
            }, 1500);
        }
    };

    return (
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 w-full animate-in slide-in-from-right-8 duration-500">
            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider mb-2 block">
                Đúng / Sai
            </span>
            <p className="text-lg mt-1 mb-8 text-gray-800 font-medium">{data.question}</p>

            <div className="grid grid-cols-2 gap-4">
                {[true, false].map((option, index) => {
                    const isAnswer = option === data.answer;
                    const isUserSelected = selected === option;

                    return (
                        <button
                            key={index}
                            disabled={showResult}
                            onClick={() => handleSelect(option)}
                            className={`p-6 text-center rounded-2xl border-[3px] transition-all duration-300 transform active:scale-95 ${showResult
                                    ? isAnswer
                                        ? "border-green-500 bg-green-50 text-green-700 shadow-md scale-105"
                                        : isUserSelected
                                            ? "border-red-500 bg-red-50 text-red-700 opacity-80"
                                            : "border-gray-100 opacity-40 grayscale"
                                    : "border-gray-100 hover:border-blue-400 hover:bg-blue-50 hover:shadow-md"
                                }`}
                        >
                            <div className="flex flex-col items-center justify-center gap-2">
                                <span className={`text-4xl ${option ? 'text-green-500' : 'text-red-500'}`}>
                                    {option ? '✓' : '✕'}
                                </span>
                                <span className="font-bold text-xl">
                                    {option ? 'Đúng' : 'Sai'}
                                </span>
                            </div>
                        </button>
                    );
                })}
            </div>

            {showResult && (
                <div className={`mt-8 p-4 rounded-xl text-center animate-in fade-in zoom-in duration-300 ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                    <p className="font-bold text-lg">
                        {isCorrect ? "✨ Chính xác! Giỏi quá." : "🔍 Rất tiếc, câu này sai rồi!"}
                    </p>
                    {!isCorrect && data.explanation && (
                        <p className="text-sm mt-2 text-gray-600 border-t border-red-200 pt-2">
                            <span className="font-semibold">Giải thích:</span> {data.explanation}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
