import Link from "next/link";
import Image from "next/image";
import { Calendar } from "lucide-react";

export default function BlogListDiary({ posts }: { posts: any[] }) {
  return (
    <div className="max-w-2xl mx-auto py-8 relative">
      {/* Lò xo của cuốn sổ chạy dọc bên trái */}
      <div className="absolute left-[-16px] md:left-[-32px] top-6 bottom-6 w-8 flex flex-col justify-between pointer-events-none z-20">
        {Array.from({ length: 15 }).map((_, idx) => (
          <div
            key={idx}
            className="w-8 h-4 bg-gradient-to-r from-gray-400 via-gray-200 to-gray-400 rounded-full border border-gray-600 shadow-md transform -rotate-12 my-2"
          />
        ))}
      </div>

      {/* Trang giấy cũ kẻ dòng */}
      <div className="bg-[#fdfbf7] border-l-[24px] md:border-l-[40px] border-amber-800/10 shadow-2xl rounded-r-3xl p-6 md:p-12 paper-lines relative overflow-hidden text-gray-800 min-h-[600px]">
        {/* Hiệu ứng hạt bụi phim cũ */}
        <div className="absolute inset-0 pointer-events-none film-grain opacity-40 z-0" />

        {/* Tiêu đề Sổ tay */}
        <div className="border-b-2 border-red-200/50 pb-4 mb-8 text-center relative z-10">
          <h1 className="text-4xl font-bold font-caveat text-amber-800 tracking-wide select-none">
            📔 Nhật ký những ngày thường nhật
          </h1>
          <p className="text-sm font-sans text-gray-500 uppercase tracking-widest mt-1">
            "Ghi lại những bình yên vụn vặt trôi qua..."
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-20 font-caveat text-2xl text-gray-500 relative z-10">
            Hôm nay chưa viết dòng nhật ký nào cả... ✏️
          </div>
        ) : (
          <div className="space-y-12 relative z-10">
            {posts.map((post, index) => {
              // Căn lề xoay nhẹ cho polaroid ngẫu nhiên
              const rotation = index % 2 === 0 ? "rotate-1 hover:rotate-0" : "-rotate-1 hover:rotate-0";
              const dateStr = new Date(post.created_at).toLocaleDateString("vi-VN", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              });

              // Làm sạch thẻ HTML để lấy dòng chữ thô
              const cleanSnippet = post.content
                ? post.content.replace(/<[^>]*>?/gm, "").substring(0, 180) + "..."
                : "";

              return (
                <article
                  key={post.id}
                  className="pb-10 border-b border-dashed border-gray-300 relative last:border-b-0 last:pb-0"
                >
                  {/* Ngày tháng ghi tay */}
                  <div className="flex items-center gap-2 font-sans text-xs text-amber-700/80 font-bold mb-3 tracking-wider">
                    <Calendar size={12} />
                    <span>{dateStr}</span>
                  </div>

                  {/* Tiêu đề */}
                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="text-3xl font-bold font-caveat text-gray-950 hover:text-amber-800 transition duration-200 leading-tight mb-4">
                      {post.title}
                    </h2>
                  </Link>

                  {/* Hình ảnh kiểu Polaroid dán băng keo */}
                  {post.image_url && (
                    <div className="my-6 flex justify-center">
                      <div
                        className={`relative bg-white p-4 pb-12 shadow-lg border border-gray-200/60 transition-all duration-300 transform ${rotation} max-w-[280px] w-full`}
                      >
                        {/* Miếng băng dính ở phía trên */}
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 -rotate-3 w-20 h-5 bg-amber-100/50 border-r border-l border-amber-200/40 shadow-xs backdrop-blur-xs select-none" />

                        <div className="relative aspect-square w-full bg-gray-100 overflow-hidden rounded-xs border border-gray-100">
                          <Image
                            src={post.image_url}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="250px"
                          />
                        </div>
                        {/* Chú thích viết tay */}
                        <div className="mt-4 text-center font-caveat text-base text-gray-500 truncate px-1 select-none">
                          📍 {post.title}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Dòng viết tay nội dung tóm tắt */}
                  <p className="font-caveat text-2xl leading-relaxed text-gray-700 whitespace-pre-line tracking-wide mb-4">
                    {cleanSnippet}
                  </p>

                  {/* Liên kết đọc tiếp */}
                  <div className="flex justify-end">
                    <Link
                      href={`/blog/${post.slug}`}
                      className="font-caveat text-xl text-amber-800 hover:text-amber-900 flex items-center gap-1 font-bold underline"
                    >
                      Đọc tiếp trang này ✏️
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
