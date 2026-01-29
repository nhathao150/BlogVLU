import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";
import MissionSection from "@/components/MissionSection"; // Import component mới

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        {/* --- HERO SECTION (Phần banner trên cùng) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
          
          {/* Cột trái: Chữ */}
          <div className="space-y-6">
            <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">
              Nhóm Sinh Viên – <br />
              Trường Đại học Văn Lang
            </h1>
            <p className="text-red-600 font-bold tracking-wider text-sm uppercase">
              Năng động - Sáng tạo - Trách nhiệm
            </p>
            <p className="text-gray-600 text-lg leading-relaxed">
              Chúng tôi là nhóm sinh viên đam mê công nghệ, luôn tìm tòi 
              và phát triển các giải pháp web hiện đại. Website này là nơi 
              lưu trữ các dự án và chia sẻ kiến thức học tập.
            </p>
            
            <div className="flex gap-4 pt-4">
              <Link href="/blog">
                <button className="bg-red-600 text-white px-8 py-3 rounded-lg font-bold shadow-lg hover:bg-red-700 transition">
                  Xem Blog
                </button>
              </Link>
            </div>
          </div>

          {/* Cột phải: Hình ảnh Banner */}
          <div className="relative h-[400px] w-full bg-white rounded-3xl shadow-xl overflow-hidden flex items-center justify-center p-4">
             <Image 
                src="/hero-image1.png" 
                alt="Students" 
                fill 
                className="object-cover" 
                priority // Thêm cái này để tăng điểm SEO/Tốc độ (LCP)
              />
          </div>
        </div>

        {/* --- SECTION 2: SỨ MỆNH (Đã thay thế bằng Component tương tác) --- */}
        {/* Component này đã bao gồm tiêu đề và phần nội dung bấm vào hiện ra */}
        <MissionSection />

      </main>
    </div>
  );
}