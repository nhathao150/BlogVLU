import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User } from "lucide-react";

export const revalidate = 0; // Quan trọng: Dòng này giúp list bài viết luôn mới nhất (không cache cũ)

export default async function BlogPage() {
  // 1. Kết nối Supabase
  const supabase = await createClient();

  // 2. Lấy dữ liệu từ bảng 'posts'
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .eq('is_published', true) // Chỉ lấy bài đã Publish
    .order('created_at', { ascending: false }); // Sắp xếp bài mới nhất lên đầu

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Bài viết mới nhất ✍️</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chia sẻ kiến thức, trải nghiệm và những câu chuyện thú vị.
          </p>
        </div>

        {/* --- DANH SÁCH BÀI VIẾT --- */}
        {!posts || posts.length === 0 ? (
          // Trường hợp chưa có bài nào
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300">
            <p className="text-xl text-gray-500 mb-4">Chưa có bài viết nào được công khai.</p>
            {/* Nút dành cho Admin */}
            <Link href="/admin/posts/create">
              <button className="bg-black text-white px-6 py-2 rounded-lg font-medium hover:opacity-80 transition">
                Viết bài ngay
              </button>
            </Link>
          </div>
        ) : (
          // Trường hợp CÓ bài viết -> Hiển thị dạng lưới 3 cột
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link 
                href={`/blog/${post.slug}`} // Đường dẫn vào xem chi tiết
                key={post.id}
                className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
              >
                {/* 1. Ảnh bìa */}
                <div className="relative h-56 w-full bg-gray-200 overflow-hidden">
                  {post.image_url ? (
                    <Image 
                      src={post.image_url} 
                      alt={post.title} 
                      fill 
                      className="object-cover group-hover:scale-105 transition duration-500"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 font-medium bg-gray-100">
                      Blog Default Image
                    </div>
                  )}
                </div>

                {/* 2. Nội dung tóm tắt */}
                <div className="p-6 flex flex-col flex-grow">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition">
                    {post.title}
                  </h2>
                  
                  {/* Meta data: Tác giả & Ngày tháng */}
                  <div className="mt-auto pt-4 flex items-center justify-between text-gray-500 text-sm border-t border-gray-100">
                    <div className="flex items-center gap-2">
                       <User size={14} className="text-blue-500" />
                       <span className="font-medium">Admin Team</span>
                    </div>
                    <div className="flex items-center gap-2">
                       <Calendar size={14} />
                       <span>
                         {new Date(post.created_at).toLocaleDateString("vi-VN", {
                           day: "2-digit", month: "2-digit", year: "numeric"
                         })}
                       </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}