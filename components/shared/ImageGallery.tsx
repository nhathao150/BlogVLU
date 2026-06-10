'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

export default function ImageGallery({ images }: { images: string[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [photoIndex, setPhotoIndex] = useState(0)

  // Ngăn cuộn trang web khi đang mở ảnh to
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = 'unset'
    return () => { document.body.style.overflow = 'unset' }
  }, [isOpen])

  // Không có ảnh thì không render
  if (!images || images.length === 0) return null

  const count = images.length

  // Hàm mở modal zoom ảnh
  const openLightbox = (index: number) => {
    setPhotoIndex(index)
    setIsOpen(true)
  }

  // LOGIC HIỂN THỊ LƯỚI ẢNH
  const renderGrid = () => {
    // Trường hợp 1: Chỉ có 1 ảnh
    if (count === 1) {
      return (
        <div 
            className="relative w-full aspect-auto min-h-[300px] max-h-[500px] bg-gray-100 cursor-pointer border-t border-b border-gray-100"
            onClick={() => openLightbox(0)}
        >
            <Image 
                src={images[0]} 
                alt="img" 
                width={800} height={600} 
                className="w-full h-full object-cover"
            />
        </div>
      )
    }
    
    // Trường hợp 2: Có 2 ảnh (Chia đôi)
    if (count === 2) {
        return (
            <div className="grid grid-cols-2 gap-1 h-[300px] border-t border-b border-gray-100">
                {images.map((img, i) => (
                    <div key={i} className="relative h-full cursor-pointer bg-gray-100" onClick={() => openLightbox(i)}>
                        <Image src={img} alt="img" fill className="object-cover hover:opacity-90 transition"/>
                    </div>
                ))}
            </div>
        )
    }

    // Trường hợp 3: Có 3 ảnh trở lên (1 to bên trái, các ảnh nhỏ bên phải)
    return (
        <div className="grid grid-cols-2 gap-1 h-[360px] border-t border-b border-gray-100">
             {/* CỘT TRÁI: Ảnh đầu tiên (To nhất) */}
            <div className="relative h-full cursor-pointer bg-gray-100" onClick={() => openLightbox(0)}>
                <Image src={images[0]} alt="img" fill className="object-cover hover:opacity-90 transition"/>
            </div>

            {/* CỘT PHẢI: Các ảnh còn lại */}
            <div className="grid grid-rows-2 gap-1 h-full">
                {/* Ảnh thứ 2 */}
                <div className="relative h-full cursor-pointer bg-gray-100" onClick={() => openLightbox(1)}>
                     <Image src={images[1]} alt="img" fill className="object-cover hover:opacity-90 transition"/>
                </div>
                
                {/* Ảnh thứ 3 + Số lượng còn lại */}
                <div className="relative h-full cursor-pointer bg-gray-100" onClick={() => openLightbox(2)}>
                    <Image src={images[2]} alt="img" fill className="object-cover hover:opacity-90 transition"/>
                    
                    {/* Lớp phủ hiển thị số lượng ảnh thừa (Ví dụ: +7) */}
                    {count > 3 && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-3xl hover:bg-black/40 transition">
                            +{count - 3}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
  }

  return (
    <>
      {/* 1. Phần lưới ảnh hiển thị trên bài viết */}
      <div className="overflow-hidden">
        {renderGrid()}
      </div>

      {/* 2. Phần Lightbox (Zoom to toàn màn hình) */}
      {isOpen && (
        <div 
            className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setIsOpen(false)} // Bấm ra ngoài để đóng
        >
            {/* Nút đóng */}
            <button 
                onClick={() => setIsOpen(false)}
                className="absolute top-6 right-6 text-white/70 hover:text-white p-2 bg-white/10 rounded-full transition z-50"
            >
                <X size={24}/>
            </button>

            {/* Ảnh chính */}
            <div 
                className="relative w-full h-full max-w-6xl max-h-[85vh] mx-4 flex items-center justify-center pointer-events-none"
            >
                <Image 
                    src={images[photoIndex]} 
                    alt="zoom" 
                    fill
                    className="object-contain pointer-events-auto select-none"
                    quality={100}
                />
            </div>

            {/* Nút Prev (Trái) */}
            {count > 1 && (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setPhotoIndex((prev) => (prev + count - 1) % count)
                    }}
                    className="absolute left-4 md:left-8 text-white hover:bg-white/10 p-3 rounded-full transition z-50 group"
                >
                    <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform"/>
                </button>
            )}

            {/* Nút Next (Phải) */}
            {count > 1 && (
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        setPhotoIndex((prev) => (prev + 1) % count)
                    }}
                    className="absolute right-4 md:right-8 text-white hover:bg-white/10 p-3 rounded-full transition z-50 group"
                >
                    <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform"/>
                </button>
            )}
            
            {/* Index đếm số trang */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/90 text-sm font-medium bg-zinc-800/80 px-4 py-1.5 rounded-full border border-white/10">
                Ảnh {photoIndex + 1} / {count}
            </div>
        </div>
      )}
    </>
  )
}