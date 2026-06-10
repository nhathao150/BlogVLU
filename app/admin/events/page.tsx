import Link from "next/link";
import { createClient } from "@/utils/supabase/server";
import { Plus, MapPin, Calendar, Edit } from "lucide-react";
import DeleteEventButton from "@/components/admin/DeleteEventButton";

export const revalidate = 0;

export default async function EventsAdminPage() {
  const supabase = await createClient();
  // Lấy danh sách sự kiện
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('event_date', { ascending: false });

  return (
    <div className="p-6">
      {/* Header + Nút Thêm mới */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý Khoảnh khắc 📸</h1>
        <Link 
            href="/admin/events/create" 
            className="bg-black text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 transition shadow-md"
        >
          <Plus size={18} /> Thêm khoảnh khắc
        </Link>
      </div>

      {/* Bảng danh sách */}
      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">Tiêu đề</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Thời gian</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Địa điểm</th>
              <th className="px-6 py-4 font-semibold text-right text-gray-700">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {(!events || events.length === 0) ? (
               <tr>
                 <td colSpan={4} className="text-center py-8 text-gray-400">Chưa có khoảnh khắc nào.</td>
               </tr>
            ) : (
                events.map((ev) => (
                <tr key={ev.id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">{ev.title}</td>
                    <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1">
                            <Calendar size={14}/> 
                            {new Date(ev.event_date).toLocaleString('vi-VN')}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                        <div className="flex items-center gap-1">
                            <MapPin size={14}/> {ev.location}
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                        <Link href={`/admin/events/${ev.id}/edit`} className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition" title="Sửa">
                            <Edit size={18} />
                        </Link>
                        {/* Nút xóa */}
                        <div className="p-2">
                             <DeleteEventButton eventId={ev.id} />
                        </div>
                    </div>
                    </td>
                </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}