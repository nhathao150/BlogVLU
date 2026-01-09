'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import { Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export default function CommentSection({ postId }: { postId: number }) {
  const { user } = useUser()
  const supabase = createClient()
  
  const [comments, setComments] = useState<any[]>([])
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)

  // 1. Load comment khi vào trang
  useEffect(() => {
    const fetchComments = async () => {
      const { data } = await supabase
        .from('post_comments')
        .select('*')
        .eq('post_id', postId)
        .order('created_at', { ascending: false }) // Mới nhất lên đầu
      
      if (data) setComments(data)
    }
    fetchComments()
  }, [postId])

  // 2. Gửi comment
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return toast.error("Vui lòng đăng nhập để bình luận!")
    if (!content.trim()) return

    setLoading(true)
    const newComment = {
      post_id: postId,
      user_id: user.id,
      user_name: user.fullName || user.firstName || "Người dùng",
      user_avatar: user.imageUrl,
      content: content
    }

    const { error } = await supabase.from('post_comments').insert(newComment)
    
    if (!error) {
      setComments([newComment, ...comments]) // Hiện ngay lập tức (Optimistic update)
      setContent("")
      toast.success("Đã đăng bình luận!")
    } else {
      toast.error("Lỗi: " + error.message)
    }
    setLoading(false)
  }

  return (
    <div id="comments-section" className="max-w-3xl mx-auto py-12 border-t mt-12">
      <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
        Bình luận <span className="text-gray-400 text-lg font-normal">({comments.length})</span>
      </h3>

      {/* FORM NHẬP */}
      <div className="flex gap-4 mb-10">
        {user ? (
          <Image src={user.imageUrl} alt="Me" width={40} height={40} className="rounded-full w-10 h-10 border object-cover" />
        ) : (
          <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0" />
        )}
        
        <form onSubmit={handleSubmit} className="flex-1 relative">
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={user ? "Chia sẻ suy nghĩ của bạn..." : "Đăng nhập để tham gia thảo luận..."}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 pr-12 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition resize-none h-24"
            disabled={!user || loading}
          />
          <button 
            type="submit"
            disabled={!content.trim() || loading}
            className="absolute right-3 bottom-3 p-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:bg-gray-300 transition"
          >
            {loading ? <Loader2 size={16} className="animate-spin"/> : <Send size={16} />}
          </button>
        </form>
      </div>

      {/* DANH SÁCH COMMENT */}
      <div className="space-y-6">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center py-4 italic">Chưa có bình luận nào. Hãy là người đầu tiên!</p>
        ) : (
          comments.map((cmt, idx) => (
            <div key={idx} className="flex gap-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <Image 
                src={cmt.user_avatar || "/default-avatar.png"} 
                alt="Avatar" 
                width={40} height={40} 
                className="rounded-full w-10 h-10 border object-cover flex-shrink-0"
              />
              <div>
                <div className="bg-gray-50 px-4 py-3 rounded-2xl rounded-tl-none">
                  <h4 className="font-bold text-sm text-gray-900 mb-1">{cmt.user_name}</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{cmt.content}</p>
                </div>
                <div className="flex gap-4 mt-1 ml-2 text-xs text-gray-400 font-medium">
                  <span>Thích</span>
                  <span>Phản hồi</span>
                  {/* Nếu cmt có created_at thì hiện, không thì hiện "Vừa xong" */}
                  <span>{cmt.created_at ? new Date(cmt.created_at).toLocaleDateString('vi-VN') : 'Vừa xong'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}