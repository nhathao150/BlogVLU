import { prisma } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  // 1. Lấy thông tin user đang đăng nhập từ Clerk
  const user = await currentUser();

  // Nếu chưa đăng nhập -> Đuổi về trang chủ
  if (!user) redirect("/");

  // 2. ĐỒNG BỘ USER: Lưu user này vào database Supabase của mình nếu chưa có
  // (Bước này quan trọng để tránh lỗi khóa ngoại - Foreign Key)
  const dbUser = await prisma.user.upsert({
    where: { email: user.emailAddresses[0].emailAddress },
    update: {
      name: `${user.firstName} ${user.lastName}`,
      image: user.imageUrl,
    },
    create: {
      id: user.id, // Dùng luôn ID của Clerk làm ID trong DB
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      image: user.imageUrl,
    },
  });

  // 3. SERVER ACTION: Hàm xử lý khi bấm nút "Đăng bài"
  async function createPost(formData: FormData) {
    "use server"; // <--- Đây là backend code chạy trên server
    
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;

    // Tạo slug từ tiêu đề (ví dụ: "Chào Mọi Người" -> "chao-moi-nguoi")
    const slug = title
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[đĐ]/g, "d")
      .replace(/\s+/g, "-") + "-" + Date.now(); // Thêm ngày giờ để tránh trùng

    await prisma.post.create({
      data: {
        title: title,
        slug: slug,
        content: content,
        authorId: user!.id, // Liên kết với ID của tác giả
        published: true,
      },
    });

    // Lưu xong thì quay về trang chủ xem kết quả
    redirect("/");
  }

  // 4. GIAO DIỆN (Frontend)
  return (
    <div className="max-w-2xl mx-auto p-10">
      <h1 className="text-3xl font-bold mb-6">Trang viết bài ✍️</h1>
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <form action={createPost} className="flex flex-col gap-4">
          
          <div>
            <label className="font-semibold block mb-2">Tiêu đề</label>
            <input 
              name="title" 
              placeholder="Hôm nay bạn thế nào..." 
              className="w-full border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
              required 
            />
          </div>

          <div>
            <label className="font-semibold block mb-2">Nội dung</label>
            <textarea 
              name="content" 
              placeholder="Viết gì đó đi..." 
              className="w-full border p-3 rounded-lg h-40 focus:outline-none focus:ring-2 focus:ring-black"
              required 
            />
          </div>

          <button 
            type="submit" 
            className="bg-black text-white py-3 rounded-lg font-bold hover:bg-gray-800 transition"
          >
            Đăng bài viết 🚀
          </button>

        </form>
      </div>
    </div>
  );
}