import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import Image from "next/image";


export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-500 py-12 border-t border-gray-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Cột 1: Giới thiệu */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4 group">
              <Image
                    src="/logo.png"
                    alt="BlogVLU Logo"
                    width={32}
                    height={32}
                    className="rounded-lg shadow-sm object-cover"
                  />
                <span className="text-xl font-bold text-white tracking-tight">Nhật ký của Hào</span>
            </Link>
            <p className="text-sm leading-relaxed text-gray-400 max-w-sm">
              Nơi ghi lại những mảnh ghép cuộc sống, những câu chuyện thường nhật, trải nghiệm và những kỷ niệm đẹp của Nhật Hào.
            </p>
          </div>

          {/* Cột 2: Liên kết nhanh */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Khám phá</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/blog" className="hover:text-white transition">Nhật ký đời thường</Link></li>
              <li><Link href="/events" className="hover:text-white transition">Khoảnh khắc & Kỷ niệm</Link></li>
              <li><Link href="/contact" className="hover:text-white transition">Liên hệ & Gửi thư</Link></li>
            </ul>
          </div>

          {/* Cột 3: Thông tin liên hệ */}
          <div>
            <h3 className="text-white font-bold mb-4 uppercase text-sm tracking-wider">Liên hệ</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 shrink-0 mt-0.5"/>
                <span>TP. Hồ Chí Minh, Việt Nam</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-red-500 shrink-0"/>
                <span>thanhkiem123498@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Dòng kẻ ngang */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-gray-500">
            © 2026 Nhật ký của Hào. Lưu giữ những kỷ niệm đẹp nhất.
          </p>
          
          {/* Social Icons */}
          <div className="flex gap-4">
            <a href="https://www.facebook.com/hao.bek.2024/" 
            aria-label="Facebook"
            className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition">
                <Facebook size={16}/>
            </a>
            <a href="https://www.instagram.com/gumayubekk/" 
            aria-label="Instagram"
            className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-pink-600 hover:text-white transition">
                <Instagram size={16}/>
            </a>
            <a href="https://x.com/Nhathao159" 
            aria-label="Twitter"
            className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center hover:bg-blue-400 hover:text-white transition">
                <Twitter size={16}/>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}