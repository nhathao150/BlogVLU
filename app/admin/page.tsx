import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  FileText, 
  Users, 
  Eye, 
  ArrowUpRight, 
  PlusCircle, 
  MoreHorizontal 
} from "lucide-react";
import { createClient } from "@/utils/supabase/server"; // Đảm bảo bạn đã có file này

export default async function AdminDashboard() {
  // 1. Lấy thông tin User & Check quyền Admin
  const user = await currentUser();
  const { sessionClaims } = await auth();
  
  // @ts-ignore
  if (sessionClaims?.metadata.role !== 'admin') {
    redirect("/");
  }

  // 2. Lấy dữ liệu thực từ Supabase
  const supabase = await createClient();
  
  // Đếm tổng bài viết
  const { count: postsCount } = await supabase
    .from('posts')
    .select('*', { count: 'exact', head: true });

  // Lấy 5 bài viết gần nhất để hiện ở bảng "Vừa cập nhật"
  const { data: recentPosts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(5);

  // 3. Cấu hình số liệu thống kê (Stats)
  const stats = [
    { 
      label: "Tổng bài viết", 
      value: postsCount || 0, 
      icon: FileText, 
      desc: "Bài viết trong database" 
    },
    { 
      label: "Thành viên", 
      value: "120+", 
      icon: Users, 
      desc: "User đã đăng ký (Demo)" // Sau này sẽ fetch từ Clerk/Table Users
    },
    { 
      label: "Tổng lượt xem", 
      value: "45.2k", 
      icon: Eye, 
      desc: "Tăng 12% so với tháng trước" 
    },
  ];

  return (
    <div className="space-y-8">
      {/* SECTION 1: Header chào mừng */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Xin chào {user?.firstName}, đây là tổng quan blog của bạn hôm nay.
          </p>
        </div>
        
        {/* Nút hành động nhanh */}
        <div className="flex gap-3">
          <Link 
            href="/admin/posts/create" 
            className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition shadow-sm"
          >
            <PlusCircle size={18} />
            Viết bài mới
          </Link>
        </div>
      </div>

      {/* SECTION 2: Các thẻ thống kê (Stats Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <h3 className="text-3xl font-bold mt-2 text-gray-900">{stat.value}</h3>
              </div>
              <div className="p-3 bg-gray-50 rounded-full text-gray-600">
                <stat.icon size={24} />
              </div>
            </div>
            <div className="mt-4 flex items-center text-xs text-gray-500">
              <span className="text-green-600 font-medium flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md mr-2">
                <ArrowUpRight size={12} /> Live
              </span>
              {stat.desc}
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 3: Bảng hoạt động gần đây & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cột trái: Danh sách bài viết mới (Chiếm 2 phần) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Bài viết gần đây</h3>
            <Link href="/admin/posts" className="text-sm text-blue-600 hover:underline">
              Xem tất cả
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-3">Tiêu đề bài viết</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Ngày tạo</th>
                  <th className="px-6 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentPosts && recentPosts.length > 0 ? (
                  recentPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-[200px]">
                        {post.title}
                      </td>
                      <td className="px-6 py-4">
                        {post.is_published ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Published
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Draft
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(post.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-gray-400 hover:text-black">
                          <MoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                      Chưa có bài viết nào. Hãy tạo bài đầu tiên!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cột phải: Thông báo hệ thống hoặc Shortcut (Chiếm 1 phần) */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 h-fit">
          <h3 className="font-semibold text-gray-900 mb-4">Trạng thái hệ thống</h3>
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-600">Database (Supabase): <span className="text-green-600 font-medium">Connected</span></span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span className="text-gray-600">Auth (Clerk): <span className="text-green-600 font-medium">Active</span></span>
            </div>
            <div className="pt-4 border-t mt-4">
              <p className="text-xs text-gray-400 mb-2">QUICK LINKS</p>
              <div className="flex flex-col gap-2">
                <Link href="/" className="text-sm font-medium hover:text-blue-600 transition">
                  → Về trang chủ
                </Link>
                <Link href="/admin/settings" className="text-sm font-medium hover:text-blue-600 transition">
                  → Cài đặt SEO
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}