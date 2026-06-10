import Link from "next/link";
import Image from "next/image";
import { Coffee, Calendar, Music, Disc } from "lucide-react";

export default function BlogListChill({ posts }: { posts: any[] }) {
  return (
    <div className="relative p-1 min-h-[400px] overflow-hidden rounded-3xl animate-in fade-in duration-500 font-garamond">
      
      {/* Lưới các bài viết + Đĩa lofi */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        
        {/* 1. HỘP NHẠC RETRO VINYL (Chèn ở đầu lưới như một widget động) */}
        <div className="bg-[#ebd9bd]/50 backdrop-blur-md rounded-3xl border border-amber-900/10 p-6 flex flex-col items-center justify-center space-y-4 shadow-md text-center">
          <div className="relative">
            {/* Đĩa Than quay tròn */}
            <div className="w-24 h-24 bg-zinc-950 rounded-full border-4 border-zinc-900 flex items-center justify-center shadow-2xl spin-slow relative">
              {/* Các đường vân đĩa */}
              <div className="absolute inset-2 rounded-full border border-zinc-800 opacity-60" />
              <div className="absolute inset-4 rounded-full border border-zinc-800 opacity-60" />
              <div className="absolute inset-6 rounded-full border border-zinc-800 opacity-60" />
              {/* Nhãn Đĩa */}
              <div className="w-8 h-8 bg-amber-700 rounded-full border border-zinc-950 flex items-center justify-center">
                <Disc className="w-4 h-4 text-amber-200" />
              </div>
            </div>
            {/* Kim đọc đĩa */}
            <div className="absolute top-[-5px] right-[-10px] w-8 h-12 border-l-2 border-t-2 border-amber-800 rounded-tl-lg origin-top-right rotate-[15deg]" />
          </div>

          <div className="space-y-1">
            <h3 className="text-lg font-bold text-amber-950">Lofi Chiều Mưa ☕</h3>
            <p className="text-[10px] text-amber-900/60 uppercase tracking-widest font-sans font-bold">Rainy Day Radio</p>
          </div>

          {/* Sóng nhạc Visualizer mờ chạy bằng CSS pulse */}
          <div className="flex items-end justify-center gap-[3px] h-6 w-20">
            <div className="w-1 bg-amber-800/80 rounded-full h-3 animate-pulse duration-700" />
            <div className="w-1 bg-amber-800/80 rounded-full h-5 animate-pulse duration-500 delay-100" />
            <div className="w-1 bg-amber-800/80 rounded-full h-2 animate-pulse duration-900 delay-200" />
            <div className="w-1 bg-amber-800/80 rounded-full h-4 animate-pulse duration-400" />
            <div className="w-1 bg-amber-800/80 rounded-full h-6 animate-pulse duration-600 delay-300" />
            <div className="w-1 bg-amber-800/80 rounded-full h-3 animate-pulse duration-800 delay-150" />
          </div>

          <div className="text-[10px] text-amber-900/70 font-sans font-semibold">
            📻 Streaming Status: Chill active
          </div>
        </div>

        {/* 2. CÁC BÀI VIẾT KHÁC */}
        {posts.map((post) => (
          <Link
            href={`/blog/${post.slug}`}
            key={post.id}
            className="group bg-[#fdfcf7]/80 backdrop-blur-md rounded-3xl border border-amber-900/10 hover:border-amber-700/30 hover:bg-[#fcfbf4] shadow-xs hover:shadow-xl hover:-translate-y-1 transition duration-300 overflow-hidden flex flex-col h-full"
          >
            {/* Ảnh bìa */}
            <div className="p-4">
              <div className="relative h-48 w-full bg-amber-100/30 rounded-2xl overflow-hidden">
                {post.image_url ? (
                  <Image
                    src={post.image_url}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-102 transition duration-500"
                    sizes="(max-width: 768px) 100vw, 300px"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-amber-800/60 bg-amber-100/20">
                    <Coffee size={24} className="opacity-40 mb-1" />
                    <span className="text-xs">Góc cafe nhỏ</span>
                  </div>
                )}
              </div>
            </div>

            {/* Nội dung */}
            <div className="px-6 pb-6 pt-2 flex flex-col flex-grow space-y-3 text-gray-800">
              <div className="flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-250/30 px-2 py-0.5 rounded-full w-max">
                <Coffee size={10} />
                <span>Góc Chill</span>
              </div>

              <h2 className="text-2xl font-bold leading-tight tracking-wide text-gray-950 group-hover:text-amber-800 transition">
                {post.title}
              </h2>

              <div className="mt-auto pt-3 flex items-center justify-between text-gray-500 text-xs border-t border-amber-900/10">
                <span className="flex items-center gap-1 font-semibold text-amber-800">
                  <Music size={12} className="text-amber-700" />
                  Ghé Đọc ☕
                </span>
                <span className="flex items-center gap-1 text-gray-400">
                  <Calendar size={12} />
                  {new Date(post.created_at).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {posts.length === 0 && (
        <div className="relative z-10 py-20 text-center text-amber-900/40 italic">
          Chưa có chia sẻ lofi chill nào cả.
        </div>
      )}
    </div>
  );
}
