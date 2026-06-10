"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer"; // Import Footer gốc của bạn vào đây

export default function FooterWrapper() {
  const pathname = usePathname();

  // 🛡️ LOGIC QUAN TRỌNG:
  // Nếu đường dẫn bắt đầu bằng "/admin" -> Trả về null (Không hiện gì cả)
  if (pathname.startsWith("/admin")) {
    return null;
  }

  // Còn lại (trang chủ, blog...) -> Hiện Footer bình thường
  return <Footer />;
}