// components/Matching.js
import { useState, useEffect } from 'react';

export default function Matching({ data }) {
  // Giả sử data.pairs là mảng: [{left: "你好", right: "Hello"}, ...]
  const [leftItems, setLeftItems] = useState([]);
  const [rightItems, setRightItems] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [solved, setSolved] = useState([]); // Lưu các cặp đã nối đúng

  useEffect(() => {
    // Xáo trộn danh sách để học sinh không đoán được theo thứ tự hàng ngang
    setLeftItems([...data.pairs].sort(() => Math.random() - 0.5));
    setRightItems([...data.pairs].sort(() => Math.random() - 0.5));
  }, [data]);

  const handleMatch = (rightItem) => {

    if (!selectedLeft) return;
    
    if (selectedLeft.vi === rightItem.vi) {
      setSolved([...solved, selectedLeft.cn]);
      setSelectedLeft(null);
    } else {
      // Sai thì rung nhẹ hoặc báo lỗi (tùy biến thêm CSS)
      setSelectedLeft(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-orange-600 font-bold mb-4">Nối từ tương ứng:</h3>
      <div className="flex justify-between gap-8">
        {/* Cột trái - Tiếng Trung */}
        <div className="flex-1 space-y-3">
          {leftItems.map((item) => (
            <button
              key={item.cn}
              disabled={solved.includes(item.cn)}
              onClick={() => setSelectedLeft(item)}
              className={`w-full p-3 rounded-xl border-2 transition-all ${
                solved.includes(item.cn) ? "bg-green-100 border-green-200 text-green-700 opacity-50" :
                selectedLeft?.cn === item.cn ? "border-orange-500 bg-orange-50" : "border-gray-50 hover:bg-gray-50"
              }`}
            >
              {item.cn}
            </button>
          ))}
        </div>

        {/* Cột phải - Nghĩa */}
        <div className="flex-1 space-y-3">
          {rightItems.map((item) => (
            <button
              key={item.vi}
              disabled={solved.includes(item.vi)}
              onClick={() => handleMatch(item)}
              className={`w-full p-3 rounded-xl border-2 transition-all ${
                solved.includes(item.cn) ? "bg-green-100 border-green-200 text-green-700 opacity-50" :
                "border-gray-50 hover:bg-gray-50"
              }`}
            >
              {item.vi}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}