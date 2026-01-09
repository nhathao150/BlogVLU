'use client'

import { Trash2, Loader2 } from "lucide-react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function DeleteContactButton({ id }: { id: number }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleDelete = async () => {
    // 1. Hỏi xác nhận
    if (!confirm("Bạn có chắc muốn xóa tin nhắn này không?")) return

    setLoading(true)
    const supabase = createClient()
    
    // 2. Gọi Supabase xóa theo ID
    const { error } = await supabase.from('contacts').delete().eq('id', id)

    if (error) {
      alert("Lỗi xóa: " + error.message)
    } else {
      // 3. Refresh lại trang để mất dòng đó đi
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading}
      className="text-gray-400 hover:text-red-500 transition p-1 rounded-full hover:bg-red-50"
      title="Xóa tin nhắn"
    >
      {loading ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16} />}
    </button>
  )
}