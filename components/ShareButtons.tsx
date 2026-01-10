'use client';

import { Facebook, Twitter, Link2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";

export default function ShareButtons({ title }: { title: string }) {
  const [url, setUrl] = useState("");

  // Lấy URL hiện tại khi component vừa load xong
  

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast.success("Đã sao chép liên kết!");
  };

  const handleShareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const handleShareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="flex flex-row lg:flex-col gap-4 items-center sticky top-24">
      <button 
        onClick={handleShareFacebook}
        className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition"
        title="Chia sẻ lên Facebook"
      >
        <Facebook size={20} />
      </button>

      <button 
        onClick={handleShareTwitter}
        className="w-10 h-10 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition"
        title="Chia sẻ lên Twitter"
      >
        <Twitter size={20} />
      </button>

      <button 
        onClick={handleCopyLink}
        className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-800 hover:text-white transition"
        title="Sao chép liên kết"
      >
        <Link2 size={20} />
      </button>
      
      {/* Nút bình luận - cuộn xuống dưới */}
      <a 
        href="#comments"
        className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition"
      >
        <MessageCircle size={20} />
      </a>
    </div>
  );
}