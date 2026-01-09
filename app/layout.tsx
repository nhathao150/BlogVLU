import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs"; // <--- Import cái này

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Bloggy - My Tech Blog",
  description: "Created by Next.js 15",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Bọc ClerkProvider ở ngoài cùng
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>{children}</body>
      </html>
    </ClerkProvider>
  );
}