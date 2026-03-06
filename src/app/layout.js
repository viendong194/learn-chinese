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
    default: 'Mr. Chinese Channel - Học tiếng Trung, Từ vựng HSK 1-6, Luyện thi HSK',
    template: '%s | Mr. Chinese Channel',
  },
  description:
    'Học tiếng Trung (Chinese) với Mr. Chinese Channel: từ vựng HSK 1, HSK 2, HSK 3, HSK 4, HSK 5, HSK 6, ngữ pháp, podcast giao tiếp, luyện thi HSK. Flashcard, luyện viết chữ Hán.',
  keywords: [
    'học tiếng Trung',
    'learn Chinese',
    'Chinese',
    'HSK 1',
    'HSK 2',
    'HSK 3',
    'HSK 4',
    'HSK 5',
    'HSK 6',
    'từ vựng HSK',
    'từ vựng',
    'ngữ pháp tiếng Trung',
    'luyện thi HSK',
    'Mr. Chinese Channel',
    'mrchinese channel',
    'tiếng Trung giao tiếp',
    'podcast tiếng Trung',
    'flashcard HSK',
    'luyện viết chữ Hán',
  ],
  authors: [{ name: 'Mr. Chinese Channel' }],
  creator: 'Mr. Chinese Channel',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    siteName: 'Mr. Chinese Channel',
    title: 'Mr. Chinese Channel - Học tiếng Trung, Từ vựng HSK 1-6, Luyện thi HSK',
    description: 'Học tiếng Trung (Chinese): từ vựng HSK 1 đến HSK 6, ngữ pháp, luyện thi HSK. Podcast, flashcard, luyện viết. Mr. Chinese Channel.',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Mr. Chinese Channel - Học tiếng Trung' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mr. Chinese Channel - Học tiếng Trung, Từ vựng HSK, Luyện thi HSK',
    description: 'Học tiếng Trung: từ vựng HSK 1-6, ngữ pháp, luyện thi HSK. Flashcard, podcast.',
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
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mrchinesechannel.com';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: 'Mr. Chinese Channel',
        description: 'Học tiếng Trung (Chinese), từ vựng HSK 1-6, ngữ pháp, luyện thi HSK. Flashcard, podcast, luyện viết chữ Hán.',
        inLanguage: 'vi',
        potentialAction: { '@type': 'SearchAction', target: `${siteUrl}/?s={search_term_string}`, 'query-input': 'required name=search_term_string' },
      },
      {
        '@type': 'Organization',
        name: 'Mr. Chinese Channel',
        url: siteUrl,
        sameAs: [],
        description: 'Kênh học tiếng Trung, từ vựng HSK, ngữ pháp, luyện thi HSK.',
      },
    ],
  };

  return (
    <html lang="vi" style={{ colorScheme: 'light' }}>
      <body className="flex flex-col min-h-screen !bg-white">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Header />
        
        <main className="flex-grow pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}