import React, { useState, useEffect } from 'react';

export default function OrderTask({ data }) {
  const [shuffledWords, setShuffledWords] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [result, setResult] = useState(null);

  // Khởi tạo dữ liệu từ data.words[0]
  useEffect(() => {
    if (data?.words && data.words[0]) {
      // Tách chuỗi bằng dấu phẩy và loại bỏ khoảng trắng thừa
      const sentenceArray = data.words[0].split(',').map(s => s.trim());
      
      const initialData = sentenceArray.map((text, index) => ({
        text: text,
        id: index // Dùng để định danh câu
      }));

      setShuffledWords([...initialData].sort(() => Math.random() - 0.5));
      setUserSequence([]);
      setResult(null);
    }
  }, [data]);

  if (!data?.words) return <div className="p-4 text-gray-400">Đang tải câu hỏi...</div>;

  const toggleWord = (item, currentIndex) => {
    setUserSequence([...userSequence, item]);
    setShuffledWords(shuffledWords.filter((_, i) => i !== currentIndex));
  };

  const reset = () => {
    const sentenceArray = data.words[0].split(',').map(s => s.trim());
    const initialData = sentenceArray.map((text, index) => ({
      text: text,
      id: index
    }));
    setShuffledWords([...initialData].sort(() => Math.random() - 0.5));
    setUserSequence([]);
    setResult(null);
  };

  const checkResult = () => {
    // Chuyển mảng user đã chọn thành chuỗi định dạng "A→B→C" để so sánh với data.answer
    const userString = userSequence.map(item => item.text).join('→');
    
    // So sánh chuỗi (loại bỏ khoảng trắng nếu có để chính xác tuyệt đối)
    const isCorrect = userString.replace(/\s/g, '') === data.answer.replace(/\s/g, '');
    
    setResult(isCorrect);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-orange-600 font-bold mb-2">Sắp xếp thứ tự hội thoại:</h3>
      <p className="text-gray-500 text-sm mb-4 italic">Nhấn vào các câu dưới đây để xếp theo thứ tự đúng:</p>
      
      {/* Vùng hiển thị kết quả người dùng chọn */}
      <div className="min-h-[100px] p-4 border-2 border-dashed border-orange-100 rounded-2xl mb-6 flex flex-col gap-2 bg-orange-50/30">
        {userSequence.map((item, i) => (
          <div 
            key={`user-${i}`} 
            className="px-4 py-2 bg-white border border-orange-200 text-orange-700 rounded-xl shadow-sm font-medium text-sm flex items-center"
          >
            <span className="bg-orange-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-[10px] mr-3 shrink-0">
              {i + 1}
            </span>
            {item.text}
          </div>
        ))}
        {userSequence.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-300 text-sm">
            Chạm vào các câu bên dưới...
          </div>
        )}
      </div>

      {/* Danh sách các câu còn lại để chọn */}
      <div className="flex flex-col gap-2 mb-6">
        {shuffledWords.map((item, index) => (
          <button
            key={`shuffled-${item.id}`}
            onClick={() => toggleWord(item, index)}
            className="text-left px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:border-orange-400 hover:bg-orange-50 transition-all active:scale-95 text-sm shadow-sm"
          >
            {item.text}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button 
          onClick={checkResult} 
          disabled={shuffledWords.length > 0}
          className={`flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all ${
            shuffledWords.length > 0 ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-200"
          }`}
        >
          Kiểm tra đáp án
        </button>
        <button 
          onClick={reset} 
          className="px-6 py-3 bg-gray-100 text-gray-600 rounded-xl text-sm hover:bg-gray-200 transition-colors"
        >
          Làm lại
        </button>
      </div>

      {result !== null && (
        <div className={`mt-5 p-4 rounded-xl text-center font-bold animate-bounce ${
          result ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {result ? "🎉 Chính xác!" : "🤔 Sai rồi, hãy thử lại nhé!"}
        </div>
      )}
    </div>
  );
}