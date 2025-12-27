// components/OrderTask.js
import { useState, useEffect } from 'react';

export default function OrderTask({ data }) {
  // shuffledWords sẽ lưu đối tượng: { text: "nội dung câu", originalIndex: chỉ số gốc }
  const [shuffledWords, setShuffledWords] = useState([]);
  const [userSequence, setUserSequence] = useState([]);
  const [result, setResult] = useState(null);

  // Khởi tạo dữ liệu an toàn bằng useEffect
  useEffect(() => {
    if (data?.sentences) {
      // Gán ID gốc cho từng câu để biết vị trí đúng của nó
      const initialData = data.sentences.map((sentence, index) => ({
        text: sentence,
        originalIndex: index
      }));
      // Xáo trộn mảng
      setShuffledWords([...initialData].sort(() => Math.random() - 0.5));
      // Reset trạng thái bài tập
      setUserSequence([]);
      setResult(null);
    }
  }, [data]);

  // Nếu chưa có dữ liệu, hiện thông báo chờ để tránh lỗi crash
  if (!data?.sentences) return <div className="p-4 text-gray-400">Đang tải câu hỏi...</div>;

  const toggleWord = (item, currentIndex) => {
    // Thêm câu đã chọn vào danh sách người dùng xếp
    setUserSequence([...userSequence, item]);
    // Xóa câu đó khỏi danh sách các câu còn lại
    setShuffledWords(shuffledWords.filter((_, i) => i !== currentIndex));
  };

  const reset = () => {
    const initialData = data.sentences.map((sentence, index) => ({
      text: sentence,
      originalIndex: index
    }));
    setShuffledWords([...initialData].sort(() => Math.random() - 0.5));
    setUserSequence([]);
    setResult(null);
  };

  const checkResult = () => {
    // Lấy ra danh sách các chỉ số mà người dùng đã xếp
    const userOrder = userSequence.map(item => item.originalIndex);
    
    // So sánh mảng người dùng chọn với mảng đáp án từ JSON
    // Chuyển mảng thành chuỗi JSON để so sánh chính xác (ví dụ: "[0,1,2]" === "[0,1,2]")
    const isCorrect = JSON.stringify(userOrder) === JSON.stringify(data.answer);
    
    setResult(isCorrect);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <p className="text-gray-500 text-sm mb-4 italic">Nhấn vào các câu dưới đây để sắp xếp theo thứ tự hội thoại đúng:</p>
      
      {/* Vùng hiển thị các câu người dùng đã chọn */}
      <div className="min-h-[60px] p-3 border-b-2 border-dashed border-gray-200 mb-6 flex flex-col gap-3">
        {userSequence.map((item, i) => (
          <div key={i} className="px-4 py-2 bg-orange-100 text-orange-700 rounded-lg font-medium text-sm animate-in fade-in slide-in-from-left-2">
            {i + 1}. {item.text}
          </div>
        ))}
        {userSequence.length === 0 && <span className="text-gray-300 text-sm">（Chưa có câu nào được chọn）</span>}
      </div>

      {/* Vùng các nút bấm để chọn câu */}
      <div className="flex flex-col gap-2 mb-6">
        {shuffledWords.map((item, index) => (
          <button
            key={`${item.originalIndex}-${index}`}
            onClick={() => toggleWord(item, index)}
            className="text-left px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-orange-50 hover:border-orange-200 transition-all active:scale-95 text-sm"
          >
            {item.text}
          </button>
        ))}
      </div>

      <div className="flex gap-3">
        <button 
          onClick={checkResult} 
          disabled={shuffledWords.length > 0} // Chỉ cho kiểm tra khi đã xếp hết các câu
          className={`px-6 py-2 rounded-full text-sm font-bold text-white transition-all ${
            shuffledWords.length > 0 ? "bg-gray-300 cursor-not-allowed" : "bg-orange-500 hover:bg-orange-600"
          }`}
        >
          Kiểm tra đáp án
        </button>
        <button onClick={reset} className="bg-gray-100 text-gray-600 px-6 py-2 rounded-full text-sm hover:bg-gray-200">
          Làm lại
        </button>
      </div>

      {result !== null && (
        <div className={`mt-4 p-4 rounded-xl font-bold animate-in zoom-in duration-300 ${
          result ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
        }`}>
          {result ? "🎉 Tuyệt vời! Bạn đã sắp xếp đúng thứ tự." : "🤔 Thứ tự chưa đúng rồi, hãy thử lại nhé!"}
        </div>
      )}
    </div>
  );
}