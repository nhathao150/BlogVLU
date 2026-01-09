import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs"; // <--- Import cái này
import { Toaster } from 'sonner';
import Footer from "@/components/Footer";


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
          
          {/* Nội dung chính của web */}
          <div className="flex flex-col min-h-screen">
             {children}
          </div>

          <Toaster position="bottom-right" richColors />
          
          {/* 2. Đặt Footer ở cuối cùng */}
          <Footer />
          
        </body>
      </html>
    </ClerkProvider>
  );
}