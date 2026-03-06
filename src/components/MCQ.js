import { useState } from 'react';

export default function MCQ({ data, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);

  // Kiểm tra dữ liệu an toàn
  if (!data || !data.options) return null;

  const isCorrect = selected === data.answer;

  const handleSelect = (option) => {
    if (showResult) return; // Không cho chọn lại sau khi đã hiện kết quả
    setSelected(option);
    setShowResult(true);

    if (onComplete) {
      setTimeout(() => {
        onComplete(option === data.answer);
      }, 1500);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      {/* Tiêu đề loại bài tập */}
      <span className="text-xs font-bold text-orange-500 uppercase tracking-wider">Trắc nghiệm</span>
      <p className="text-lg mt-1 mb-6 text-gray-800">{data.question}</p>

      <div className="grid gap-3">
        {/* Đổi từ data.choices thành data.options */}
        {data.options.map((option, index) => {
          const isAnswer = option === data.answer;
          const isUserSelected = selected === option;

          return (
            <button
              key={index}
              disabled={showResult}
              onClick={() => handleSelect(option)}
              className={`p-4 text-left rounded-xl border-2 transition-all duration-200 relative ${showResult
                  ? isAnswer
                    ? "border-green-500 bg-green-50 text-green-700 shadow-sm" // Đáp án đúng luôn hiện xanh
                    : isUserSelected
                      ? "border-red-500 bg-red-50 text-red-700" // Nếu chọn sai thì hiện đỏ
                      : "border-gray-50 opacity-40" // Các lựa chọn khác mờ đi
                  : "border-gray-100 hover:border-orange-300 hover:bg-orange-50 active:scale-[0.98]"
                }`}
            >
              <div className="flex justify-between items-center">
                <span className="text-base">{option}</span>
                {showResult && isAnswer && (
                  <span className="text-green-600 font-bold">✓</span>
                )}
                {showResult && isUserSelected && !isAnswer && (
                  <span className="text-red-600 font-bold">✕</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {showResult && (
        <div className={`mt-6 p-4 rounded-xl text-center animate-in fade-in zoom-in duration-300 ${isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}>
          <p className="font-bold text-base">
            {isCorrect ? "✨ Tuyệt vời! Chính xác." : "🔍 Đừng buồn, thử lại lần sau nhé!"}
          </p>
          {!isCorrect && (
            <p className="text-sm mt-1">Đáp án đúng: <span className="underline">{data.answer}</span></p>
          )}
        </div>
      )}
    </div>
  );
}