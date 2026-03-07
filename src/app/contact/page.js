import Link from 'next/link';

export const metadata = {
  title: 'Liên hệ',
  description: 'Liên hệ Mr. Chinese Channel - Học tiếng Trung, từ vựng HSK, luyện thi HSK. SĐT, email, Facebook, TikTok, YouTube.',
  keywords: ['liên hệ Mr. Chinese Channel', 'học tiếng Trung', 'Chinese', 'HSK', 'Mr. Chinese Channel'],
};

const CONTACT = {
  phone: '0974400110 or 0563038597',
  email: 'pedersen.dn@gmail.com',
  facebook: 'https://www.facebook.com/mrchinese.channel',
  tiktok: 'https://tiktok.com/@mrchinesechannel',
  youtube: 'https://www.youtube.com/@mr.chinesechannel',
  spotify: 'https://open.spotify.com/show/7cbdgvtWWMOwl4eejMRPWI',
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-orange-600 text-sm font-medium mb-8 transition">
          ← Trang chủ
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">Liên hệ</h1>
        <p className="text-gray-600 mb-10">
          Kết nối với Mr. Chinese Channel qua các kênh bên dưới.
        </p>

        <div className="space-y-4">
          <a
            href={`tel:${CONTACT.phone.replace(/\s/g, '')}`}
            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group"
          >
            <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 text-orange-600 group-hover:bg-orange-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Điện thoại</p>
              <p className="text-lg font-bold text-gray-900">{CONTACT.phone}</p>
            </div>
          </a>

          <a
            href={`mailto:${CONTACT.email}`}
            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all group"
          >
            <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-100 text-orange-600 group-hover:bg-orange-200">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Email</p>
              <p className="text-lg font-bold text-gray-900 break-all">{CONTACT.email}</p>
            </div>
          </a>

          <a
            href={CONTACT.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-200 transition-all group"
          >
            <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 group-hover:bg-blue-200">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Facebook</p>
              <p className="text-lg font-bold text-gray-900">Mr. Chinese Channel</p>
            </div>
            <span className="text-gray-400">↗</span>
          </a>

          <a
            href={CONTACT.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-300 transition-all group"
          >
            <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-900 text-white group-hover:bg-gray-800">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">TikTok</p>
              <p className="text-lg font-bold text-gray-900">@mrchinesechannel</p>
            </div>
            <span className="text-gray-400">↗</span>
          </a>

          <a
            href={CONTACT.youtube}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-red-200 transition-all group"
          >
            <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-red-100 text-red-600 group-hover:bg-red-200">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">YouTube</p>
              <p className="text-lg font-bold text-gray-900">Mr. Chinese Channel</p>
            </div>
            <span className="text-gray-400">↗</span>
          </a>

          <a
            href={CONTACT.spotify}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all group"
          >
            <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-green-100 text-green-600 group-hover:bg-green-200">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.49 17.31c-.21.346-.66.456-1.002.247-2.825-1.728-6.382-2.12-10.57-1.166-.394.09-.79-.165-.88-.56-.09-.395.164-.79.56-.88 4.583-1.047 8.513-.6 11.645 1.317.346.21.46.662.247 1.042zm1.467-3.26c-.266.43-.827.57-1.257.303-3.23-1.983-8.157-2.558-11.977-1.398-.485.148-.997-.13-.146-.615-.148-.484.13-.996.615-1.144 4.37-1.327 9.805-.675 13.513 1.597.436.267.57.828.303 1.258zm.13-3.4c-3.877-2.304-10.283-2.516-14.004-1.385-.593.18-1.22-.158-1.4-.75-.18-.593.158-1.22.75-1.4 4.28-1.3 11.336-1.0 15.8 1.66.533.316.71.998.395 1.53-.316.533-.998.71-1.53.395z" />
              </svg>
            </span>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Spotify</p>
              <p className="text-lg font-bold text-gray-900">Mr. Chinese Channel</p>
            </div>
            <span className="text-gray-400">↗</span>
          </a>
        </div>
      </div>
    </div>
  );
}
