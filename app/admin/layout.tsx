import AdminSidebar from "@/components/admin/AdminSidebar";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check quyền Admin (giữ nguyên logic cũ của bạn)
  const user = await currentUser();
  // if (!user) redirect("/"); ...

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* CỘT TRÁI: SIDEBAR MỚI */}
      <AdminSidebar />

      {/* CỘT PHẢI: NỘI DUNG CHÍNH */}
      <main className="flex-1 overflow-y-auto h-screen">
        {/* Header nhỏ phía trên nội dung (tùy chọn) */}
        <header className="h-16 bg-white border-b flex items-center justify-between px-8 sticky top-0 z-10">
           <h2 className="font-semibold text-gray-700">Xin chào, {user?.firstName || "Sếp"}! 👋</h2>
           {/* Có thể để Avatar user ở đây */}
        </header>

        {/* Nội dung thay đổi (Dashboard, Posts, Users...) */}
        <div className="p-8">
            {children}
        </div>
      </main>
    </div>
  );
}