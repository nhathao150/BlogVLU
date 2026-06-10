'use client'

import { useState } from 'react'
import Image from "next/image"
import { Calendar, MapPin, MoreHorizontal, MessageCircle, Share2, ThumbsUp, Send, Trash2, Edit } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useUser } from "@clerk/nextjs"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageGallery from '@/components/shared/ImageGallery' // Component album ảnh
import { toast } from "sonner" // Thư viện thông báo đẹp

// Định nghĩa kiểu dữ liệu (Types)
type EventProps = {
  event: any;
  currentUserLike?: boolean; // User hiện tại đã like chưa
  likesCount?: number;       // Tổng like ban đầu
  commentsCount?: number;    // Tổng comment ban đầu
}

export default function EventCard({ event, currentUserLike = false, likesCount = 0, commentsCount = 0 }: EventProps) {
  const { user } = useUser()
  const supabase = createClient()
  const router = useRouter()

  // --- STATE QUẢN LÝ DỮ LIỆU ---
  const [liked, setLiked] = useState(currentUserLike)
  const [countLike, setCountLike] = useState(likesCount)
  
  const [showCommentInput, setShowCommentInput] = useState(false)
  const [countComment, setCountComment] = useState(commentsCount)
  const [commentsList, setCommentsList] = useState<any[]>([])
  const [commentText, setCommentText] = useState("")
  
  const [showMenu, setShowMenu] = useState(false) // Menu 3 chấm của Admin

  // --- 1. XỬ LÝ LIKE ---
  const handleLike = async () => {
    if (!user) {
      toast.error("Chưa đăng nhập", { description: "Bạn cần đăng nhập để thả tim!" })
      return
    }

    // Optimistic UI: Cập nhật giao diện trước khi gọi server cho mượt
    const newStatus = !liked
    setLiked(newStatus)
    setCountLike(prev => newStatus ? prev + 1 : prev - 1)

    if (newStatus) {
      // Thêm Like vào DB
      await supabase.from('event_likes').insert({ user_id: user.id, event_id: event.id })
    } else {
      // Xóa Like khỏi DB
      await supabase.from('event_likes').delete().match({ user_id: user.id, event_id: event.id })
    }
  }

  // --- 2. XỬ LÝ COMMENT ---
  const loadComments = async () => {
    if (!showCommentInput) {
        // Lần đầu bấm mở thì mới load danh sách comment từ server
        const { data } = await supabase
            .from('event_comments')
            .select('*')
            .eq('event_id', event.id)
            .order('created_at', { ascending: true })
        if (data) setCommentsList(data)
    }
    setShowCommentInput(!showCommentInput)
  }

  const handleSendComment = async () => {
    if (!user) {
        toast.error("Chưa đăng nhập", { description: "Đăng nhập để bình luận nhé!" })
        return
    }
    if (!commentText.trim()) return

    const newComment = {
        user_id: user.id,
        event_id: event.id,
        content: commentText,
        user_name: user.fullName || user.firstName || "Người dùng ẩn danh",
        user_avatar: user.imageUrl
    }

    // Gửi lên server
    const { error } = await supabase.from('event_comments').insert(newComment)
    
    if (!error) {
        // Cập nhật giao diện ngay lập tức
        setCommentsList([...commentsList, { ...newComment, created_at: new Date().toISOString() }])
        setCountComment(prev => prev + 1)
        setCommentText("") // Xóa trắng ô nhập
        toast.success("Đã gửi bình luận")
    } else {
        toast.error("Lỗi gửi bình luận", { description: error.message })
    }
  }

  // --- 3. XỬ LÝ SHARE (Copy Link) ---
  const handleShare = () => {
    const link = `${window.location.origin}/events` // Hoặc link chi tiết nếu bạn có làm trang chi tiết
    navigator.clipboard.writeText(link)
    toast.success("Đã sao chép liên kết!", {
        description: "Hãy gửi cho bạn bè ngay nhé."
    })
  }

  // --- 4. XỬ LÝ DELETE (Admin) ---
  const handleDelete = async () => {
    if(confirm("Bạn có chắc chắn muốn xóa bài viết này không? Hành động này không thể hoàn tác.")) {
        const { error } = await supabase.from('events').delete().eq('id', event.id)
        if (!error) {
            toast.success("Đã xóa bài viết")
            router.refresh() // Refresh lại trang để mất bài viết cũ
        } else {
            toast.error("Lỗi xóa bài", { description: error.message })
        }
    }
  }

  return (
    <div className="bg-[#121212] md:rounded-xl shadow-lg border border-zinc-800/80 overflow-hidden mb-6 hover:shadow-[0_0_20px_rgba(245,158,11,0.15)] hover:border-amber-500/40 transition-all duration-300 relative group">
        
        {/* === HEADER: AVATAR + INFO === */}
        <div className="p-4 flex items-center justify-between border-b border-zinc-900">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-amber-600 to-amber-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    H
                </div>
                <div>
                    <h3 className="font-semibold text-white leading-snug hover:underline cursor-pointer flex items-center gap-1">
                        Nhật Hào <span className="text-amber-500 text-[10px]">✓</span>
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-zinc-400">
                        <span>{new Date(event.created_at).toLocaleDateString('vi-VN')}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin size={10} className="text-zinc-500" /> {event.location}</span>
                    </div>
                </div>
            </div>
            
            {/* Menu 3 chấm (Chỉ hiện nếu là Admin) */}
            {user?.publicMetadata?.role === 'admin' && (
                <div className="relative">
                    <button onClick={() => setShowMenu(!showMenu)} className="text-zinc-400 hover:bg-zinc-800 p-2 rounded-full transition">
                        <MoreHorizontal size={20}/>
                    </button>
                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-[#181818] shadow-2xl rounded-lg border border-zinc-800 py-1 z-10 animate-in fade-in zoom-in duration-200 origin-top-right">
                            <Link href={`/admin/events/${event.id}/edit`} className="flex items-center gap-2 px-4 py-2.5 hover:bg-zinc-800 text-sm text-zinc-200 w-full text-left font-medium">
                                <Edit size={16} className="text-amber-500"/> Chỉnh sửa
                            </Link>
                            <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2.5 hover:bg-red-950/20 hover:text-red-450 text-sm text-red-400 w-full text-left font-medium border-t border-zinc-800">
                                <Trash2 size={16}/> Xóa bài viết
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* === CONTENT: TEXT === */}
        <div className="px-4 pt-4 pb-3">
            <h2 className="text-lg font-bold text-white mb-1 tracking-wide">{event.title}</h2>
            <p className="text-zinc-300 whitespace-pre-line text-sm leading-relaxed mb-3">
                {event.description}
            </p>
            
            {/* Tag thời gian diễn ra */}
            {event.event_date && (
                <div className="inline-flex items-center gap-2 bg-amber-950/30 text-amber-400 px-3 py-1.5 rounded-full text-xs font-semibold border border-amber-900/30 shadow-inner">
                    <Calendar size={14}/> 
                    Diễn ra vào: <span className="text-amber-300">{new Date(event.event_date).toLocaleString('vi-VN', { hour: '2-digit', minute:'2-digit', day:'2-digit', month:'2-digit', year:'numeric' })}</span>
                </div>
            )}
        </div>

        {/* === MEDIA: ALBUM ẢNH === */}
        <div className="mt-1 border-y border-zinc-900">
            <ImageGallery 
                images={
                    event.images && event.images.length > 0 
                    ? event.images 
                    : (event.image_url ? [event.image_url] : [])
                } 
            />
        </div>

        {/* === STATS: LIKE/COMMENT COUNT === */}
        <div className="px-4 py-3 flex justify-between items-center text-zinc-400 text-sm border-b border-zinc-900 bg-zinc-900/10">
            <div className="flex items-center gap-1.5 min-h-[24px]">
                {countLike > 0 && (
                    <>
                        <div className="bg-amber-600 p-1 rounded-full text-white shadow-sm flex items-center justify-center w-5 h-5">
                            <ThumbsUp size={10} fill="white"/>
                        </div>
                        <span className="hover:underline cursor-pointer text-zinc-300 font-semibold">{countLike}</span>
                    </>
                )}
            </div>
            <div className="flex gap-4">
                <span className="hover:underline cursor-pointer">{countComment} bình luận</span>
            </div>
        </div>

        {/* === ACTION BUTTONS === */}
        <div className="px-2 py-1 flex items-center justify-between bg-zinc-900/5">
            <button 
                onClick={handleLike}
                className={`flex-1 flex items-center justify-center gap-2 py-2 my-1 mx-1 hover:bg-zinc-800/50 rounded-lg font-semibold transition text-sm ${liked ? 'text-amber-500' : 'text-zinc-400'}`}
            >
                <ThumbsUp size={18} fill={liked ? "currentColor" : "none"} className={liked ? "animate-bounce-short" : ""} /> 
                Thích
            </button>
            <button 
                onClick={loadComments}
                className="flex-1 flex items-center justify-center gap-2 py-2 my-1 mx-1 hover:bg-zinc-800/50 rounded-lg text-zinc-400 hover:text-white font-semibold transition text-sm"
            >
                <MessageCircle size={18} /> Bình luận
            </button>
            <button 
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-2 my-1 mx-1 hover:bg-zinc-800/50 rounded-lg text-zinc-400 hover:text-white font-semibold transition text-sm"
            >
                <Share2 size={18} /> Chia sẻ
            </button>
        </div>

        {/* === COMMENT SECTION (TOGGLE) === */}
        {showCommentInput && (
            <div className="px-4 py-3 bg-[#161616] border-t border-zinc-900 animate-in slide-in-from-top-2 duration-200">
                {/* Danh sách bình luận cũ */}
                {commentsList.length > 0 && (
                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-zinc-700">
                        {commentsList.map((cmt, index) => (
                            <div key={index} className="flex gap-2 group">
                                <Image 
                                    src={cmt.user_avatar || "/default-avatar.png"} 
                                    alt="avt" width={32} height={32} 
                                    className="rounded-full w-8 h-8 border border-zinc-850 object-cover flex-shrink-0"
                                />
                                <div className="bg-[#222222] border border-zinc-800 px-3 py-2 rounded-2xl rounded-tl-none max-w-[85%] text-zinc-150">
                                    <p className="text-xs font-bold text-white mb-0.5">{cmt.user_name}</p>
                                    <p className="text-sm text-zinc-300 break-words leading-snug">{cmt.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Ô nhập bình luận mới */}
                <div className="flex gap-2 items-center sticky bottom-0">
                    {user ? (
                        <Image 
                            src={user.imageUrl} 
                            alt="me" width={32} height={32} 
                            className="rounded-full w-8 h-8 border border-zinc-850 object-cover flex-shrink-0"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-zinc-800 flex-shrink-0" />
                    )}
                    
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                            placeholder="Viết bình luận công khai..." 
                            className="w-full bg-[#1e1e1e] border border-zinc-800 rounded-full py-2 pl-4 pr-10 focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-none text-sm transition text-white placeholder-zinc-500"
                        />
                        <button 
                            onClick={handleSendComment}
                            disabled={!commentText.trim()}
                            className="absolute right-1.5 top-1.5 text-amber-500 hover:bg-amber-950/40 p-1.5 rounded-full disabled:text-zinc-650 disabled:hover:bg-transparent transition"
                        >
                            <Send size={16} fill="currentColor"/>
                        </button>
                    </div>
                </div>
            </div>
        )}
    </div>
  )
}