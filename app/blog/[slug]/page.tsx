import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Calendar, User } from "lucide-react";
import type { Metadata } from "next";

// 1. Hàm tạo Metadata cho SEO (Tiêu đề tab trình duyệt + Ảnh share Facebook)
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: post } = await supabase.from('posts').select('*').eq('slug', slug).single();
  
  if (!post) return { title: "Không tìm thấy bài viết" };

  return {
    title: post.title,
    description: post.content.substring(0, 150), // Lấy 150 ký tự đầu làm mô tả
    openGraph: {
      images: post.image_url ? [post.image_url] : [],
    }
  };
}

// 2. Component chính hiển thị bài viết
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  // Await params (Bắt buộc ở Next.js 15)
  const { slug } = await params;
  const supabase = await createClient();

  // Lấy bài viết theo Slug
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true) // Chỉ lấy bài đã public
    .single();

  if (!post) {
    notFound(); // Chuyển sang trang 404 nếu không thấy
  }

  return (
    <article className="min-h-screen bg-white pb-20">
      {/* Header Ảnh bìa */}
      <div className="relative h-[40vh] w-full bg-gray-900">
        {post.image_url ? (
          <Image 
            src={post.image_url} 
            alt={post.title} 
            fill 
            className="object-cover opacity-80"
            priority // Load ưu tiên vì là ảnh lớn đầu trang
          />
        ) : (
          <div className="flex h-full items-center justify-center text-gray-500">
            Không có ảnh bìa
          </div>
        )}
        
        {/* Nút Back */}
        <div className="absolute top-6 left-6 z-10">
          <Link 
            href="/blog" 
            className="flex items-center gap-2 bg-white/90 backdrop-blur px-4 py-2 rounded-full text-sm font-medium text-gray-900 hover:bg-white transition"
          >
            <ArrowLeft size={16} /> Quay lại
          </Link>
        </div>

        {/* Tiêu đề đè lên ảnh */}
        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/80 to-transparent p-6 md:p-12">
          <div className="max-w-4xl mx-auto text-white">
             <div className="flex items-center gap-4 text-sm md:text-base text-gray-300 mb-3">
                <span className="flex items-center gap-1"><Calendar size={16}/> {new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                <span className="flex items-center gap-1"><User size={16}/> Admin Team</span>
             </div>
             <h1 className="text-3xl md:text-5xl font-bold leading-tight">{post.title}</h1>
          </div>
        </div>
      </div>

      {/* Nội dung bài viết */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* QUAN TRỌNG: Hiển thị HTML từ Tiptap editor 
            Class 'prose' đến từ thư viện @tailwindcss/typography giúp format đẹp tự động
        */}
        <div 
          className="prose prose-lg prose-gray max-w-none 
          prose-headings:font-bold prose-h1:text-3xl prose-a:text-blue-600 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.content }} 
        />
      </div>
    </article>
  );
}