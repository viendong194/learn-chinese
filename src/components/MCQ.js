// components/MCQ.js
import { useState } from 'react';

export default function MCQ({ data }) {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const isCorrect = selected === data.answer;

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <p className="text-lg font-medium mb-4">{data.question}</p>
      
      <div className="grid gap-3">
        {data.choices?.map((option) => (
          <button
            key={option}
            disabled={showResult}
            onClick={() => {
              setSelected(option);
              setShowResult(true);
            }}
            className={`p-4 text-left rounded-xl border-2 transition-all ${
              showResult 
                ? option === data.answer 
                  ? "border-green-500 bg-green-50 text-green-700" // Đáp án đúng
                  : selected === option 
                    ? "border-red-500 bg-red-50 text-red-700" // Bạn chọn sai
                    : "border-gray-100 opacity-50"
                : "border-gray-100 hover:border-orange-300 hover:bg-orange-50" // Trạng thái chờ
            }`}
          >
            <div className="flex justify-between items-center">
              <span>{option}</span>
              {showResult && option === data.answer && <span>✅</span>}
              {showResult && selected === option && option !== data.answer && <span>❌</span>}
            </div>
          </button>
        ))}
      </div>

      {showResult && (
        <div className={`mt-4 p-3 rounded-lg text-sm font-medium ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
          {isCorrect ? "Chính xác! Làm tốt lắm." : `Chưa đúng rồi. Đáp án là: ${data.answer}`}
        </div>
      )}
    </div>
  );
}