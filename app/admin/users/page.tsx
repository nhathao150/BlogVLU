import { clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import DeleteUserButton from "@/components/DeleteUserButton";
import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

export default async function UsersManager() {
  // 1. Kiểm tra bảo mật: Phải là Admin mới được vào (Logic tạm: phải đăng nhập)
  const user = await currentUser();
  if (!user) redirect("/");

  // 2. Lấy danh sách user từ Clerk
  const client = await clerkClient();
  const response = await client.users.getUserList({
    orderBy: '-created_at', // Người mới nhất lên đầu
    limit: 100,
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý thành viên ({response.totalCount})</h1>

      <div className="bg-white border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-4 font-semibold text-gray-700">Thành viên</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Email</th>
              <th className="px-6 py-4 font-semibold text-gray-700">Ngày tham gia</th>
              <th className="px-6 py-4 font-semibold text-right text-gray-700">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {response.data.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition">
                {/* Avatar + Tên */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Image 
                      src={u.imageUrl} 
                      alt={u.firstName || ""} 
                      width={32} height={32} 
                      className="rounded-full border"
                    />
                    <span className="font-medium text-gray-900">
                      {u.firstName} {u.lastName}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="px-6 py-4 text-gray-600">
                  {u.emailAddresses[0]?.emailAddress}
                </td>

                {/* Ngày tham gia */}
                <td className="px-6 py-4 text-gray-500">
                  {new Date(u.createdAt).toLocaleDateString('vi-VN')}
                </td>

                {/* Nút Xóa */}
                <td className="px-6 py-4 text-right">
                    {/* Không cho phép tự xóa chính mình */}
                    {u.id !== user.id && (
                        <DeleteUserButton userId={u.id} />
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}