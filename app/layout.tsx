import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from 'sonner';
import FooterWrapper from "@/components/FooterWrapper"; // ✅ Import Wrapper

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bloggy - My Tech Blog",
  description: "Created by Next.js 15",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="vi">
        <body className={inter.className}>
          
          {/* Cấu trúc Flexbox để Footer luôn dính đáy màn hình */}
          <div className="flex flex-col min-h-screen">
             
             {/* flex-grow: 1 giúp phần nội dung này "nở" ra, đẩy Footer xuống dưới cùng */}
             <main className="flex-grow">
                {children}
             </main>

             {/* ✅ FooterWrapper để nó tự ẩn khi vào trang Admin */}
             <FooterWrapper />
          </div>

          <Toaster position="bottom-right" richColors />
          
        </body>
      </html>
    </ClerkProvider>
  );
}