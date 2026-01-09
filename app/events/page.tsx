import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import { currentUser } from "@clerk/nextjs/server";
import EventCard from "@/components/EventCard";

export const revalidate = 0;

export default async function EventsPage() {
  const supabase = await createClient();
  const user = await currentUser();

  // 1. Lấy danh sách sự kiện
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false });

  // 2. Lấy thêm thông tin Likes và Comments cho từng bài
  // (Đoạn này xử lý hơi nâng cao để lấy count, nếu khó quá bạn có thể bỏ qua bước count ban đầu)
  const eventsWithStats = await Promise.all(
    (events || []).map(async (event) => {
        // Đếm like
        const { count: likesCount } = await supabase.from('event_likes').select('*', { count: 'exact', head: true }).eq('event_id', event.id);
        
        // Đếm comment
        const { count: commentsCount } = await supabase.from('event_comments').select('*', { count: 'exact', head: true }).eq('event_id', event.id);
        
        // Kiểm tra user hiện tại đã like chưa
        let currentUserLike = false;
        if (user) {
            const { data } = await supabase.from('event_likes').select('*').eq('event_id', event.id).eq('user_id', user.id).single();
            if (data) currentUserLike = true;
        }

        return {
            ...event,
            likesCount: likesCount || 0,
            commentsCount: commentsCount || 0,
            currentUserLike
        };
    })
  );

  return (
    <div className="min-h-screen bg-[#F0F2F5]">
      <Navbar />
      <main className="container mx-auto px-0 md:px-4 py-6 max-w-2xl">
        <div className="bg-white md:rounded-xl shadow-sm border border-gray-200 p-6 mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">Bảng tin Sự kiện 📢</h1>
            <p className="text-gray-500 text-sm mt-1">Cập nhật hoạt động mới nhất từ VLU</p>
        </div>

        <div className="space-y-4">
            {eventsWithStats.map((event) => (
                <EventCard 
                    key={event.id} 
                    event={event} 
                    likesCount={event.likesCount}
                    commentsCount={event.commentsCount}
                    currentUserLike={event.currentUserLike}
                />
            ))}
        </div>
      </main>
    </div>
  );
}