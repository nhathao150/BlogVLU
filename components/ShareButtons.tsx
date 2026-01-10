'use client';

import { Facebook, Twitter, Link2, MessageCircle } from "lucide-react";
import { toast } from "sonner";
// Đã xóa useState và useEffect vì không cần thiết nữa

export default function ShareButtons({ title }: { title: string }) {
  


  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href; // Lấy trực tiếp tại đây
      navigator.clipboard.writeText(url);
      toast.success("Đã sao chép liên kết!");
    }
  };

  const handleShareFacebook = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    }
  };

  const handleShareTwitter = () => {
    if (typeof window !== 'undefined') {
      const url = window.location.href;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    }
  };

  // Hàm lướt xuống comment
  const scrollToComments = () => {
    const section = document.getElementById('comments-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-row lg:flex-col gap-4 items-center sticky top-24">
      {/* Facebook */}
      <button 
        onClick={handleShareFacebook}
        className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition shadow-sm"
        title="Chia sẻ lên Facebook"
      >
        <Facebook size={20} />
      </button>

      {/* Twitter */}
      <button 
        onClick={handleShareTwitter}
        className="w-10 h-10 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition shadow-sm"
        title="Chia sẻ lên Twitter"
      >
        <Twitter size={20} />
      </button>

      {/* Copy Link */}
      <button 
        onClick={handleCopyLink}
        className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-800 hover:text-white transition shadow-sm"
        title="Sao chép liên kết"
      >
        <Link2 size={20} />
      </button>
      
      {/* Nút Bình luận */}
      <button 
        onClick={scrollToComments}
        className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center hover:bg-green-600 hover:text-white transition shadow-sm"
        title="Xem bình luận"
      >
        <MessageCircle size={20} />
      </button>
    </div>
  );
}