import Navbar from "@/components/Navbar";
import Image from "next/image"; // Dùng thẻ Image của Next.js cho tối ưu
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gọi Navbar vào đây */}
      <Navbar />

      <main className="container mx-auto px-4 py-12">
        {/* --- HERO SECTION --- */}
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
              <Link href="/about">
                <button className="bg-white text-gray-800 border border-gray-300 px-8 py-3 rounded-lg font-bold shadow-sm hover:bg-gray-100 transition">
                  Giới thiệu nhóm
                </button>
              </Link>
            </div>
          </div>

          {/* Cột phải: Hình ảnh 3D */}
          <div className="relative h-[400px] w-full bg-white rounded-3xl shadow-xl overflow-hidden flex items-center justify-center p-4">
            {/* LƯU Ý: Bạn nhớ chép file ảnh vào thư mục public và sửa tên file ở dưới nhé */}
            {/* <Image src="/hero-image.png" alt="Students" fill className="object-contain" /> */}
            
            {/* Tạm thời mình để chữ text placeholder nếu chưa có ảnh */}
            <div className="text-center text-gray-400">
               <p>Chỗ để hình 3D Students</p>
               <p>(Copy ảnh vào folder public)</p>
            </div>
          </div>
        </div>

        {/* --- SECTION 2: SỨ MỆNH (Demo cấu trúc) --- */}
        <div className="text-center mb-16">
           <h2 className="text-3xl font-bold text-gray-800 mb-10">Sứ mệnh – mục tiêu của nhóm</h2>
           <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {/* Card mẫu 1 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                 <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 font-bold">🚀</div>
                 <h3 className="font-bold text-gray-800">Phát triển kỹ năng</h3>
              </div>
              {/* Card mẫu 2 */}
              <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                 <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 font-bold">✓</div>
                 <h3 className="font-bold text-gray-800">Thực hiện dự án</h3>
              </div>
               {/* Card mẫu 3 */}
               <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                 <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 font-bold">🤝</div>
                 <h3 className="font-bold text-gray-800">Hợp tác - Kết nối</h3>
              </div>
               {/* Card mẫu 4 */}
               <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition">
                 <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 font-bold">📖</div>
                 <h3 className="font-bold text-gray-800">Tinh thần học thuật</h3>
              </div>
           </div>
        </div>

      </main>
    </div>
  );
}