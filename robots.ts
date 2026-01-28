import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',      // Áp dụng cho mọi loại Bot (Google, Bing...)
      allow: '/',          // Cho phép vào tất cả các trang
      disallow: '/admin/', // ⛔️ CẤM bot vào trang Admin (quan trọng)
    },
    // Thay dòng dưới bằng link web thật của bạn
    sitemap: 'https://blog-vlu.vercel.app', 
  };
}