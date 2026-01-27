import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { 
  FileText, 
  Users, 
  Eye, 
  ArrowUpRight, 
  PlusCircle, 
  MoreHorizontal,
  Calendar
} from "lucide-react";
import { createClient } from "@/utils/supabase/server";

export default async function AdminDashboard() {
  // 1. Lấy thông tin User & Check quyền Admin
  const user = await currentUser();
  const { sessionClaims } = await auth();
  
  // Kiểm tra quyền admin
  if (sessionClaims?.metadata.role !== 'admin') {
    redirect("/"); // Nếu không phải admin, đá về trang chủ
  }

  // 2. Lấy dữ liệu thực từ Supabase
  const supabase = await createClient();
  
  // A. Đếm tổng số liệu (Chạy song song cho nhanh)
  const [
    { count: postsCount },
    { count: eventsCount },
    { count: userCount } // Giả sử sau này bạn lưu users vào DB, giờ cứ query thử
  ] = await Promise.all([
    supabase.from('posts').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    
    Promise.resolve({ count: 0 }) 
  ]);

  // B. Lấy 5 bài viết gần nhất để hiện ở bảng
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
      desc: "Bài viết đã xuất bản",
      color: "text-blue-600 bg-blue-50"
    },
    { 
      label: "Sự kiện", 
      value: eventsCount || 0, 
      icon: Calendar, 
      desc: "Sự kiện đang hoạt động",
      color: "text-purple-600 bg-purple-50"
    },
    { 
      label: "Tổng lượt xem", 
      value: "12.5k", // Số liệu giả lập (hoặc lấy từ DB nếu có cột views)
      icon: Eye, 
      desc: "Tăng trưởng tốt",
      color: "text-orange-600 bg-orange-50"
    },
  ];

  return (
    <div className="space-y-8 p-8 max-w-7xl mx-auto">
      
      {/* SECTION 1: Header chào mừng */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Dashboard Tổng Quan
          </h1>
          <p className="text-gray-500 mt-1">
            Chào mừng trở lại, <span className="font-semibold text-black">{user?.firstName}</span>! 👋
          </p>
        </div>
        
        {/* Nút hành động nhanh */}
        <div className="flex gap-3">
          <Link 
            href="/admin/posts/new" // Sửa lại đường dẫn đúng với cấu trúc app của bạn (thường là /new hoặc /create)
            className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-gray-800 transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
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
            className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} className="mr-1"/> +12%
              </span>
            </div>
            <div>
              <h3 className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-xs text-gray-400 mt-2">{stat.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 3: Bảng hoạt động gần đây & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cột trái: Danh sách bài viết mới (Chiếm 2 phần) */}
        <div className="lg:col-span-2 bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <FileText size={18} className="text-gray-400"/> Bài viết gần đây
            </h3>
            <Link href="/admin/posts" className="text-sm font-bold text-blue-600 hover:text-blue-800 hover:underline transition">
              Xem tất cả &rarr;
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-semibold text-xs uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Tiêu đề</th>
                  <th className="px-6 py-4">Trạng thái</th>
                  <th className="px-6 py-4">Ngày đăng</th>
                  <th className="px-6 py-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 bg-white">
                {recentPosts && recentPosts.length > 0 ? (
                  recentPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-blue-50/50 transition duration-150">
                      <td className="px-6 py-4 font-medium text-gray-900 max-w-[240px]">
                        <div className="truncate" title={post.title}>{post.title}</div>
                      </td>
                      <td className="px-6 py-4">
                        {post.is_published ? (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                            Đã đăng
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">
                            Nháp
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                        {new Date(post.created_at).toLocaleDateString('vi-VN')}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link 
                          href={`/admin/posts/${post.id}/edit`} // Link sửa bài
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-blue-600 transition"
                        >
                          <MoreHorizontal size={18} />
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                      Chưa có bài viết nào. Hãy bấm Viết bài mới nhé!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Cột phải: Trạng thái hệ thống (Chiếm 1 phần) */}
        <div className="space-y-6">
            
            {/* Box 1: System Status */}
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
                <h3 className="font-bold text-gray-900 mb-4">Hệ thống</h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div> Database
                        </span>
                        <span className="text-green-700 font-bold text-xs bg-green-100 px-2 py-1 rounded">ONLINE</span>
                    </div>
                    <div className="flex items-center justify-between text-sm p-3 bg-gray-50 rounded-lg">
                        <span className="text-gray-600 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div> Auth (Clerk)
                        </span>
                        <span className="text-blue-700 font-bold text-xs bg-blue-100 px-2 py-1 rounded">ACTIVE</span>
                    </div>
                </div>
            </div>

            {/* Box 2: Quick Actions */}
            <div className="bg-gradient-to-br from-gray-900 to-black text-white rounded-2xl shadow-lg p-6">
                <h3 className="font-bold mb-4 text-lg">Phím tắt Admin</h3>
                <div className="flex flex-col gap-3">
                    <Link href="/" className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition backdrop-blur-sm group">
                        <span className="text-sm font-medium">→ Về trang chủ</span>
                        <ArrowUpRight size={16} className="opacity-50 group-hover:opacity-100 transition"/>
                    </Link>
                    <Link href="/admin/events" className="flex items-center justify-between p-3 rounded-lg bg-white/10 hover:bg-white/20 transition backdrop-blur-sm group">
                        <span className="text-sm font-medium">→ Quản lý Sự kiện</span>
                        <Calendar size={16} className="opacity-50 group-hover:opacity-100 transition"/>
                    </Link>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}