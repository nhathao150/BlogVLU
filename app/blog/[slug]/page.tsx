import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { clerkClient } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";
import { Calendar, Clock } from "lucide-react";
import type { Metadata } from "next";

// Import các Components
import Navbar from "@/components/layout/Navbar";
import CommentSection from "@/components/blog/CommentSection"; 
import BlogActions from "@/components/blog/BlogActions"; 

// 1. Cấu hình SEO Metadata
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  
  const { data: post } = await supabase.from('posts').select('*').eq('slug', slug).single();
  
  if (!post) return { title: "Không tìm thấy bài viết" };

  return {
    title: post.title,
    description: post.content ? post.content.substring(0, 150).replace(/<[^>]*>?/gm, '') : "Bài viết từ BlogVLU",
    openGraph: {
      images: post.image_url ? [post.image_url] : [],
      type: 'article',
      title: post.title,
    }
  };
}

export const revalidate = 0; 

// 2. Component Chính
export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  // A. Lấy bài viết chính
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('is_published', true)
    .single();

  if (!post) {
    notFound();
  }

  // B. Lấy danh sách "Tin xem nhiều"
  const { data: relatedPosts } = await supabase
    .from('posts')
    .select('id, title, slug, created_at, image_url')
    .eq('is_published', true)
    .neq('id', post.id)
    .limit(5)
    .order('created_at', { ascending: false });

  // C. Lấy thông tin tác giả từ Clerk
  let author = null;
  // Kiểm tra các trường có thể chứa ID tác giả (do Supabase/Prisma có thể trả về các key khác nhau)
  const authorId = post.author_id || post.authorId || post.user_id; 
  
  if (authorId) {
    try {
      const client = await clerkClient();
      author = await client.users.getUser(authorId);
    } catch (error) {
      console.warn("Không tìm thấy thông tin tác giả trên Clerk:", authorId, error);
    }
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <Navbar />
      
      {/* THANH CÔNG CỤ TƯƠNG TÁC (Nổi bên trái) */}
      {/* QUAN TRỌNG: Truyền postId vào để chức năng Like hoạt động */}
      <BlogActions postId={post.id} />

      <main className="container mx-auto px-4 py-8">
        
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500 mb-6 flex items-center gap-2 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-black transition">Trang chủ</Link> 
            <span>/</span> 
            <Link href="/blog" className="hover:text-black transition">Bài viết</Link> 
            <span>/</span> 
            <span className="text-black font-medium">{post.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            
            {/* CỘT TRÁI (Trống) */}
            <div className="hidden lg:block lg:col-span-1"></div>

            {/* CỘT GIỮA: NỘI DUNG CHÍNH */}
            <div className="lg:col-span-8">
                {/* Header bài viết */}
                <div className="mb-8">
                    <div className="flex gap-2 mb-4">
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                            Tin Tức
                        </span>
                    </div>

                    <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                        {post.title}
                    </h1>
                    
                    {/* Info tác giả */}
                    <div className="flex flex-wrap items-center gap-6 mt-6 text-gray-500 text-sm border-b border-gray-100 pb-6">
                        <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm border border-gray-200">
                                {author ? (
                                    <Image 
                                        src={author.imageUrl} 
                                        alt={author.firstName || "Author"} 
                                        fill 
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-linear-to-tr from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
                                        A
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="font-bold text-gray-900">
                                    {author ? `${author.firstName} ${author.lastName || ''}` : 'Admin Team'}
                                </p>
                                <p className="text-xs">Tác giả</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar size={16}/>
                            <span>{new Date(post.created_at).toLocaleDateString('vi-VN')}</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <Clock size={16}/>
                            <span>{new Date(post.created_at).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}</span>
                        </div>
                    </div>
                </div>

                {/* Ảnh bìa */}
                {post.image_url && (
                    <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 shadow-lg">
                        <Image 
                            src={post.image_url} 
                            alt={post.title} 
                            fill 
                            className="object-cover hover:scale-105 transition duration-700" 
                            priority 
                        />
                    </div>
                )}

                {/* NỘI DUNG BÀI VIẾT */}
                <article 
                  className="prose prose-lg prose-slate max-w-none 
                  prose-headings:font-bold prose-headings:text-gray-900
                  prose-p:text-gray-700 prose-p:leading-relaxed
                  prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                  prose-img:rounded-xl prose-img:shadow-md prose-img:my-8
                  prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg"
                  dangerouslySetInnerHTML={{ __html: post.content }} 
                />

                {/* Tags */}
                <div className="mt-12 pt-6 border-t flex flex-wrap gap-2">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer transition">#VLU</span>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer transition">#SinhVien</span>
                    <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-200 cursor-pointer transition">#News</span>
                </div>

                {/* KHU VỰC BÌNH LUẬN */}
                <CommentSection postId={post.id} />
            </div>

            {/* CỘT PHẢI: SIDEBAR */}
            <div className="lg:col-span-3 space-y-8">
                
                {/* Widget: Tin xem nhiều */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
                    <h3 className="font-bold text-lg mb-4 text-gray-900 border-b pb-2 flex items-center gap-2">
                        Tin xem nhiều 🔥
                    </h3>
                    
                    <div className="flex flex-col gap-5">
                        {relatedPosts?.map((item) => (
                            <Link key={item.id} href={`/blog/${item.slug}`} className="group flex gap-3 items-start">
                                {/* Ảnh thumb nhỏ */}
                                <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-200">
                                    {item.image_url ? (
                                        <Image src={item.image_url} alt={item.title} fill className="object-cover group-hover:scale-110 transition duration-300"/>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">VLU</div>
                                    )}
                                </div>
                                
                                <div>
                                    <h4 className="font-medium text-gray-800 text-sm line-clamp-2 group-hover:text-blue-600 transition mb-1 leading-snug">
                                        {item.title}
                                    </h4>
                                    <span className="text-xs text-gray-400">{new Date(item.created_at).toLocaleDateString('vi-VN')}</span>
                                </div>
                            </Link>
                        ))}
                         
                        {(!relatedPosts || relatedPosts.length === 0) && (
                            <p className="text-sm text-gray-400 italic">Chưa có bài viết liên quan.</p>
                        )}
                    </div>
                </div>

            </div>

        </div>
      </main>
    </div>
  );
}