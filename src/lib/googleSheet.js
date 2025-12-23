// Lưu URL này vào file .env.local: NEXT_PUBLIC_GAS_URL=...
// const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL;

export async function getLessons() {
  const GAS_URL = "https://script.google.com/macros/s/AKfycbwGBeqQuSX0loi1wsWs08AYfHDLE-_iEa_cTw5209HyPAlznFghFK62HLVLdGsFbPah/exec"
  try {
    // Thêm redirect: 'follow' để xử lý việc chuyển hướng của Google
    const response = await fetch(GAS_URL, { 
      method: 'GET',
      redirect: 'follow', 
      cache: 'no-store' // Đảm bảo dữ liệu luôn mới nhất
    });
    
    const text = await response.text(); // Lấy text trước để debug nếu lỗi
    try {
      return JSON.parse(text);
    } catch (e) {
      console.error("Dữ liệu trả về không phải JSON:", text);
      return [];
    }
  } catch (error) {
    console.error("Lỗi kết nối GAS:", error);
    return [];
  }
}
