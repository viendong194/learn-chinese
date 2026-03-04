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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://mrchinesechannel.com'),
  title: {
    default: 'Mr. Chinese Channel - Học tiếng Trung qua Podcast',
    template: '%s | Mr. Chinese Channel',
  },
  description:
    'Học tiếng Trung giao tiếp qua podcast với Tiểu Minh và Tiểu Hồng. Chủ đề: giao tiếp hàng ngày, phỏng vấn xin việc, hội thoại tiếng Trung, tiếng Trung văn phòng, du lịch. Có bài tập, từ vựng HSK.',
  keywords: [
    'học tiếng Trung',
    'tiếng Trung giao tiếp',
    'podcast tiếng Trung',
    'HSK',
    'từ vựng HSK',
    'phỏng vấn tiếng Trung',
    'tiếng Trung văn phòng',
    'tiếng Trung du lịch',
    'Mr Chinese',
  ],
  authors: [{ name: 'Mr. Chinese Channel' }],
  creator: 'Mr. Chinese Channel',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Mr. Chinese Channel',
    title: 'Mr. Chinese Channel - Học tiếng Trung qua Podcast',
    description: 'Học tiếng Trung giao tiếp qua podcast với Tiểu Minh và Tiểu Hồng. Bài học có video, bài tập, từ vựng HSK.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Mr. Chinese Channel' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mr. Chinese Channel - Học tiếng Trung qua Podcast',
    description: 'Học tiếng Trung giao tiếp qua podcast. Bài học có video, bài tập, từ vựng HSK.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  other: {
    'color-scheme': 'light only',
  },
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