import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

// Định nghĩa các route cần bảo vệ (bắt đầu bằng /admin)
const isAdminRoute = createRouteMatcher(['/admin(.*)'])

export default clerkMiddleware(async (auth, req) => {
  // Nếu user truy cập vào route admin
  if (isAdminRoute(req)) {
    const { sessionClaims } = await auth()
    
    // Đọc metadata từ session (đã config ở Giai đoạn 1)
    const role = sessionClaims?.metadata?.role

    // Nếu không phải admin -> Đá về trang chủ
    if (role !== 'admin') {
      const homeUrl = new URL('/', req.url)
      return NextResponse.redirect(homeUrl)
    }
  }
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}