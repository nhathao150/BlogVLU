# 🎓 BlogVLU - Nền tảng Tin tức & Sự kiện Sinh viên

![Banner Dự Án](/public/logo.png) 
*(Bạn có thể thay bằng ảnh chụp màn hình trang chủ ở đây)*

**BlogVLU** là một nền tảng Full-stack hiện đại dành cho cộng đồng sinh viên, cho phép chia sẻ tin tức, quản lý sự kiện và tương tác thời gian thực. Dự án được xây dựng với **Next.js 14 (App Router)** và tối ưu hóa hiệu năng, SEO.

🔗 **Live Demo:** [Điền Link Vercel của bạn vào đây]

---

## 🚀 Tính năng nổi bật (Key Features)

### 1. Phân hệ Người dùng (User)
- **Authentication:** Đăng nhập/Đăng ký bảo mật với Clerk.
- **Real-time Interaction:** Thả tim (Like) và Bình luận (Comment) bài viết ngay lập tức mà không cần load lại trang (Optimistic UI).
- **Events Gallery:** Xem sự kiện, album ảnh dạng lưới, zoom ảnh chi tiết (Lightbox).
- **Smart Search:** Tìm kiếm bài viết và sự kiện theo từ khóa.
- **Responsive:** Giao diện tối ưu hoàn hảo cho cả Mobile và Desktop.

### 2. Phân hệ Quản trị (Admin Dashboard)
- **Tổng quan:** Xem thống kê số lượng bài viết, lượt xem, tương tác qua Biểu đồ trực quan.
- **Quản lý nội dung:** Soạn thảo bài viết với Rich Text Editor, upload ảnh bìa.
- **Quản lý sự kiện:** Tạo sự kiện mới, upload nhiều ảnh cùng lúc.
- **Bảo mật:** Phân quyền chặt chẽ, chỉ Admin mới truy cập được trang quản trị.

---

## 🛠️ Công nghệ sử dụng (Tech Stack)

- **Frontend:** Next.js 14, React, TypeScript, Tailwind CSS.
- **Backend & Database:** Supabase (PostgreSQL), Supabase Storage (Lưu trữ ảnh).
- **Auth:** Clerk (Authentication & User Management).
- **UI/UX Libraries:** Lucide React (Icons), Sonner (Toast Notifications), Recharts (Biểu đồ).
- **Deployment:** Vercel.

---

## 📸 Hình ảnh Demo

### 1. Trang chủ & Blog
*(Chèn link ảnh chụp màn hình Trang chủ vào đây)*

### 2. Admin Dashboard (Thống kê)
*(Chèn link ảnh chụp màn hình Dashboard vào đây)*

### 3. Tương tác & Bình luận
*(Chèn link ảnh chụp màn hình Comment vào đây)*

---

## ⚙️ Cài đặt và Chạy dự án (Installation)

1. **Clone dự án:**
\`\`\`bash
git clone https://github.com/nhathao150/BlogVLU
cd blog-vlu
\`\`\`

2. **Cài đặt thư viện:**
\`\`\`bash
npm install
\`\`\`

3. **Cấu hình biến môi trường:**
Tạo file `.env.local` và điền các key của bạn:
\`\`\`env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
\`\`\`

4. **Chạy Local:**
\`\`\`bash
npm run dev
\`\`\`
Truy cập `http://localhost:3000` để trải nghiệm.

---

## 📬 Liên hệ

Được phát triển bởi **[Tên Của Bạn]**.
- **Email:** email-cua-ban@gmail.com
- **GitHub:** [Link Github của bạn]

---
© 2026 BlogVLU. All rights reserved.