'use client'; // 1. Bắt buộc có dòng này để dùng useUser

import Link from "next/link";
import { UserButton, SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Search, LayoutDashboard } from "lucide-react"; // Import thêm icon Dashboard cho đẹp

export default function Navbar() {
  // 2. Lấy thông tin user hiện tại
  const { user } = useUser();

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-white shadow-sm sticky top-0 z-50">
      {/* 1. Logo */}
      <Link href="/" className="text-2xl font-bold font-sans">
        Bloggy
      </Link>

      {/* 2. Menu Links */}
      <div className="hidden md:flex gap-8 font-medium text-gray-600">
        <Link href="/" className="hover:text-black transition">Home</Link>
        <Link href="/members" className="hover:text-black transition">Members</Link>
        <Link href="/blog" className="hover:text-black transition">Blog</Link>
        <Link href="/events" className="hover:text-black transition">Events</Link>
        <Link href="/contact" className="hover:text-black transition">Contact</Link>
      </div>

      {/* 3. Search & User Action */}
      <div className="flex items-center gap-4">
        {/* Thanh tìm kiếm */}
        <div className="hidden md:flex items-center bg-gray-100 px-3 py-2 rounded-full">
          <Search size={18} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="bg-transparent border-none outline-none text-sm ml-2 w-24"
          />
        </div>

        {/* Khu vực User */}
        <div className="flex items-center gap-3">
          <SignedOut>
            <SignInButton mode="modal">
               <button className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
               </button>
            </SignInButton>
          </SignedOut>
          
          <SignedIn>
            {/* 3. Logic hiển thị nút Admin */}
            {user?.publicMetadata?.role === 'admin' && (
              <Link 
                href="/admin" 
                className="hidden md:flex items-center gap-2 bg-black text-white px-3 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition mr-2"
              >
                <LayoutDashboard size={16} />
                <span>Quản lý</span>
              </Link>
            )}

            {/* Avatar User */}
            <UserButton />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
}