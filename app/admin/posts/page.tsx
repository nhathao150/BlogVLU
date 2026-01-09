import Link from "next/link";
import { Plus, Edit, Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/server"; // Kết nối Database thật
import DeletePostButton from "@/components/DeletePostButton";
export default async function PostsManager() {
  // 1. Kết nối và lấy dữ liệu thật từ Supabase
  const supabase = await createClient();
  
  const { data: posts, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false }); // Bài mới nhất lên đầu

  if (error) {
    return <div>Lỗi tải dữ liệu: {error.message}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Quản lý bài viết</h1>
          <p className="text-gray-500 text-sm mt-1">Tổng số bài: {posts?.length || 0}</p>
        </div>
        <Link 
          href="/admin/posts/create" 
          className="bg-black text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-gray-800 transition"
        >
          <Plus size={16} /> Tạo bài mới
        </Link>
      </div>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">Tiêu đề</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Trạng thái</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Ngày tạo</th>
              <th className="px-6 py-4 font-semibold text-right text-gray-700">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {posts?.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  Chưa có bài viết nào. Hãy bấm nút "Tạo bài mới" để bắt đầu!
                </td>
              </tr>
            ) : (
              posts?.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition">
                  {/* Tiêu đề + Slug */}
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">{post.title}</div>
                    <div className="text-xs text-gray-400 mt-0.5">/{post.slug}</div>
                  </td>

                  {/* Trạng thái Publish/Draft */}
                  <td className="px-6 py-4">
                    {post.is_published ? (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                        Published
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
                        Draft
                      </span>
                    )}
                  </td>

                  {/* Ngày tháng (Format lại cho dễ đọc) */}
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(post.created_at).toLocaleDateString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric'
                    })}
                  </td>

                  {/* Nút Sửa / Xóa */}
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                      {/* Nút Sửa: Dùng Link chuyển hướng */}
                      <Link href={`/admin/posts/${post.id}/edit`} className="text-gray-400 hover:text-blue-600 transition">
                        <Edit size={18} />
                      </Link>
                      
                      {/* Nút Xóa: Dùng Component riêng */}
                      <DeletePostButton postId={post.id} />
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