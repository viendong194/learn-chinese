// components/FillBlank.js
import { useState } from 'react';

export default function FillBlank({ data }) {
  const [input, setInput] = useState('');
  const [isCheck, setIsCheck] = useState(false);
  const checkAnswer = () => setIsCheck(true);
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
  <div className="flex flex-wrap items-center gap-2 text-lg mb-4">
    <span>{data.question.split('___')[0]}</span>
    
    {/* Chỗ trống hiển thị từ đã chọn */}
    <span className={`border-b-2 px-4 py-1 min-w-[80px] text-center transition-colors ${
      isCheck 
        ? input === data.answer ? "border-green-500 text-green-600" : "border-red-500 text-red-600"
        : "border-orange-300 text-orange-600 font-medium"
    }`}>
      {input || "......"}
    </span>

    <span>{data.question.split('___')[1]}</span>
  </div>

  {/* Danh sách lựa chọn */}
  {!isCheck ? (
    <div className="flex flex-wrap gap-2 mt-4">
      {data.choices.map((choice, index) => (
        <button
          key={index}
          onClick={() => setInput(choice)}
          className={`px-4 py-2 rounded-xl border-2 transition-all ${
            input === choice 
              ? "border-orange-500 bg-orange-50 text-orange-700" 
              : "border-gray-200 hover:border-orange-300 text-gray-600"
          }`}
        >
          {choice}
        </button>
      ))}
    </div>
  ) : null}

  {/* Nút kiểm tra hoặc hiển thị đáp án */}
  {!isCheck ? (
    <button 
      onClick={checkAnswer}
      disabled={!input}
      className={`mt-6 px-6 py-2 rounded-lg text-white transition-all ${
        input ? "bg-orange-500 hover:bg-orange-600" : "bg-gray-300 cursor-not-allowed"
      }`}
    >
      Kiểm tra
    </button>
  ) : (
    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
      <p className="text-sm italic text-gray-500">
        Đáp án đúng: <span className="font-bold text-green-600">{data.answer}</span>
      </p>
    </div>
  )}
</div>
  );
}