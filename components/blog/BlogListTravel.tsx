import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Compass } from "lucide-react";

export default function BlogListTravel({ posts }: { posts: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in fade-in duration-500 font-playfair">
      {posts.map((post, index) => {
        // Lưới so le so le ngẫu nhiên để mô phỏng trang tạp chí
        const isBig = index % 3 === 0;

        return (
          <Link
            href={`/blog/${post.slug}`}
            key={post.id}
            className={`group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-700 flex flex-col justify-end bg-zinc-950 ${
              isBig ? "md:col-span-2 h-[460px]" : "h-[360px] md:h-[460px]"
            }`}
          >
            {/* Khung viền tạp chí mảnh nằm bên trong card */}
            <div className="absolute inset-4 border border-white/20 group-hover:inset-3 group-hover:border-white/40 z-25 pointer-events-none transition-all duration-500" />

            {/* Ảnh nền với hiệu ứng phóng to chậm (Ken Burns) */}
            {post.image_url ? (
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                className="object-cover opacity-85 group-hover:opacity-70 scale-102 group-hover:scale-110 transition-all duration-1000 ease-out pointer-events-none"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 bg-zinc-900 font-sans">
                <Compass className="w-8 h-8 mb-2 animate-spin-slow text-zinc-700" />
                <span>Chưa có hình ảnh hành trình</span>
              </div>
            )}

            {/* Lớp gradient đen mờ tạo chiều sâu */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none" />

            {/* Nội dung bìa tạp chí */}
            <div className="relative z-20 p-8 space-y-4 text-white pointer-events-none">
              
              {/* Thẻ ngày tháng (font sans thanh mảnh) */}
              <div className="inline-flex items-center gap-1.5 bg-black/40 backdrop-blur-md border border-white/10 px-3 py-1 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider text-amber-300">
                <Calendar size={12}/>
                {new Date(post.created_at).toLocaleDateString('vi-VN')}
              </div>

              {/* Tiêu đề Serif lớn sang trọng */}
              <h2 className="text-2xl md:text-3xl font-normal leading-tight tracking-wide drop-shadow-lg group-hover:text-amber-200 transition-colors duration-300">
                {post.title}
              </h2>

              {/* Dòng viết tắt vị trí hoặc hành trình */}
              <div className="pt-2 flex items-center gap-1.5 text-xs font-sans text-gray-300 transform translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                <MapPin size={12} className="text-amber-400" />
                <span>Bắt đầu hành trình khám phá &rarr;</span>
              </div>

            </div>
          </Link>
        );
      })}

      {posts.length === 0 && (
        <div className="col-span-full py-20 text-center text-zinc-400 italic font-sans">
          Chưa có chia sẻ hành trình nào ở đây.
        </div>
      )}
    </div>
  );
}
