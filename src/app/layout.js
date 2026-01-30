import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  other: {
    "color-scheme": "light only",
  },
  title: 'mr.chinesechannel - Learn Chinese By Podcast',
  description: 'Chào mừng bạn đến với Mr. Chinese. Kênh này sẽ giúp bạn học tiếng Trung giao tiếp thông qua những cuộc thảo luận sôi nổi của Tiểu Minh và Tiểu Hồng về các chủ đề như: giao tiếp tiếng trung hằng ngày, phỏng vấn xin việc bằng tiếng trung, các mẫu hội thoại tiếng trung giao tiếp, tiếng trung văn phòng, tiếng trung du lịch',
};

// app/layout.js (hoặc components/Footer.jsx nếu bạn có file riêng)

export default function RootLayout({ children }) {
  return (
    <html lang="vi" style={{ colorScheme: 'light' }}>
      <body className="flex flex-col min-h-screen !bg-white">
        <Header />
        
        <main className="flex-grow pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}