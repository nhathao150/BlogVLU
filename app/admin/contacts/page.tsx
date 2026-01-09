import { createClient } from "@/utils/supabase/server";
import { Mail, Clock, Trash2 } from "lucide-react";
import DeleteContactButton from "@/components/DeleteContactButton"; // Bạn tự tạo nút xóa tương tự bài post nhé

export default async function AdminContactsPage() {
  const supabase = await createClient();
  
  // Lấy tin nhắn, sắp xếp mới nhất lên đầu
  const { data: messages } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        Hộp thư góp ý <span className="text-sm font-normal text-gray-500 bg-gray-100 px-2 py-1 rounded-full">{messages?.length || 0}</span>
      </h1>

      <div className="grid grid-cols-1 gap-4">
        {messages?.map((msg) => (
          <div key={msg.id} className="bg-white p-6 rounded-xl border shadow-sm hover:shadow-md transition">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold">
                  {msg.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{msg.name}</h3>
                  <p className="text-sm text-blue-600">{msg.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 text-gray-400">
                <span className="text-xs flex items-center gap-1">
                  <Clock size={12}/> {new Date(msg.created_at).toLocaleString('vi-VN')}
                </span>
                {/* Bạn có thể thêm nút xóa ở đây */}
                <DeleteContactButton id={msg.id} />
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg text-gray-700 text-sm leading-relaxed">
              {msg.message}
            </div>
          </div>
        ))}

        {(!messages || messages.length === 0) && (
          <div className="text-center py-10 text-gray-400">Hộp thư trống rỗng 📭</div>
        )}
      </div>
    </div>
  );
}