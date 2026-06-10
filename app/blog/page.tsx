import Navbar from "@/components/layout/Navbar";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowLeft, ArrowRight } from "lucide-react";
import BlogFilter from "@/components/blog/BlogFilter";
import BlogListDefault from "@/components/blog/BlogListDefault";
import BlogListDiary from "@/components/blog/BlogListDiary";
import BlogListTech from "@/components/blog/BlogListTech";
import BlogListTravel from "@/components/blog/BlogListTravel";
import BlogListChill from "@/components/blog/BlogListChill";

export const revalidate = 60; // Cache trong 60s

// CẤU HÌNH SỐ LƯỢNG BÀI VIẾT
const ITEMS_PER_PAGE = 9; // 3 cột x 3 hàng = 9 bài

const getCategoryTitle = (cat?: string) => {
  switch (cat) {
    case "nhat-ky": return "Nhật ký ngày thường ❤️";
    case "hoc-tap": return "Học tập & Công việc 📖";
    case "trai-nghiem": return "Đi & Trải nghiệm 🗺️";
    case "chill": return "Sở thích & Chill ☕";
    default: return "Nhật ký cuộc sống ✍️";
  }
}

const getCategoryDesc = (cat?: string) => {
  switch (cat) {
    case "nhat-ky": return "Những câu chuyện nhỏ nhặt, suy tư và cảm xúc thường ngày.";
    case "hoc-tap": return "Nhật ký hành trình tích lũy kiến thức, công việc lập trình.";
    case "trai-nghiem": return "Những bức ảnh đi chơi, những nẻo đường và trải nghiệm cuộc sống.";
    case "chill": return "Những sở thích cá nhân, phim ảnh, sách báo và các góc thư giãn.";
    default: return "Nơi ghi lại những câu chuyện, trải nghiệm hằng ngày và kỷ niệm của Hào.";
  }
}

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; year?: string; month?: string; category?: string }>;
}) {
  // 1. Xử lý trang hiện tại (Next.js 15 bắt buộc await searchParams)
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // Tính toán vị trí cắt dữ liệu
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // 2. Kết nối Supabase và lấy dữ liệu
  const supabase = await createClient();

  // A. Lấy tất cả ngày tạo của bài viết để sinh bộ lọc năm/tháng
  const { data: allDates } = await supabase
    .from("posts")
    .select("created_at")
    .eq("is_published", true);

  const years = Array.from(new Set(allDates?.map(d => new Date(d.created_at).getFullYear()) || []))
    .sort((a, b) => b - a);

  // B. Xây dựng câu query lọc bài viết động
  let query = supabase
    .from("posts")
    .select("*", { count: "exact" })
    .eq("is_published", true);

  if (params.category) {
    query = query.eq("category", params.category);
  }

  if (params.year) {
    const y = Number(params.year);
    if (params.month) {
      const m = Number(params.month);
      const startDate = new Date(Date.UTC(y, m - 1, 1, 0, 0, 0)).toISOString();
      const endDate = new Date(Date.UTC(y, m, 1, 0, 0, 0)).toISOString();
      query = query.gte("created_at", startDate).lt("created_at", endDate);
    } else {
      const startDate = new Date(Date.UTC(y, 0, 1, 0, 0, 0)).toISOString();
      const endDate = new Date(Date.UTC(y + 1, 0, 1, 0, 0, 0)).toISOString();
      query = query.gte("created_at", startDate).lt("created_at", endDate);
    }
  }

  // Lấy danh sách bài viết theo trang và bộ lọc
  const { data: posts, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  // 3. Tính toán tổng số trang
  const totalPosts = count || 0;
  const totalPages = Math.ceil(totalPosts / ITEMS_PER_PAGE) || 1;

  // Kiểm tra nút bấm Next/Prev có được bấm không
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  const isTech = params.category === "hoc-tap";
  const isDiary = params.category === "nhat-ky";
  const isChill = params.category === "chill";
  const isTravel = params.category === "trai-nghiem";

  let bgClass = "min-h-screen bg-gray-50 flex flex-col transition-colors duration-300";
  if (isTech) {
    bgClass = "min-h-screen bg-[#040814] grid-bg text-emerald-400 font-fira flex flex-col transition-colors duration-300";
  } else if (isDiary) {
    bgClass = "min-h-screen bg-[#faf6ee] text-gray-950 font-caveat flex flex-col transition-colors duration-300";
  } else if (isChill) {
    bgClass = "min-h-screen bg-[#f5ebd6] text-gray-800 font-garamond flex flex-col transition-colors duration-300 relative";
  } else if (isTravel) {
    bgClass = "min-h-screen bg-[#fafaf9] text-gray-900 font-playfair flex flex-col transition-colors duration-300";
  }

  let titleClass = "text-4xl font-bold mb-4 transition-all ";
  if (isTech) titleClass += "text-white font-bold drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]";
  else if (isDiary) titleClass += "text-amber-900 font-caveat text-5xl";
  else if (isChill) titleClass += "text-amber-950 font-garamond italic text-5xl";
  else if (isTravel) titleClass += "text-gray-950 font-playfair uppercase tracking-widest text-4xl";
  else titleClass += "text-gray-900";

  let descClass = "max-w-2xl mx-auto transition-all ";
  if (isTech) descClass += "text-emerald-500/80 font-mono text-sm";
  else if (isDiary) descClass += "text-amber-800/80 text-xl";
  else if (isChill) descClass += "text-amber-900/80 italic text-xl";
  else if (isTravel) descClass += "text-gray-650 italic text-sm";
  else descClass += "text-gray-600";

  let prevBtnClass = "flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition ";
  if (!hasPrevPage) {
    prevBtnClass += isTech 
      ? "bg-gray-950 text-emerald-950 border border-emerald-950/20 pointer-events-none cursor-not-allowed" 
      : "bg-gray-100 text-gray-400 pointer-events-none cursor-not-allowed";
  } else {
    if (isTech) {
      prevBtnClass += "bg-[#0c1328] border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-black hover:border-emerald-500";
    } else if (isDiary) {
      prevBtnClass += "bg-[#fdfbf7] border border-amber-200 text-amber-800 hover:bg-amber-100/50";
    } else if (isChill) {
      prevBtnClass += "bg-white border border-amber-100 text-amber-900 hover:bg-amber-50";
    } else {
      prevBtnClass += "bg-white border border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black";
    }
  }

  let nextBtnClass = "flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition ";
  if (!hasNextPage) {
    nextBtnClass += isTech 
      ? "bg-gray-950 text-emerald-950 border border-emerald-950/20 pointer-events-none cursor-not-allowed" 
      : "bg-gray-100 text-gray-400 pointer-events-none cursor-not-allowed";
  } else {
    if (isTech) {
      nextBtnClass += "bg-emerald-500 text-black hover:bg-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]";
    } else if (isDiary) {
      nextBtnClass += "bg-amber-800 text-white hover:bg-amber-900";
    } else if (isChill) {
      nextBtnClass += "bg-amber-700 text-white hover:bg-amber-850";
    } else {
      nextBtnClass += "bg-black text-white hover:bg-gray-800";
    }
  }

  let pageIndicatorClass = "text-sm font-medium ";
  if (isTech) pageIndicatorClass += "text-emerald-500/60";
  else if (isDiary) pageIndicatorClass += "text-amber-800/80 font-caveat text-2xl";
  else if (isChill) pageIndicatorClass += "text-amber-900/80";
  else pageIndicatorClass += "text-gray-500";

  // Render Poster lớn theo từng chủ đề
  const renderCategoryPoster = () => {
    switch (params.category) {
      case "nhat-ky":
        return (
          <div className="relative rounded-3xl overflow-hidden bg-[#FAF6EE] border-2 border-amber-800/10 shadow-lg p-8 md:p-12 mb-12 paper-lines min-h-[260px] flex flex-col justify-center items-center text-center">
            <div className="absolute inset-0 pointer-events-none film-grain opacity-30 z-0" />
            <span className="text-4xl mb-3 animate-bounce z-10">📔</span>
            <h1 className="text-4xl md:text-5xl font-bold font-caveat text-amber-900 tracking-wide z-10">
              Nhật Ký Ngày Thường
            </h1>
            <div className="w-16 h-0.5 bg-red-300 my-4 z-10" />
            <p className="max-w-xl text-amber-800/80 font-caveat text-xl md:text-2xl leading-relaxed z-10">
              "Ghi lại những bình yên vụn vặt trôi qua, để sau này khi nhìn lại ta mỉm cười nhớ về ngày hôm qua."
            </p>
          </div>
        );
      case "hoc-tap":
        return (
          <div className="relative rounded-3xl overflow-hidden bg-[#0c1328] border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.1)] p-8 md:p-12 mb-12 grid-bg min-h-[260px] flex flex-col justify-center items-center text-center font-fira">
            <div className="absolute top-4 left-4 flex items-center gap-1.5 text-xs text-emerald-500/40 z-10">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>TERMINAL STATUS: ONLINE</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white drop-shadow-[0_0_8px_rgba(16,185,129,0.4)] tracking-wide mb-3 z-10">
              &gt;_ Trạm Lập Trình & Công Việc
            </h1>
            <p className="max-w-xl text-emerald-400/80 font-mono text-sm leading-relaxed z-10">
              Hệ thống logs tự học, lưu trữ source code, ghi chép kỹ thuật và các cột mốc công việc hàng ngày.
            </p>
            <div className="mt-4 text-xs text-emerald-500/40 font-mono z-10">
              [SYSTEM VER: 16.1.1] [USER: haodev]
            </div>
          </div>
        );
      case "trai-nghiem":
        return (
          <div className="relative rounded-3xl overflow-hidden bg-zinc-950 p-8 md:p-12 mb-12 min-h-[280px] flex flex-col justify-center items-center text-center font-playfair border border-white/10">
            <div className="absolute inset-4 border border-white/20 z-20 pointer-events-none" />
            <div className="absolute inset-0 bg-cover bg-center opacity-40 z-0" style={{ backgroundImage: "url('/diary-hero.png')" }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20 z-10" />
            <div className="relative z-20 space-y-3">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-sans font-bold">TRAVEL MAGAZINE EDITION</span>
              <h1 className="text-4xl md:text-5xl font-normal text-white uppercase tracking-wider">
                Đi & Trải Nghiệm
              </h1>
              <p className="max-w-xl text-gray-300 text-sm font-sans italic mx-auto">
                Lưu lại những cung đường phượt xa, những vùng đất mới lạ cùng những buổi tụ họp bạn bè đầy màu sắc.
              </p>
            </div>
          </div>
        );
      case "chill":
        return (
          <div className="relative rounded-3xl overflow-hidden bg-[#ebcda5]/20 border border-amber-900/10 shadow-md p-8 md:p-12 mb-12 min-h-[260px] flex flex-col justify-center items-center text-center font-garamond">
            <div className="absolute inset-0 pointer-events-none rain-overlay opacity-30 z-0" />
            <div className="absolute inset-0 pointer-events-none film-grain opacity-25 z-0" />
            <span className="text-4xl mb-3 animate-pulse z-10">☕</span>
            <h1 className="text-3xl md:text-4xl font-bold text-amber-950 italic tracking-wide z-10">
              Sở Thích & Chill
            </h1>
            <p className="max-w-xl text-amber-900/75 text-lg md:text-xl leading-relaxed mt-2 z-10">
              Bản nhạc lofi chiều mưa lãng đãng, tách cafe gỗ ấm áp, góc review phim và những cuốn sách yêu thích.
            </p>
          </div>
        );
      default:
        return (
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-amber-600 via-rose-500 to-amber-700 shadow-xl p-8 md:p-12 mb-12 min-h-[260px] flex flex-col justify-center items-center text-center text-white">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_40%,_rgba(0,0,0,0.2)_100%)] z-0" />
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight drop-shadow-md select-none mb-3 z-10">
              Nhật Ký Cuộc Sống
            </h1>
            <p className="max-w-xl text-white/90 text-base md:text-lg leading-relaxed font-sans z-10">
              Nơi lưu trữ những dòng ký ức đời thường, trải nghiệm du lịch, góc học tập và những góc nhỏ cafe yên ả.
            </p>
          </div>
        );
    }
  };

  return (
    <div className={bgClass}>
      <Navbar theme={isTech ? "dark" : "light"} />

      {/* Hiệu ứng hạt mưa nếu là Chill Cafe */}
      {isChill && (
        <div className="absolute inset-0 pointer-events-none rain-overlay opacity-30 z-0" />
      )}
      {/* Hiệu ứng nhiễu phim nếu là Nhật ký hoặc Chill */}
      {(isDiary || isChill) && (
        <div className="absolute inset-0 pointer-events-none film-grain opacity-20 z-0" />
      )}

      <main className="container mx-auto px-4 py-12 flex-grow relative z-10">
        {/* Poster lớn theo từng danh mục */}
        {renderCategoryPoster()}

        {/* Bộ lọc thời gian */}
        <BlogFilter years={years} />

        {/* --- DANH SÁCH BÀI VIẾT THEO LAYOUT --- */}
        {!posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <p className={`text-xl mb-4 ${isTech ? "text-emerald-500/60" : "text-gray-500"}`}>
              Chưa có bài viết nào ở trang này.
            </p>
            {currentPage > 1 && (
              <Link href="/blog" className="text-blue-600 hover:underline">
                Quay lại trang 1
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Render dynamic layouts based on category */}
            {params.category === "nhat-ky" && <BlogListDiary posts={posts} />}
            {params.category === "hoc-tap" && <BlogListTech posts={posts} />}
            {params.category === "trai-nghiem" && <BlogListTravel posts={posts} />}
            {params.category === "chill" && <BlogListChill posts={posts} />}
            {!params.category && <BlogListDefault posts={posts} />}

            {/* --- THANH PHÂN TRANG (PAGINATION) --- */}
            <div className="mt-12 flex items-center justify-center gap-4">
              {/* Nút Quay lại (Previous) */}
              <Link
                href={`/blog?page=${currentPage - 1}${params.year ? `&year=${params.year}` : ''}${params.month ? `&month=${params.month}` : ''}${params.category ? `&category=${params.category}` : ''}`}
                className={prevBtnClass}
                aria-disabled={!hasPrevPage}
              >
                <ArrowLeft size={18} /> Trang trước
              </Link>

              <span className={pageIndicatorClass}>
                Trang {currentPage} / {totalPages}
              </span>

              {/* Nút Tiếp theo (Next) */}
              <Link
                href={`/blog?page=${currentPage + 1}${params.year ? `&year=${params.year}` : ''}${params.month ? `&month=${params.month}` : ''}${params.category ? `&category=${params.category}` : ''}`}
                className={nextBtnClass}
                aria-disabled={!hasNextPage}
              >
                Trang sau <ArrowRight size={18} />
              </Link>
            </div>
          </>
        )}
      </main>
    </div>
  );
}