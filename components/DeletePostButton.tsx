'use client'; // Bắt buộc dòng này để dùng onClick

import { Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function DeletePostButton({ postId }: { postId: number }) {
  const router = useRouter();

  const handleDelete = async () => {
    // 1. Hỏi lại cho chắc
    const confirmed = window.confirm("Bạn có chắc muốn xóa bài này không?");
    if (!confirmed) return;

    // 2. Gọi Supabase xóa
    const supabase = createClient();
    const { error } = await supabase.from('posts').delete().eq('id', postId);

    if (error) {
      alert("Lỗi: " + error.message);
    } else {
      // 3. Refresh lại trang để mất dòng đó đi
      router.refresh(); 
    }
  };

  return (
    <button onClick={handleDelete} className="text-gray-400 hover:text-red-600 transition">
      <Trash2 size={18} />
    </button>
  );
}