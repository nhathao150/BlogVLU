'use client'

import { MessageCircle, Heart, Link as LinkIcon, Facebook, Twitter } from 'lucide-react'
import { toast } from "sonner"
import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useUser } from '@clerk/nextjs'

// Nhận postId từ trang cha để biết đang like bài nào
export default function BlogActions({ postId }: { postId: number }) {
  const { user } = useUser()
  const supabase = createClient()

  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  
  // State quản lý Like
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)

  // 1. Khởi tạo dữ liệu (URL, Title, Like Status)
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUrl(window.location.href)
    setTitle(document.title)

    const checkLikeStatus = async () => {
      // A. Đếm tổng số like của bài viết
      const { count } = await supabase
        .from('post_likes')
        .select('*', { count: 'exact', head: true })
        .eq('post_id', postId)
      
      setLikeCount(count || 0)

      // B. Kiểm tra user hiện tại đã like chưa
      if (user) {
        const { data } = await supabase
          .from('post_likes')
          .select('id')
          .eq('post_id', postId)
          .eq('user_id', user.id)
          .single()
        
        if (data) setLiked(true)
      }
    }

    checkLikeStatus()
  }, [postId, user]) // Chạy lại khi ID bài viết hoặc User thay đổi
  
  // 2. Xử lý Thả tim / Bỏ tim
  const handleLike = async () => {
    if (!user) {
      return toast.error("Bạn cần đăng nhập để thả tim!")
    }

    // Optimistic UI: Cập nhật giao diện ngay lập tức cho mượt
    const newStatus = !liked
    setLiked(newStatus)
    setLikeCount(prev => newStatus ? prev + 1 : prev - 1)

    if (newStatus) {
      // Thêm like vào DB
      await supabase.from('post_likes').insert({ post_id: postId, user_id: user.id })
    } else {
      // Xóa like khỏi DB
      await supabase.from('post_likes').delete().match({ post_id: postId, user_id: user.id })
    }
  }

  // 3. Lướt xuống ô comment
  const scrollToComments = () => {
    const section = document.getElementById('comments-section')
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  // 4. Các hàm Chia sẻ
  const shareFacebook = () => {
    if (!url) return
    const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(fbUrl, '_blank', 'width=600,height=400')
  }

  const shareTwitter = () => {
    if (!url) return
    const twUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`
    window.open(twUrl, '_blank', 'width=600,height=400')
  }

  const copyLink = () => {
    navigator.clipboard.writeText(url)
    toast.success("Đã sao chép liên kết!")
  }

  return (
    // Responsive: Desktop (Cột dọc bên trái) | Mobile (Thanh ngang dưới cùng)
    <div className="fixed z-40
      bottom-0 left-0 w-full h-16 bg-white/90 backdrop-blur-md border-t flex items-center justify-evenly px-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]
      md:top-1/2 md:left-8 md:bottom-auto md:w-auto md:h-auto md:bg-transparent md:border-none md:flex-col md:gap-4 md:-translate-y-1/2 md:shadow-none
    ">
       
       {/* --- NHÓM TƯƠNG TÁC --- */}
       
       {/* Nút Like (Đã hoạt động) */}
       <button 
          onClick={handleLike}
          aria-label={liked ? "Bỏ thích bài viết" : "Thích bài viết"}
          className={`group p-3 rounded-full bg-white border shadow-sm transition relative ${
            liked ? 'border-red-500 bg-red-50' : 'border-gray-200 hover:border-red-500 hover:shadow-md'
          }`}
          title={liked ? "Bỏ thích" : "Thích bài viết"}
       >
          <Heart 
            size={20} 
            className={`transition ${liked ? 'text-red-500 fill-red-500' : 'text-gray-500 group-hover:text-red-500'}`} 
          />
          {/* Badge số lượng Like */}
          {likeCount > 0 && (
             <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm min-w-[20px] text-center pointer-events-none">
               {likeCount}
             </span>
          )}
       </button>

       {/* Nút Comment */}
       <button 
          onClick={scrollToComments}
          aria-label={Comment ? "Bình luận bài viết" : "Xem bình luận bài viết"}
          className="group p-3 rounded-full bg-white border border-gray-200 shadow-sm hover:border-blue-500 hover:shadow-md transition relative"
          title="Bình luận"
       >
          <MessageCircle size={20} className="text-gray-500 group-hover:text-blue-600 transition" />
       </button>

       {/* --- ĐƯỜNG KẺ NGĂN CÁCH (Chỉ hiện trên Desktop) --- */}
       <div className="hidden md:block w-8 h-[1px] bg-gray-300 my-2"></div>

       {/* --- NHÓM SHARE (MẠNG XÃ HỘI) --- */}

       {/* Facebook */}
       <button 
          onClick={shareFacebook}
          aria-label="Chia sẻ lên Facebook"
          className="group p-3 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-[#1877F2] hover:border-[#1877F2] hover:shadow-md transition"
          title="Chia sẻ lên Facebook"
       >
          <Facebook size={20} className="text-gray-500 group-hover:text-white transition" />
       </button>

       {/* Twitter */}
       <button 
          onClick={shareTwitter}
          aria-label="Chia sẻ lên Twitter"
          className="group p-3 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-[#1DA1F2] hover:border-[#1DA1F2] hover:shadow-md transition"
          title="Chia sẻ lên Twitter"
       >
          <Twitter size={20} className="text-gray-500 group-hover:text-white transition" />
       </button>

       {/* Copy Link */}
       <button 
          onClick={copyLink}
          aria-label="Sao chép liên kết bài viết"
          className="group p-3 rounded-full bg-white border border-gray-200 shadow-sm hover:bg-gray-800 hover:border-gray-800 hover:shadow-md transition"
          title="Sao chép liên kết"
       >
          <LinkIcon size={20} className="text-gray-500 group-hover:text-white transition" />
       </button>

    </div>
  )
}