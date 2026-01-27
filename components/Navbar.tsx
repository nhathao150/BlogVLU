'use client';

import Image from "next/image";
import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Search, ShieldCheck, Menu } from "lucide-react"; 
import { usePathname, useRouter } from "next/navigation"; 
import { useState } from "react";

export default function Navbar() {
  const { user, isLoaded } = useUser();
  const pathname = usePathname();
  const router = useRouter();
  
  // State cho tìm kiếm
  const [keyword, setKeyword] = useState("");

  // Hàm xử lý khi bấm Enter trong ô tìm kiếm
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && keyword.trim() !== "") {
      router.push(`/search?q=${encodeURIComponent(keyword)}`);
    }
  };

  // Danh sách menu
  const navLinks = [
    { name: "Trang chủ", href: "/" },
    { name: "Bài viết", href: "/blog" },
    { name: "Sự kiện", href: "/events" },
    { name: "Liên hệ", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm transition-all">
      <div className="container mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        
        {/* 1. LOGO */}
        <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.png" 
              alt="BlogVLU Logo"
              width={30}  
              height={30} 
              className="rounded-lg shadow-md object-cover group-hover:opacity-80 transition"
            />
          <span className="text-xl font-bold font-sans tracking-tight text-gray-900">BlogVLU</span>
        </Link>

        {/* 2. MENU CHÍNH (Ẩn trên Mobile) */}
        <div className="hidden md:flex gap-8 font-medium text-sm text-gray-600">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            return (
              <Link 
                key={link.href} 
                href={link.href}
                className={`relative transition-colors hover:text-black py-1 ${
                  isActive ? "text-black font-bold" : ""
                }`}
              >
                {link.name}
                {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black rounded-full"></span>
                )}
              </Link>
            );
          })}
        </div>

        {/* 3. KHU VỰC TÌM KIẾM & USER */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Ô TÌM KIẾM */}
          <div className="hidden lg:flex items-center bg-gray-100 px-3 py-1.5 rounded-full border border-transparent focus-within:border-gray-300 focus-within:bg-white focus-within:shadow-sm transition-all group">
            <Search size={16} className="text-gray-400 group-focus-within:text-gray-600" />
            <input 
              type="text" 
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Tìm kiếm..." 
              className="bg-transparent border-none outline-none text-sm ml-2 w-24 focus:w-40 transition-all duration-300 placeholder:text-gray-400 text-gray-700"
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                 <button className="text-sm font-bold bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 hover:scale-105 transition active:scale-95 shadow-lg shadow-gray-200">
                    Đăng nhập
                 </button>
              </SignInButton>
            </SignedOut>
            
            <SignedIn>
              {/* Nút Admin (Đã sửa link về /admin) */}
              {isLoaded && user?.publicMetadata?.role === 'admin' && (
                <Link 
                  href="/admin"  
                  className="hidden md:flex items-center gap-1.5 bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-xs font-bold border border-gray-200 hover:bg-black hover:text-white hover:border-black transition"
                  title="Trang quản trị viên"
                >
                  <ShieldCheck size={14} />
                  <span>Quản trị</span>
                </Link>
              )}

              {/* Avatar Clerk */}
              <UserButton 
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9 border-2 border-gray-100 hover:border-gray-300 transition"
                  }
                }}
              />
            </SignedIn>

            {/* Mobile Menu Icon */}
            <button className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}