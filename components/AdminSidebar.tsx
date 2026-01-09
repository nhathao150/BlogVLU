'use client'

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FileText, Calendar, Users, Settings, LogOut, Mail } from "lucide-react";
import { SignOutButton } from "@clerk/nextjs";

const menuItems = [
  { 
    name: "Tổng quan", 
    href: "/admin", 
    icon: LayoutDashboard,
    exact: true // Chỉ active khi đúng chính xác đường dẫn này
  },
  { 
    name: "Bài viết (Blog)", 
    href: "/admin/posts", 
    icon: FileText 
  },
  { 
    name: "Thành viên", 
    href: "/admin/users", 
    icon: Users 
  },
  // Bạn có thể thêm mục Sự kiện nếu muốn
  { 
    name: "Sự kiện", 
    href: "/admin/events", 
    icon: Calendar 
  },
  { 
  name: "Hộp thư", 
  href: "/admin/contacts", 
  icon: Mail // Import icon Mail từ lucide-react
},
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col sticky top-0 left-0">
      
      {/* 1. LOGO / BRAND */}
      <div className="h-16 flex items-center px-6 border-b border-gray-100">
        <h1 className="text-xl font-bold tracking-tight">Admin<span className="text-blue-600">CMS</span></h1>
      </div>

      {/* 2. MENU LIST */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 mt-2">
          Menu Chính
        </p>
        
        {menuItems.map((item) => {
          // Logic kiểm tra xem mục nào đang được chọn
          const isActive = item.exact 
            ? pathname === item.href
            : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                isActive
                  ? "bg-black text-white shadow-md shadow-gray-300 translate-x-1" // Style khi được chọn
                  : "text-gray-600 hover:bg-gray-100 hover:text-black hover:translate-x-1" // Style bình thường
              }`}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              <span>{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* 3. FOOTER (Cài đặt & Đăng xuất) */}
      <div className="p-4 border-t border-gray-100 bg-gray-50/50 space-y-1">
        <Link 
            href="/admin/settings" 
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-200 transition font-medium"
        >
            <Settings size={20} /> Cài đặt
        </Link>
        
        {/* Nút đăng xuất của Clerk */}
        <SignOutButton redirectUrl="/">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition font-medium text-left">
                <LogOut size={20} /> Đăng xuất
            </button>
        </SignOutButton>
      </div>
    </aside>
  );
}