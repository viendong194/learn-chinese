import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: 'mr.chinesechannel - Learn Chinese By Podcast',
  description: 'Chào mừng bạn đến với Mr. Chinese. Kênh này sẽ giúp bạn học tiếng Trung giao tiếp thông qua những cuộc thảo luận sôi nổi của Tiểu Minh và Tiểu Hồng về các chủ đề như: giao tiếp tiếng trung hằng ngày, phỏng vấn xin việc bằng tiếng trung, các mẫu hội thoại tiếng trung giao tiếp, tiếng trung văn phòng, tiếng trung du lịch',
};

// app/layout.js (hoặc components/Footer.jsx nếu bạn có file riêng)

export default function RootLayout({ children }) {
  return (
    <html lang="vi">
      {/* Thêm h-full để đảm bảo chiều cao toàn trang */}
      <body className="flex flex-col min-h-screen">
        
        {/* Main content sẽ chiếm hết khoảng trống ở giữa */}
        <main className="flex-grow">
          {children}
        </main>

        <footer className="fixed bottom-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-t border-gray-200 py-3 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <p className="text-sm text-gray-800">
              🔥 <span className="font-extrabold text-red-600">ƯU ĐÃI:</span> Nhận làm web tương tự chỉ <span className="font-bold text-lg">1tr</span> (Free phí duy trì). 
              <a href="https://zalo.me/sdt-cua-ban" className="ml-3 bg-red-500 text-white px-3 py-1 rounded-lg text-xs font-bold hover:bg-red-600 transition">
                NHẮN ZALO
              </a>
            </p>
          </div>
        </footer>

      </body>
    </html>
  );
}