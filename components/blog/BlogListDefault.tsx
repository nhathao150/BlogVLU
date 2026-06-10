import Link from "next/link";
import Image from "next/image";
import { Calendar, User } from "lucide-react";

export default function BlogListDefault({ posts }: { posts: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post) => (
        <Link
          href={`/blog/${post.slug}`}
          key={post.id}
          className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition duration-300 overflow-hidden border border-gray-100 flex flex-col h-full animate-in fade-in zoom-in-95 duration-300"
        >
          {/* Ảnh bìa */}
          <div className="relative h-56 w-full bg-gray-200 overflow-hidden">
            {post.image_url ? (
              <Image
                src={post.image_url}
                alt={post.title}
                fill
                className="object-cover group-hover:scale-105 transition duration-500"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400 font-medium bg-gray-100">
                Blog Default Image
              </div>
            )}
          </div>

          {/* Nội dung */}
          <div className="p-6 flex flex-col flex-grow">
            <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-amber-600 transition">
              {post.title}
            </h2>

            <div className="mt-auto pt-4 flex items-center justify-between text-gray-500 text-sm border-t border-gray-100">
              <div className="flex items-center gap-2">
                <User size={14} className="text-amber-500" />
                <span className="font-medium">Nhật Hào</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>
                  {new Date(post.created_at).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
