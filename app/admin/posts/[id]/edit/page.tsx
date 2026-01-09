import PostForm from "@/components/PostForm";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

// 1. Sửa kiểu dữ liệu: params là Promise
export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  
  // 2. PHẢI CÓ DÒNG NÀY: Chờ (await) để lấy ID ra
  const { id } = await params;

  console.log("Đang sửa bài có ID:", id); 

  const supabase = await createClient();

  // 3. Lấy bài viết theo ID (dùng biến id vừa await xong)
  const { data: post } = await supabase
    .from('posts')
    .select('*')
    .eq('id', id)
    .single();

  if (!post) {
    notFound();
  }

  return <PostForm initialData={post} />;
}