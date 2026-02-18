import Navbar from "@/components/Navbar";
import { createClient } from "@/utils/supabase/server";
import { currentUser } from "@clerk/nextjs/server";
import EventCard from "@/components/EventCard";

export const revalidate = 0;

export default async function EventsPage() {
  const supabase = await createClient();
  const user = await currentUser();

  // 1. Lấy danh sách sự kiện (Giới hạn 20 bài mới nhất để tối ưu)
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_published', true)
    .order('created_at', { ascending: false })
    .limit(20);

  // 2. Tối ưu: Lấy danh sách ID các sự kiện đã tải
  const eventIds = events?.map(e => e.id) || [];

  // 3. Tối ưu: Kiểm tra User đã like những bài nào trong 1 lần query (Thay vì N lần)
  const userLikedEventIds = new Set<string>();
  if (user && eventIds.length > 0) {
    const { data: likedEvents } = await supabase
      .from('event_likes')
      .select('event_id')
      .eq('user_id', user.id)
      .in('event_id', eventIds);
    
    if (likedEvents) {
      likedEvents.forEach((item: { event_id: string }) => userLikedEventIds.add(item.event_id));
    }
  }

  // 4. Lấy thông tin Likes và Comments (Vẫn giữ Promise.all nhưng chỉ chạy cho 20 item -> Nhanh hơn nhiều)
  const eventsWithStats = await Promise.all(
    (events || []).map(async (event) => {
        // Đếm like
        const { count: likesCount } = await supabase.from('event_likes').select('*', { count: 'exact', head: true }).eq('event_id', event.id);
        
        // Đếm comment
        const { count: commentsCount } = await supabase.from('event_comments').select('*', { count: 'exact', head: true }).eq('event_id', event.id);
        
        return {
            ...event,
            likesCount: likesCount || 0,
            commentsCount: commentsCount || 0,
            currentUserLike: userLikedEventIds.has(event.id) // Check từ Set đã verify ở trên
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