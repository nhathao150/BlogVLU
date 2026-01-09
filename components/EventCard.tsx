'use client'

import { useState } from 'react'
import Image from "next/image"
import { Calendar, MapPin, MoreHorizontal, MessageCircle, Share2, ThumbsUp, Send, Trash2, Edit } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useUser } from "@clerk/nextjs"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageGallery from './ImageGallery' // Component album ảnh
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
    <div className="bg-white md:rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6 hover:shadow-md transition-shadow">
        
        {/* === HEADER: AVATAR + INFO === */}
        <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                    B
                </div>
                <div>
                    <h3 className="font-semibold text-gray-900 leading-snug hover:underline cursor-pointer">
                        BlogVLU Official <span className="text-blue-500 text-[10px]">✓</span>
                    </h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                        <span>{new Date(event.created_at).toLocaleDateString('vi-VN')}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><MapPin size={10}/> {event.location}</span>
                    </div>
                </div>
            </div>
            
            {/* Menu 3 chấm (Chỉ hiện nếu là Admin) */}
            {user?.publicMetadata?.role === 'admin' && (
                <div className="relative">
                    <button onClick={() => setShowMenu(!showMenu)} className="text-gray-500 hover:bg-gray-100 p-2 rounded-full transition">
                        <MoreHorizontal size={20}/>
                    </button>
                    {/* Dropdown Menu */}
                    {showMenu && (
                        <div className="absolute right-0 mt-2 w-48 bg-white shadow-xl rounded-lg border py-1 z-10 animate-in fade-in zoom-in duration-200 origin-top-right">
                            <Link href={`/admin/events/${event.id}/edit`} className="flex items-center gap-2 px-4 py-2.5 hover:bg-gray-50 text-sm text-gray-700 w-full text-left font-medium">
                                <Edit size={16} className="text-blue-500"/> Chỉnh sửa
                            </Link>
                            <button onClick={handleDelete} className="flex items-center gap-2 px-4 py-2.5 hover:bg-red-50 text-sm text-red-600 w-full text-left font-medium border-t border-gray-50">
                                <Trash2 size={16}/> Xóa bài viết
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>

        {/* === CONTENT: TEXT === */}
        <div className="px-4 pb-3">
            <h2 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h2>
            <p className="text-gray-800 whitespace-pre-line text-sm leading-relaxed mb-3">
                {event.description}
            </p>
            
            {/* Tag thời gian diễn ra */}
            {event.event_date && (
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-xs font-semibold border border-blue-100">
                    <Calendar size={14}/> 
                    Diễn ra vào: <span className="text-blue-800">{new Date(event.event_date).toLocaleString('vi-VN', { hour: '2-digit', minute:'2-digit', day:'2-digit', month:'2-digit', year:'numeric' })}</span>
                </div>
            )}
        </div>

        {/* === MEDIA: ALBUM ẢNH === */}
        <div className="mt-1">
            <ImageGallery 
                images={
                    event.images && event.images.length > 0 
                    ? event.images 
                    : (event.image_url ? [event.image_url] : [])
                } 
            />
        </div>

        {/* === STATS: LIKE/COMMENT COUNT === */}
        <div className="px-4 py-3 flex justify-between items-center text-gray-500 text-sm border-b border-gray-100">
            <div className="flex items-center gap-1.5 min-h-[24px]">
                {countLike > 0 && (
                    <>
                        <div className="bg-blue-500 p-1 rounded-full text-white shadow-sm flex items-center justify-center w-5 h-5">
                            <ThumbsUp size={10} fill="white"/>
                        </div>
                        <span className="hover:underline cursor-pointer">{countLike}</span>
                    </>
                )}
            </div>
            <div className="flex gap-4">
                <span className="hover:underline cursor-pointer">{countComment} bình luận</span>
            </div>
        </div>

        {/* === ACTION BUTTONS === */}
        <div className="px-2 py-1 flex items-center justify-between">
            <button 
                onClick={handleLike}
                className={`flex-1 flex items-center justify-center gap-2 py-2 my-1 mx-1 hover:bg-gray-100 rounded-lg font-medium transition text-sm ${liked ? 'text-blue-600' : 'text-gray-600'}`}
            >
                <ThumbsUp size={18} fill={liked ? "currentColor" : "none"} className={liked ? "animate-bounce-short" : ""} /> 
                Thích
            </button>
            <button 
                onClick={loadComments}
                className="flex-1 flex items-center justify-center gap-2 py-2 my-1 mx-1 hover:bg-gray-100 rounded-lg text-gray-600 font-medium transition text-sm"
            >
                <MessageCircle size={18} /> Bình luận
            </button>
            <button 
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 py-2 my-1 mx-1 hover:bg-gray-100 rounded-lg text-gray-600 font-medium transition text-sm"
            >
                <Share2 size={18} /> Chia sẻ
            </button>
        </div>

        {/* === COMMENT SECTION (TOGGLE) === */}
        {showCommentInput && (
            <div className="px-4 py-3 bg-gray-50/50 border-t border-gray-100 animate-in slide-in-from-top-2 duration-200">
                {/* Danh sách bình luận cũ */}
                {commentsList.length > 0 && (
                    <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300">
                        {commentsList.map((cmt, index) => (
                            <div key={index} className="flex gap-2 group">
                                <Image 
                                    src={cmt.user_avatar || "/default-avatar.png"} 
                                    alt="avt" width={32} height={32} 
                                    className="rounded-full w-8 h-8 border border-gray-200 object-cover flex-shrink-0"
                                />
                                <div className="bg-gray-200/80 px-3 py-2 rounded-2xl rounded-tl-none max-w-[85%]">
                                    <p className="text-xs font-bold text-gray-900 mb-0.5">{cmt.user_name}</p>
                                    <p className="text-sm text-gray-800 break-words leading-snug">{cmt.content}</p>
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
                            className="rounded-full w-8 h-8 border border-gray-200 object-cover flex-shrink-0"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0" />
                    )}
                    
                    <div className="flex-1 relative">
                        <input 
                            type="text" 
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                            placeholder="Viết bình luận công khai..." 
                            className="w-full bg-white border border-gray-300 rounded-full py-2 pl-4 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm transition shadow-sm"
                        />
                        <button 
                            onClick={handleSendComment}
                            disabled={!commentText.trim()}
                            className="absolute right-1.5 top-1.5 text-blue-600 hover:bg-blue-50 p-1.5 rounded-full disabled:text-gray-400 disabled:hover:bg-transparent transition"
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