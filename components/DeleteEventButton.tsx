'use client';
import { Trash2 } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function DeleteEventButton({ eventId }: { eventId: number }) {
  const router = useRouter();
  const handleDelete = async () => {
    if (!window.confirm("Xóa sự kiện này?")) return;
    const supabase = createClient();
    await supabase.from('events').delete().eq('id', eventId);
    router.refresh(); 
  };

  return (
    <button onClick={handleDelete} className="text-gray-400 hover:text-red-600 transition">
      <Trash2 size={18} />
    </button>
  );
}