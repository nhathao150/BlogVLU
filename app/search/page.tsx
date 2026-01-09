import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { FileText, Calendar, ArrowRight, SearchX } from "lucide-react";

export const revalidate = 0;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams; // Lấy từ khóa từ URL
  const query = q || "";
  const supabase = await createClient();

  // 1. Tìm trong Blog (Posts)
  const { data: posts } = await supabase
    .from("posts")
    .select("id, title, slug, created_at")
    .ilike("title", `%${query}%`) // ilike là tìm kiếm không phân biệt hoa thường
    .eq("is_published", true)
    .limit(5);

  // 2. Tìm trong Sự kiện (Events)
  const { data: events } = await supabase
    .from("events")
    .select("id, title, event_date, location")
    .ilike("title", `%${query}%`)
    .eq("is_published", true)
    .limit(5);

  const hasResults = (posts && posts.length > 0) || (events && events.length > 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-2xl font-bold mb-8">
          Kết quả tìm kiếm cho: <span className="text-blue-600">"{query}"</span>
        </h1>

        {!hasResults ? (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed">
            <div className="flex justify-center mb-4 text-gray-300"><SearchX size={64}/></div>
            <p className="text-xl text-gray-500">Không tìm thấy kết quả nào.</p>
            <p className="text-gray-400 text-sm mt-2">Hãy thử từ khóa khác xem sao!</p>
          </div>
        ) : (
          <div className="space-y-12">
            
            {/* KẾT QUẢ BLOG */}
            {posts && posts.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <FileText className="text-green-600"/> Bài viết ({posts.length})
                </h2>
                <div className="grid gap-4">
                  {posts.map((post) => (
                    <Link key={post.id} href={`/blog/${post.slug}`} className="block bg-white p-6 rounded-xl shadow-sm border hover:border-blue-500 hover:shadow-md transition group">
                      <h3 className="text-lg font-bold group-hover:text-blue-600 transition">{post.title}</h3>
                      <p className="text-sm text-gray-500 mt-2">
                        Đăng ngày: {new Date(post.created_at).toLocaleDateString('vi-VN')}
                      </p>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* KẾT QUẢ SỰ KIỆN */}
            {events && events.length > 0 && (
              <section>
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Calendar className="text-red-600"/> Sự kiện ({events.length})
                </h2>
                <div className="grid gap-4">
                  {events.map((ev) => (
                    <div key={ev.id} className="bg-white p-6 rounded-xl shadow-sm border hover:border-red-500 transition">
                      <h3 className="text-lg font-bold">{ev.title}</h3>
                      <div className="flex gap-4 text-sm text-gray-600 mt-2">
                         <span>📅 {new Date(ev.event_date).toLocaleDateString('vi-VN')}</span>
                         <span>📍 {ev.location}</span>
                      </div>
                      <div className="mt-3">
                        <Link href="/events" className="text-sm font-medium text-red-600 hover:underline flex items-center gap-1">
                            Xem chi tiết tại trang Sự kiện <ArrowRight size={14}/>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

          </div>
        )}
      </main>
    </div>
  );
}