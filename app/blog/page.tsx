import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import Image from "next/image";
import { Calendar, User, ArrowLeft, ArrowRight } from "lucide-react";

export const revalidate = 60; // Cache trong 60s

// CẤU HÌNH SỐ LƯỢNG BÀI VIẾT
const ITEMS_PER_PAGE = 9; // 3 cột x 3 hàng = 9 bài

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  // 1. Xử lý trang hiện tại (Next.js 15 bắt buộc await searchParams)
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;

  // Tính toán vị trí cắt dữ liệu
  // Trang 1: from 0 to 8
  // Trang 2: from 9 to 17
  const from = (currentPage - 1) * ITEMS_PER_PAGE;
  const to = from + ITEMS_PER_PAGE - 1;

  // 2. Kết nối Supabase và lấy dữ liệu
  const supabase = await createClient();

  // Lấy danh sách bài viết + Tổng số lượng bài (count)
  const { data: posts, count } = await supabase
    .from("posts")
    .select("*", { count: "exact" }) // Lấy thêm tổng số bài để tính trang
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .range(from, to); // <--- QUAN TRỌNG: Chỉ lấy trong khoảng này

  // 3. Tính toán tổng số trang
  const totalPosts = count || 0;
  const totalPages = Math.ceil(totalPosts / ITEMS_PER_PAGE);

  // Kiểm tra nút bấm Next/Prev có được bấm không
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="container mx-auto px-4 py-12 flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Bài viết mới nhất ✍️
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chia sẻ kiến thức, trải nghiệm và những câu chuyện thú vị từ cộng đồng.
          </p>
        </div>

        {/* --- DANH SÁCH BÀI VIẾT (GRID 3 CỘT) --- */}
        {!posts || posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500 mb-4">
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
            {/* LƯỚI BÀI VIẾT: Mobile 1 cột, Tablet 2 cột, PC 3 cột */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <Link
                  href={`/blog/${post.slug}`}
                  key={post.id}
                  className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
                >
                  {/* Ảnh bìa */}
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

                  {/* Nội dung */}
                  <div className="p-6 flex flex-col flex-grow">
                    <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition">
                      {post.title}
                    </h2>

                    <div className="mt-auto pt-4 flex items-center justify-between text-gray-500 text-sm border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <User size={14} className="text-blue-500" />
                        <span className="font-medium">Admin Team</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar size={14} />
                        <span>
                          {new Date(post.created_at).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* --- THANH PHÂN TRANG (PAGINATION) --- */}
            <div className="mt-12 flex items-center justify-center gap-4">
              {/* Nút Quay lại (Previous) */}
              <Link
                href={`/blog?page=${currentPage - 1}`}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition ${!hasPrevPage
                  ? "bg-gray-100 text-gray-400 pointer-events-none cursor-not-allowed"
                  : "bg-white border border-gray-300 text-gray-700 hover:bg-black hover:text-white hover:border-black"
                  }`}
                aria-disabled={!hasPrevPage}
              >
                <ArrowLeft size={18} /> Trang trước
              </Link>

              <span className="text-sm font-medium text-gray-500">
                Trang {currentPage} / {totalPages}
              </span>

              {/* Nút Tiếp theo (Next) */}
              <Link
                href={`/blog?page=${currentPage + 1}`}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition ${!hasNextPage
                  ? "bg-gray-100 text-gray-400 pointer-events-none cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-800"
                  }`}
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