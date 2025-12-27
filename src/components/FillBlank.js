// components/FillBlank.js
import { useState } from 'react';

export default function FillBlank({ data }) {
  const [input, setInput] = useState('');
  const [isCheck, setIsCheck] = useState(false);
  const checkAnswer = () => setIsCheck(true);
  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex flex-wrap items-center gap-2 text-lg">
        <span>{data.question.split('___')[0]}</span>
        <input
          type="text"
          value={input}
          disabled={isCheck}
          onChange={(e) => setInput(e.target.value)}
          className={`border-b-2 px-2 py-1 outline-none w-32 text-center transition-colors ${
            isCheck 
              ? input.trim() === data.answer ? "border-green-500 text-green-600" : "border-red-500 text-red-600"
              : "border-orange-300 focus:border-orange-500"
          }`}
          placeholder="Điền từ..."
        />
        <span>{data.question.split('___')[1]}</span>
      </div>

      {!isCheck ? (
        <button 
          onClick={checkAnswer}
          className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm"
        >
          Kiểm tra
        </button>
      ) : (
        <p className="mt-3 text-sm italic text-gray-500">
          Đáp án đúng: <span className="font-bold text-green-600">{data.answer}</span>
        </p>
      )}
    </div>
  );
}