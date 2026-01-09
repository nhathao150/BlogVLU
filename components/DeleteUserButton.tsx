'use client'

import { Trash2 } from "lucide-react"
import { deleteUser } from "@/app/admin/users/actions"
import { useTransition } from "react"

export default function DeleteUserButton({ userId }: { userId: string }) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    if (confirm("Bạn có chắc muốn xóa vĩnh viễn thành viên này?")) {
      startTransition(async () => {
        await deleteUser(userId)
      })
    }
  }

  return (
    <button 
      onClick={handleDelete} 
      disabled={isPending}
      className="text-red-500 hover:bg-red-50 p-2 rounded-full transition disabled:opacity-50"
      title="Xóa thành viên"
    >
      <Trash2 size={18} />
    </button>
  )
}