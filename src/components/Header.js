"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { name: "Mua sắm", href: "#" },
    { name: "Tài liệu ôn thi HSK", href: "#" },
    { name: "Giáo trình", href: "#" },
    { name: "Liên hệ", href: "#" },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-black tracking-tighter text-orange-600 uppercase shrink-0">
          Mr.Chinese Channel
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {menuItems.map((item) => (
            <div key={item.name} className="relative group cursor-default">
              <span className="text-sm font-bold text-gray-400 transition-colors">
                {item.name}
              </span>
              {/* Badge "Soon" hiện khi hover */}
              <span className="absolute -top-3 -right-4 text-[7px] leading-none bg-gray-100 text-gray-400 px-1 py-0.5 rounded border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                SOON
              </span>
            </div>
          ))}
        </nav>

        {/* Mobile Button */}
        <button 
          onClick={() => setIsOpen(!isOpen)} 
          className="md:hidden p-2 text-gray-600 outline-none"
        >
          <div className="w-6 h-5 relative flex flex-col justify-between">
            <span className={`h-0.5 w-full bg-gray-800 rounded-full transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`h-0.5 w-full bg-gray-800 rounded-full transition-all duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
            <span className={`h-0.5 w-full bg-gray-800 rounded-full transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </div>
        </button>
      </div> {/* <-- Đã thêm thẻ đóng thiếu ở đây */}

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 bg-white border-b border-gray-100 ${isOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'}`}>
        <nav className="flex flex-col p-4 gap-1">
          {menuItems.map((item) => (
            <div 
              key={item.name} 
              className="flex items-center justify-between text-sm font-bold text-gray-400 p-3 rounded-xl"
            >
              <span className="italic">{item.name}</span>
              <span className="text-[9px] font-bold not-italic bg-gray-50 text-gray-400 px-2 py-1 rounded-lg border border-gray-100 uppercase tracking-wider">
                Sắp ra mắt
              </span>
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
}