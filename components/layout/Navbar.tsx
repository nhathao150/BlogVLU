'use client';

import Image from "next/image";
import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Search, ShieldCheck, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
  theme?: "light" | "dark";
}

export default function Navbar({ theme = "light" }: NavbarProps) {
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
    { name: "Nhật ký", href: "/blog" },
    { name: "Khoảnh khắc", href: "/events" },
    { name: "Liên hệ", href: "/contact" },
  ];

  const isDark = theme === "dark";

  return (
    <nav
      className={`sticky top-0 z-50 w-full backdrop-blur-md border-b transition-all duration-300 ${
        isDark
          ? "bg-[#03030d]/80 border-gray-800/80 shadow-none text-white"
          : "bg-white/80 border-gray-100 shadow-sm text-gray-900"
      }`}
    >
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
          <span className={`text-xl font-bold font-sans tracking-tight ${isDark ? "text-white" : "text-gray-900"}`}>
            MyBlog
          </span>
        </Link>

        {/* 2. MENU CHÍNH (Ẩn trên Mobile) */}
        <div className={`hidden md:flex gap-8 font-medium text-sm ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
            if (link.href === "/blog") {
              return (
                <div key={link.href} className="relative group py-1">
                  <Link
                    href={link.href}
                    className={`transition-colors flex items-center gap-1 ${
                      isDark ? "hover:text-white" : "hover:text-black"
                    } ${isActive ? (isDark ? "text-white font-bold" : "text-black font-bold") : ""}`}
                  >
                    {link.name}
                    <span className="text-[10px] text-gray-400 group-hover:text-current group-hover:rotate-180 transition-transform duration-300">
                      ▼
                    </span>
                  </Link>
                  {/* Dropdown Menu */}
                  <div
                    className={`absolute left-0 mt-2 w-52 border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 py-2 origin-top-left scale-95 group-hover:scale-100 ${
                      isDark
                        ? "bg-[#0b0f1d] border-gray-800 shadow-black/40 text-gray-200"
                        : "bg-white border-gray-100 shadow-xl text-gray-600"
                    }`}
                  >
                    <Link
                      href="/blog"
                      className={`block px-4 py-2 text-xs font-semibold transition ${
                        isDark ? "hover:bg-gray-800 hover:text-white" : "hover:bg-amber-50 hover:text-amber-700"
                      }`}
                    >
                      📚 Tất cả nhật ký
                    </Link>
                    <div className={`border-t my-1 ${isDark ? "border-gray-800" : "border-gray-50"}`}></div>
                    <Link
                      href="/blog?category=nhat-ky"
                      className={`block px-4 py-2 text-xs font-semibold transition ${
                        isDark ? "hover:bg-gray-800 hover:text-white" : "hover:bg-amber-50 hover:text-amber-700"
                      }`}
                    >
                      ❤️ Nhật ký ngày thường
                    </Link>
                    <Link
                      href="/blog?category=hoc-tap"
                      className={`block px-4 py-2 text-xs font-semibold transition ${
                        isDark ? "hover:bg-gray-800 hover:text-white" : "hover:bg-amber-50 hover:text-amber-700"
                      }`}
                    >
                      📖 Học tập & Công việc
                    </Link>
                    <Link
                      href="/blog?category=trai-nghiem"
                      className={`block px-4 py-2 text-xs font-semibold transition ${
                        isDark ? "hover:bg-gray-800 hover:text-white" : "hover:bg-amber-50 hover:text-amber-700"
                      }`}
                    >
                      🗺️ Đi & Trải nghiệm
                    </Link>
                    <Link
                      href="/blog?category=chill"
                      className={`block px-4 py-2 text-xs font-semibold transition ${
                        isDark ? "hover:bg-gray-800 hover:text-white" : "hover:bg-amber-50 hover:text-amber-700"
                      }`}
                    >
                      ☕ Sở thích & Chill
                    </Link>
                  </div>
                </div>
              );
            }
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative transition-colors py-1 ${
                  isDark ? "hover:text-white" : "hover:text-black"
                } ${isActive ? (isDark ? "text-white font-bold" : "text-black font-bold") : ""}`}
              >
                {link.name}
                {isActive && (
                  <span className={`absolute bottom-0 left-0 w-full h-0.5 rounded-full ${isDark ? "bg-amber-500" : "bg-black"}`}></span>
                )}
              </Link>
            );
          })}
        </div>

        {/* 3. KHU VỰC TÌM KIẾM & USER */}
        <div className="flex items-center gap-3 sm:gap-4">

          {/* Ô TÌM KIẾM */}
          <div
            className={`hidden lg:flex items-center px-3 py-1.5 rounded-full border transition-all group ${
              isDark
                ? "bg-gray-900 border-gray-800 focus-within:border-gray-700 focus-within:bg-[#070b19] focus-within:shadow-md"
                : "bg-gray-100 border-transparent focus-within:border-gray-300 focus-within:bg-white focus-within:shadow-sm"
            }`}
          >
            <Search size={16} className={isDark ? "text-gray-500 group-focus-within:text-gray-300" : "text-gray-400 group-focus-within:text-gray-600"} />
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Tìm kiếm..."
              className={`bg-transparent border-none outline-none text-sm ml-2 w-24 focus:w-40 transition-all duration-300 placeholder:text-gray-500 ${
                isDark ? "text-white" : "text-gray-700"
              }`}
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <SignedOut>
              <SignInButton mode="modal">
                <button className={`text-sm font-bold px-5 py-2 rounded-full hover:scale-105 transition active:scale-95 shadow-lg ${
                  isDark 
                    ? "bg-white text-black hover:bg-gray-150 shadow-white/5" 
                    : "bg-black text-white hover:bg-gray-800 shadow-gray-200"
                }`}>
                  Đăng nhập
                </button>
              </SignInButton>
            </SignedOut>

            <SignedIn>
              {/* Nút Admin */}
              {isLoaded && user?.publicMetadata?.role === 'admin' && (
                <Link
                  href="/admin"
                  className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border transition ${
                    isDark
                      ? "bg-gray-900 text-gray-300 border-gray-800 hover:bg-white hover:text-black hover:border-white"
                      : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-black hover:text-white hover:border-black"
                  }`}
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
                    avatarBox: `w-9 h-9 border-2 transition ${isDark ? "border-gray-800 hover:border-gray-650" : "border-gray-100 hover:border-gray-300"}`
                  }
                }}
              />
            </SignedIn>

            {/* Mobile Menu Icon */}
            <button className={`md:hidden p-2 rounded-lg transition ${isDark ? "text-gray-300 hover:bg-gray-800" : "text-gray-600 hover:bg-gray-100"}`}>
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}