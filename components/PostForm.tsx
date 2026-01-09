'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { ArrowLeft, Loader2, Save, ImagePlus, X, Globe, EyeOff } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

// Định nghĩa kiểu dữ liệu cho bài viết
type PostData = {
  id?: number
  title: string
  slug: string
  content: string
  image_url: string | null
  is_published: boolean
}

export default function PostForm({ initialData }: { initialData?: PostData }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  // Khởi tạo state từ dữ liệu cũ (nếu có) hoặc để trống
  const [title, setTitle] = useState(initialData?.title || '')
  const [slug, setSlug] = useState(initialData?.slug || '')
  const [isPublished, setIsPublished] = useState(initialData?.is_published || false)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url || null)
  const [imageFile, setImageFile] = useState<File | null>(null)

  // Cấu hình Editor
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Bắt đầu viết câu chuyện của bạn...' }),
    ],
    content: initialData?.content || '', // Load nội dung cũ nếu có
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-4 text-gray-800',
      },
    },
  })

  // Update slug tự động khi nhập title (chỉ khi đang tạo mới)
  const handleTitleChange = (val: string) => {
    setTitle(val)
    if (!initialData) {
      const newSlug = val.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d").replace(/[^a-z0-9\s]/g, "")
        .trim().replace(/\s+/g, "-")
      setSlug(newSlug)
    }
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async () => {
    if (!title || !slug) return alert("Vui lòng nhập tiêu đề!")
    setLoading(true)
    const supabase = createClient()
    
    let finalImageUrl = previewUrl

    // 1. Upload ảnh mới nếu có
    if (imageFile) {
      const fileName = `${Date.now()}-${imageFile.name}`
      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(fileName, imageFile)
      
      if (uploadError) {
        alert("Lỗi upload ảnh: " + uploadError.message)
        setLoading(false)
        return
      }
      
      const { data } = supabase.storage.from('images').getPublicUrl(fileName)
      finalImageUrl = data.publicUrl
    }

    const postData = {
      title,
      slug,
      content: editor?.getHTML() || '',
      is_published: isPublished,
      image_url: finalImageUrl,
    }

    let error
    if (initialData?.id) {
      // MODE: UPDATE (Sửa)
      const { error: updateError } = await supabase
        .from('posts')
        .update(postData)
        .eq('id', initialData.id)
      error = updateError
    } else {
      // MODE: CREATE (Tạo mới)
      const { error: insertError } = await supabase
        .from('posts')
        .insert(postData)
      error = insertError
    }

    if (error) {
      alert('Lỗi: ' + error.message)
    } else {
      router.push('/admin/posts')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* --- HEADER --- */}
      <div className="flex items-center justify-between py-6 sticky top-0 bg-gray-50/95 backdrop-blur z-20 mb-6 border-b border-gray-200">
        <div className="flex items-center gap-4">
            <Link href="/admin/posts" className="p-2 hover:bg-gray-200 rounded-full transition">
            <ArrowLeft size={20} className="text-gray-600"/>
            </Link>
            <div>
                <h1 className="text-xl font-bold text-gray-800">
                    {initialData ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}
                </h1>
                <p className="text-xs text-gray-500">
                    {isPublished ? 'Trạng thái: Công khai' : 'Trạng thái: Bản nháp'}
                </p>
            </div>
        </div>

        <div className="flex items-center gap-3">
            {/* Nút Toggle Publish */}
            <button 
                onClick={() => setIsPublished(!isPublished)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                    isPublished 
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                }`}
            >
                {isPublished ? <Globe size={16}/> : <EyeOff size={16}/>}
                {isPublished ? 'Public' : 'Draft'}
            </button>

            {/* Nút Lưu */}
            <button 
                onClick={handleSubmit}
                disabled={loading}
                className="bg-black text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50 shadow-lg shadow-black/20 transition-all active:scale-95"
            >
                {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />}
                {initialData ? 'Cập nhật' : 'Đăng bài'}
            </button>
        </div>
      </div>

      {/* --- MAIN LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* CỘT TRÁI (NỘI DUNG) - Chiếm 8 phần */}
        <div className="lg:col-span-8 space-y-6">
          {/* Ô nhập tiêu đề lớn */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <input 
                type="text" 
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="Tiêu đề bài viết..."
                className="w-full text-4xl font-extrabold text-gray-900 placeholder:text-gray-300 border-none outline-none bg-transparent leading-tight"
            />
          </div>

          {/* Bộ soạn thảo */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[600px] cursor-text" onClick={() => editor?.commands.focus()}>
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* CỘT PHẢI (SIDEBAR) - Chiếm 4 phần */}
        <div className="lg:col-span-4 space-y-6">
            
            {/* 1. Card Ảnh bìa */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    <ImagePlus size={18}/> Ảnh bìa
                </h3>
                
                <div className="relative w-full aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 overflow-hidden hover:border-gray-400 transition group">
                    {previewUrl ? (
                        <>
                            <Image src={previewUrl} alt="Cover" fill className="object-cover" />
                            <button 
                                onClick={() => { setPreviewUrl(null); setImageFile(null) }}
                                className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition hover:bg-white shadow-sm"
                            >
                                <X size={16}/>
                            </button>
                        </>
                    ) : (
                        <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                            <ImagePlus className="w-8 h-8 text-gray-300 mb-2"/>
                            <span className="text-xs text-gray-400">Tải ảnh lên</span>
                            <input type="file" className="hidden" onChange={handleImageSelect} accept="image/*" />
                        </label>
                    )}
                </div>
            </div>

            {/* 2. Card Cài đặt Slug */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 sticky top-28">
                <h3 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
                    Link bài viết
                </h3>
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 flex flex-col gap-1">
                    <span className="text-xs text-gray-400 font-medium">URL Slug</span>
                    <input 
                        type="text" 
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                        className="bg-transparent text-sm font-medium text-gray-800 outline-none w-full"
                    />
                </div>
                <p className="text-xs text-gray-400 mt-2">
                    Đường dẫn sẽ là: domain.com/blog/<span className="text-black">{slug}</span>
                </p>
            </div>
        </div>

      </div>
    </div>
  )
}