# 🎓 BlogVLU - Nền tảng Tin tức & Sự kiện Sinh viên

![Banner Dự Án](/public/logo.png) 


**BlogVLU** là một nền tảng Full-stack hiện đại dành cho cộng đồng sinh viên, cho phép chia sẻ tin tức, quản lý sự kiện và tương tác thời gian thực. Dự án được xây dựng với **Next.js 16 (App Router)** và tối ưu hóa hiệu năng, SEO.

🔗 **Live Demo:** (https://blog-vlu.vercel.app)

---

## �️ Công nghệ sử dụng (Tech Stack)

Dự án sử dụng bộ công nghệ "Modern Stack" mới nhất (2025-2026):

### Frontend (Giao diện)
- **Next.js 16 (App Router)**: Framework React mới nhất, hỗ trợ Server Components (RSC).
- **React 19**: Phiên bản React mới với các cải tiến về compiler.
- **TypeScript**: Ngôn ngữ chính, đảm bảo an toàn kiểu dữ liệu (Type Safety).
- **Tailwind CSS v4**: Framework CSS utility-first mới nhất.
- **Lucide React**: Bộ icon nhẹ và đẹp.
- **Sonner**: Thư viện hiển thị thông báo (Toast notifications) mượt mà.
- **Recharts**: Thư viện vẽ biểu đồ cho trang Admin.
- **Tiptap**: Bộ soạn thảo văn bản phong phú (Rich Text Editor).

### Backend & Database (Dữ liệu)
- **Supabase**: Nền tảng "Firebase alternative" chạy trên PostgreSQL.
- **Prisma ORM**: Định nghĩa Schema và truy vấn dữ liệu.

### Authentication (Bảo mật)
- **Clerk**: Quản lý người dùng, đăng nhập, bảo mật route.

---

## 🚀 Tính năng nổi bật (Key Features)

### 🏠 Phân hệ Người dùng (User Web)
1.  **Trang chủ (Home)**: Banner giới thiệu, Sứ mệnh (`MissionSection`) và điều hướng.
2.  **Blog (Tin tức)**:
    -   Xem bài viết với hiệu suất cao (Caching/ISR).
    -   Tương tác: Bình luận (`CommentSection`) thời gian thực.
3.  **Sự kiện (Events)**: Danh sách sự kiện, đăng ký tham gia.
4.  **Tìm kiếm (Search)**: Tìm kiếm bài viết/sự kiện toàn trang.

### 🛡️ Phân hệ Quản trị (Admin Dashboard)
-   **Dashboard Overview**: Biểu đồ thống kê lượt truy cập/bài viết.
-   **Quản lý nội dung**:
    -   Soạn thảo bài viết với Tiptap Editor (`PostForm`).
    -   Upload hình ảnh với Supabase Storage.
-   **Bảo mật**: Phân quyền chặt chẽ, bảo vệ route admin.

---

## � Cấu Trúc Dự Án (File Structure)

```bash
/app          # App Router (Chứa các trang & API routes)
  /blog       # Trang danh sách & chi tiết bài viết
  /admin      # Trang quản trị viên (Protected)
  /events     # Trang sự kiện
  page.tsx    # Trang chủ
  layout.tsx  # Layout chung (Navbar, Footer, Auth Provider)

/components   # Các UI Component tái sử dụng
  Navbar.tsx        # Thanh điều hướng
  CommentSection.tsx# Khu vực bình luận (Logic phức tạp)
  PostForm.tsx      # Form tạo bài viết (Admin)
  AdminChart.tsx    # Biểu đồ thống kê

/prisma       # Cấu hình Database
  schema.prisma     # Định nghĩa cấu trúc bảng

/utils        # Các hàm tiện ích
/types        # Định nghĩa kiểu dữ liệu (TypeScript Interfaces)
```

---

## 📸 Hình ảnh Demo

### 1. Trang chủ & Blog
![alt text](image.png)

### 2. Admin Dashboard (Thống kê)
![alt text](image-1.png)

### 3. Tương tác & Bình luận
![alt text](image-2.png)

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
NEXT_PUBLIC_SUPABASE_URL=https://kknheibcineqbugwkrae.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtrbmhlaWJjaW5lcWJ1Z3drcmFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc3OTY1NDUsImV4cCI6MjA4MzM3MjU0NX0.kyiubrvOUPRYcLQafYW94GPp5FFZbXjJ0Cqsrs_Z1lQ

NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_c21pbGluZy1idXJyby0yMC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_ldcbZSyMWUFhW7r4VDLJLoq3Q1WHmsYDlDnX9jzg9E
\`\`\`

4. **Chạy Local:**
\`\`\`bash
npm run dev
\`\`\`
Truy cập `http://localhost:3000` để trải nghiệm.

---

## 📬 Liên hệ

Được phát triển bởi **[ Hào ]**.
- **Email:**   [ thanhkiem123498@gmail.com ]
- **GitHub:**  [ https://github.com/nhathao150 ]

---
© 2026 BlogVLU. All rights reserved.