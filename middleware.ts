import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// 1. Định nghĩa các trang CÔNG KHAI (Ai cũng vào được)
const isPublicRoute = createRouteMatcher([
  '/',                // Trang chủ
  '/blog(.*)',        // Các bài viết blog
  '/events(.*)',      // Các trang sự kiện
  '/about',           // Trang giới thiệu
  '/contact',         // Trang liên hệ
  '/search(.*)',      // Trang tìm kiếm
  '/sign-in(.*)',     // Trang đăng nhập
  '/sign-up(.*)'      // Trang đăng ký
]);

export default clerkMiddleware(async(auth, req) => {
  // 2. Nếu KHÔNG phải trang công khai thì mới bắt đăng nhập (Protect)
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Chạy middleware trên tất cả các route, trừ file tĩnh (_next/static, file ảnh...)
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Luôn chạy cho API route
    '/(api|trpc)(.*)',
  ],
};