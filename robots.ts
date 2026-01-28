import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',      // Áp dụng cho mọi loại Bot (Google, Bing...)
      allow: '/',          // Cho phép vào tất cả các trang
      disallow: '/admin/', // ⛔️ CẤM bot vào trang Admin (quan trọng)
    },
    sitemap: 'https://blog-vlu.vercel.app', 
  };
}