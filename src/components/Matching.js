// components/Matching.js
import { useState, useEffect } from 'react';

export default function Matching({ data, onComplete }) {
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [solved, setSolved] = useState([]); // Lưu mảng các giá trị 'left' đã hoàn thành

  useEffect(() => {
    if (data.pairs) {
      setLeftItems([...data.pairs].sort(() => Math.random() - 0.5));
      setRightItems([...data.pairs].sort(() => Math.random() - 0.5));
    }
  }, [data]);

  useEffect(() => {
    if (onComplete && data.pairs && solved.length === data.pairs.length) {
      const t = setTimeout(() => onComplete(true), 1200);
      return () => clearTimeout(t);
    }
  }, [solved.length, data.pairs, onComplete]);

  const handleMatch = (rightItem) => {
    if (!selectedLeft) return;

    // So khớp: Nếu item bên trái đang chọn chính là item tương ứng của bên phải
    // Vì cùng trích xuất từ 1 mảng pairs, ta so sánh giá trị 'left' hoặc 'right' đều được
    if (selectedLeft.left === rightItem.left) {
      setSolved([...solved, selectedLeft.left]);
      setSelectedLeft(null);
    } else {
      // Nếu sai, bỏ chọn (reset)
      setSelectedLeft(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-orange-600 font-bold mb-4 text-center">Nối từ tương ứng</h3>
      
      <div className="flex justify-between gap-6">
        {/* Cột trái - Dựa trên thuộc tính 'left' */}
        <div className="flex-1 space-y-3">
          {leftItems.map((item) => {
            const isSolved = solved.includes(item.left);
            const isSelected = selectedLeft?.left === item.left;

            return (
              <button
                key={`left-${item.left}`}
                disabled={isSolved}
                onClick={() => setSelectedLeft(item)}
                className={`w-full p-3 rounded-xl border-2 transition-all text-center ${
                  isSolved 
                    ? "bg-green-50 border-green-200 text-green-600 opacity-50 cursor-not-allowed" 
                    : isSelected 
                      ? "border-orange-500 bg-orange-50 text-orange-700 shadow-md ring-2 ring-orange-200" 
                      : "border-gray-100 hover:border-orange-300 bg-white"
                }`}
              >
                {item.left}
              </button>
            );
          })}
        </div>

        {/* Cột phải - Dựa trên thuộc tính 'right' */}
        <div className="flex-1 space-y-3">
          {rightItems.map((item) => {
            const isSolved = solved.includes(item.left);

            return (
              <button
                key={`right-${item.right}`}
                disabled={isSolved}
                onClick={() => handleMatch(item)}
                className={`w-full p-3 rounded-xl border-2 transition-all text-center ${
                  isSolved 
                    ? "bg-green-50 border-green-200 text-green-600 opacity-50 cursor-not-allowed" 
                    : "border-gray-100 hover:border-orange-300 bg-white active:bg-orange-50"
                }`}
              >
                {item.right}
              </button>
            );
          })}
        </div>
      </div>

      {/* Hiển thị kết quả khi hoàn thành */}
      {solved.length === data.pairs.length && (
        <div className="mt-6 p-4 bg-green-100 text-green-700 rounded-2xl text-center font-bold">
          🎉 Tuyệt vời! Bạn đã nối đúng tất cả các từ.
        </div>
      )}
    </div>
  );
}