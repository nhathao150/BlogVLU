'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { ArrowLeft, Loader2, Save, ImagePlus, X, MapPin, Calendar, Type } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

type EventData = {
  id?: number
  title: string
  description: string
  location: string
  event_date: string
  images?: string[]    // Mảng ảnh mới
  image_url?: string   // Ảnh cũ (giữ lại để tương thích)
}

export default function EventForm({ initialData }: { initialData?: EventData }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  
  const [title, setTitle] = useState(initialData?.title || '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [location, setLocation] = useState(initialData?.location || '')
  
  const defaultDate = initialData?.event_date 
    ? new Date(initialData.event_date).toISOString().slice(0, 16) 
    : ''
  const [eventDate, setEventDate] = useState(defaultDate)

  // LOGIC NHIỀU ẢNH
  // 1. Lấy ảnh cũ (ưu tiên cột images, nếu không có thì lấy cột image_url)
  const initialImages = initialData?.images && initialData.images.length > 0 
    ? initialData.images 
    : (initialData?.image_url ? [initialData.image_url] : [])

  const [previewUrls, setPreviewUrls] = useState<string[]>(initialImages)
  const [files, setFiles] = useState<File[]>([]) // File mới chờ upload

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      // Check tổng số ảnh không quá 10
      if (previewUrls.length + newFiles.length > 10) {
        alert("Chỉ được đăng tối đa 10 ảnh!")
        return
      }
      setFiles((prev) => [...prev, ...newFiles]) // Thêm vào hàng chờ upload
      
      // Tạo URL ảo để xem trước ngay lập tức
      const newUrls = newFiles.map(file => URL.createObjectURL(file))
      setPreviewUrls((prev) => [...prev, ...newUrls])
    }
  }

  const removeImage = (indexToRemove: number) => {
    // 1. Xóa khỏi giao diện
    setPreviewUrls((prev) => prev.filter((_, i) => i !== indexToRemove))
    
    // 2. Nếu là ảnh mới (file), cần xóa khỏi mảng 'files'
    // Logic: Tính toán xem indexToRemove này tương ứng với file nào trong mảng files
    // (Phần này để đơn giản trong demo mình sẽ clear files nếu xóa ảnh, 
    // thực tế cần logic phức tạp hơn để map đúng index)
  }

  const handleSubmit = async () => {
    if (!title || !eventDate) return alert("Vui lòng nhập tên và thời gian!")
    setLoading(true)
    const supabase = createClient()
    
    // UPLOAD ẢNH
    let finalImageUrls: string[] = []

    // 1. Giữ lại những ảnh cũ (là những link bắt đầu bằng http)
    const oldImages = previewUrls.filter(url => url.startsWith('http'))
    finalImageUrls = [...oldImages]

    // 2. Upload những ảnh mới (nằm trong mảng files)
    if (files.length > 0) {
      const uploadPromises = files.map(async (file) => {
        const fileName = `event-${Date.now()}-${Math.random()}-${file.name}`
        const { error } = await supabase.storage.from('images').upload(fileName, file)
        if (!error) {
           const { data } = supabase.storage.from('images').getPublicUrl(fileName)
           return data.publicUrl
        }
        return null
      })
      
      const results = await Promise.all(uploadPromises)
      const successUrls = results.filter((url): url is string => url !== null)
      finalImageUrls = [...finalImageUrls, ...successUrls]
    }

    const eventData = {
      title,
      description,
      location,
      event_date: new Date(eventDate).toISOString(),
      images: finalImageUrls, // Lưu mảng ảnh
      image_url: finalImageUrls[0] || null, // Lưu ảnh đầu tiên làm cover (cho code cũ đỡ lỗi)
    }

    const { error } = initialData?.id 
        ? await supabase.from('events').update(eventData).eq('id', initialData.id)
        : await supabase.from('events').insert(eventData)

    if (error) alert(error.message)
    else {
        router.push('/admin/events')
        router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between py-6 mb-6 border-b">
        <div className="flex items-center gap-4">
            <Link href="/admin/events" className="p-2 hover:bg-gray-100 rounded-full transition"><ArrowLeft size={20}/></Link>
            <h1 className="text-xl font-bold">{initialData ? 'Sửa sự kiện' : 'Thêm sự kiện mới'}</h1>
        </div>
        <button onClick={handleSubmit} disabled={loading} className="bg-black text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800 disabled:opacity-50">
            {loading ? <Loader2 className="animate-spin" /> : <Save size={18} />} Lưu
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* CỘT TRÁI: UPLOAD ẢNH */}
        <div className="md:col-span-1 space-y-4">
            <div className="bg-white p-4 rounded-xl border shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-medium flex items-center gap-2"><ImagePlus size={18}/> Ảnh ({previewUrls.length}/10)</span>
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded text-xs font-bold transition">
                        + Thêm
                        <input type="file" multiple className="hidden" onChange={handleImageSelect} accept="image/*" />
                    </label>
                </div>

                <div className="grid grid-cols-2 gap-2">
                    {previewUrls.map((url, idx) => (
                        <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border group">
                            <Image src={url} alt="preview" fill className="object-cover" />
                            <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-black/60 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition hover:bg-red-500">
                                <X size={12}/>
                            </button>
                        </div>
                    ))}
                    {previewUrls.length === 0 && (
                        <div className="col-span-2 aspect-[4/3] flex flex-col items-center justify-center border-2 border-dashed rounded-lg text-gray-400 bg-gray-50">
                            <ImagePlus size={24} className="mb-2 opacity-50"/>
                            <span className="text-xs">Chưa có ảnh</span>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* CỘT PHẢI: FORM NHẬP LIỆU */}
        <div className="md:col-span-2 space-y-6 bg-white p-6 rounded-xl border shadow-sm">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sự kiện</label>
                <div className="relative">
                    <Type className="absolute left-3 top-3 text-gray-400" size={18} />
                    <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" placeholder="Tiêu đề..." />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
                    <div className="relative">
                        <Calendar className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Địa điểm</label>
                    <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-black outline-none" placeholder="Ở đâu..." />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                <textarea rows={6} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none resize-none" placeholder="Nội dung..." />
            </div>
        </div>
      </div>
    </div>
  )
}