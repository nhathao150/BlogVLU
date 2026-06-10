"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { Heart, BookOpen, Map, Coffee, Sparkles, ArrowRight } from "lucide-react";

const portals = [
  {
    id: "diary",
    title: "Nhật ký ngày thường",
    subtitle: "Cuốn Sổ Tay Cũ",
    description: "Những suy ngẫm thường nhật, những mẩu chuyện nhỏ, vui buồn trong ngày.",
    icon: <Heart className="w-10 h-10 text-rose-400 group-hover:scale-110 transition-transform duration-300" />,
    color: "rose",
    href: "/blog?category=nhat-ky",
    activeClass: "border-rose-500/50 shadow-[0_0_30px_rgba(244,63,94,0.3)] bg-rose-950/20",
    defaultClass: "border-white/10 bg-white/5 hover:border-rose-500/30",
  },
  {
    id: "tech",
    title: "Học tập & Công việc",
    subtitle: "Trạm Không Gian Hacker",
    description: "Nhật ký lập trình, kiến thức công nghệ mới và các cột mốc phát triển dự án.",
    icon: <BookOpen className="w-10 h-10 text-emerald-400 group-hover:scale-110 transition-transform duration-300" />,
    color: "emerald",
    href: "/blog?category=hoc-tap",
    activeClass: "border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.3)] bg-emerald-950/20",
    defaultClass: "border-white/10 bg-white/5 hover:border-emerald-500/30",
  },
  {
    id: "travel",
    title: "Đi & Trải nghiệm",
    subtitle: "Tạp Chí Sống Động",
    description: "Chuyến phượt xa, khám phá vùng đất mới và những buổi tụ họp đầy màu sắc.",
    icon: <Map className="w-10 h-10 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />,
    color: "cyan",
    href: "/blog?category=trai-nghiem",
    activeClass: "border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.3)] bg-cyan-950/20",
    defaultClass: "border-white/10 bg-white/5 hover:border-cyan-500/30",
  },
  {
    id: "chill",
    title: "Sở thích & Chill",
    subtitle: "Quán Cafe Chiều Mưa",
    description: "Góc nghe nhạc lofi lãng đãng, review phim, sách hay góc nhỏ cafe gỗ ấm áp.",
    icon: <Coffee className="w-10 h-10 text-amber-400 group-hover:scale-110 transition-transform duration-300" />,
    color: "amber",
    href: "/blog?category=chill",
    activeClass: "border-amber-500/50 shadow-[0_0_30px_rgba(245,158,11,0.3)] bg-amber-950/20",
    defaultClass: "border-white/10 bg-white/5 hover:border-amber-500/30",
  },
];

export default function Home() {
  const [hoveredPortal, setHoveredPortal] = useState<string | null>(null);

  // Chọn lớp overlay dựa vào thẻ đang hover
  const getThemeOverlay = () => {
    switch (hoveredPortal) {
      case "tech":
        return "opacity-100 bg-[#040814]/90 grid-bg border-emerald-500/20";
      case "chill":
        return "opacity-100 bg-amber-950/20 backdrop-blur-xs scale-102";
      case "diary":
        return "opacity-100 bg-orange-950/15 backdrop-blur-[1px]";
      case "travel":
        return "opacity-100 bg-[#030612]/70 backdrop-blur-[2px] saturate-120";
      default:
        return "opacity-0 pointer-events-none";
    }
  };

  return (
    <div 
      className={`min-h-screen text-white transition-all duration-700 relative overflow-hidden font-orbitron space-stars drift-bg bg-[#03030d]`}
    >
      {/* 1. Theme-specific background overlays triggered by hover */}
      <div 
        className={`absolute inset-0 transition-all duration-700 ease-out z-0 ${getThemeOverlay()}`}
      />

      {/* Hiệu ứng hạt mưa nếu hover vào Chill Portal */}
      <div 
        className={`absolute inset-0 z-0 transition-opacity duration-700 pointer-events-none ${
          hoveredPortal === "chill" ? "opacity-40" : "opacity-0"
        } rain-overlay`}
      />

      {/* Hiệu ứng vintage noise/grain nếu hover vào Diary Portal */}
      <div 
        className={`absolute inset-0 z-0 transition-opacity duration-700 pointer-events-none ${
          hoveredPortal === "diary" ? "opacity-30" : "opacity-0"
        } film-grain`}
      />

      {/* Hiệu ứng bẻ cong vortex/neon nếu hover vào Tech Portal */}
      {hoveredPortal === "tech" && (
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(16,185,129,0.1)_100%)] animate-pulse duration-[3000ms]" />
      )}

      {/* Navbar - Styled with Dark theme specifically for home */}
      <Navbar theme="dark" />

      {/* Main Container */}
      <main className="container mx-auto px-4 py-16 relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-64px)]">
        
        {/* Title / Hero Intro */}
        <div className="text-center max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-2 animate-bounce">
            <Sparkles className="w-3.5 h-3.5" /> Portal Ký Ức Của Nhật Hào
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white leading-tight drop-shadow-[0_0_12px_rgba(255,255,255,0.25)] select-none">
            CÁNH CỬA <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-rose-400 to-cyan-400">KHÔNG GIAN</span>
          </h1>
          
          <p className="text-gray-400 text-base md:text-lg tracking-wide font-sans max-w-2xl mx-auto leading-relaxed">
            Mỗi cánh cổng dẫn tới một chiều không gian cảm xúc khác biệt. Rê chuột để cảm nhận linh hồn thiết kế, và click để bước chân vào thế giới nhật ký của mình.
          </p>
        </div>

        {/* Portals Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl mb-16">
          {portals.map((portal) => {
            const isHovered = hoveredPortal === portal.id;
            return (
              <Link
                key={portal.id}
                href={portal.href}
                className={`group cursor-pointer p-6 rounded-3xl border transition-all duration-500 ease-out flex flex-col justify-between min-h-[300px] select-none ${
                  isHovered ? portal.activeClass : portal.defaultClass
                }`}
                onMouseEnter={() => setHoveredPortal(portal.id)}
                onMouseLeave={() => setHoveredPortal(null)}
              >
                {/* Header */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="p-3 bg-white/5 rounded-2xl border border-white/10 group-hover:bg-white/10 transition-colors duration-300">
                      {portal.icon}
                    </div>
                    <span className="text-xs text-gray-500 tracking-wider font-semibold group-hover:text-white transition-colors">
                      {portal.subtitle}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className={`text-xl font-bold tracking-wide transition-all ${
                      isHovered ? "scale-102" : ""
                    }`}>
                      {portal.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-sans group-hover:text-gray-300 transition-colors">
                      {portal.description}
                    </p>
                  </div>
                </div>

                {/* Footer Link Button */}
                <div className="pt-6 flex items-center gap-2 text-xs font-semibold text-gray-500 group-hover:text-white transition-all duration-300">
                  <span>Khám phá cổng này</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Global Timeline Link */}
        <div className="text-center">
          <Link href="/blog" className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold hover:scale-105 transition-all shadow-[0_0_20px_rgba(244,63,94,0.2)] hover:shadow-[0_0_30px_rgba(244,63,94,0.4)]">
            📚 BƯỚC VÀO TOÀN BỘ DÒNG THỜI GIAN
          </Link>
        </div>

      </main>
    </div>
  );
}