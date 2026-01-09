'use client'

import { useState } from 'react'
import Navbar from "@/components/Navbar"
import { createClient } from "@/utils/supabase/client"
import { Mail, MapPin, Phone, Send, CheckCircle2, Loader2 } from "lucide-react"

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  
  // State form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const supabase = createClient()
    
    // Gửi dữ liệu lên Supabase
    const { error } = await supabase
      .from('contacts')
      .insert({
        name: formData.name,
        email: formData.email,
        message: formData.message
      })

    if (error) {
      alert("Lỗi: " + error.message)
    } else {
      setIsSuccess(true)
      setFormData({ name: '', email: '', message: '' }) // Reset form
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-grow container mx-auto px-4 py-12 md:py-20">
        <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          
          {/* CỘT TRÁI: Thông tin liên hệ */}
          <div className="md:w-5/12 bg-black text-white p-10 flex flex-col justify-between relative overflow-hidden">
            {/* Họa tiết trang trí */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-800 rounded-full blur-3xl -mr-16 -mt-16 opacity-50"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-900 rounded-full blur-3xl -ml-16 -mb-16 opacity-50"></div>

            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-6">Liên hệ với chúng tôi</h2>
              <p className="text-gray-400 mb-10 leading-relaxed">
                Bạn có ý tưởng bài viết mới? Hay phát hiện lỗi trên website? 
                Đừng ngần ngại gửi tin nhắn cho đội ngũ Admin nhé!
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-blue-400">
                    <Mail size={20}/>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase">Email</p>
                    <p className="font-medium">contact@blogvlu.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-green-400">
                    <Phone size={20}/>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase">Điện thoại</p>
                    <p className="font-medium">0909.888.xxx</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-red-400">
                    <MapPin size={20}/>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase">Địa chỉ</p>
                    <p className="font-medium">Van Lang University, HCMC</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-10">
               <p className="text-xs text-gray-500">© 2026 BlogVLU Inc.</p>
            </div>
          </div>

          {/* CỘT PHẢI: Form nhập liệu */}
          <div className="md:w-7/12 p-10 bg-white">
            {isSuccess ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-fade-in-up">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Đã gửi thành công!</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  Cảm ơn bạn đã đóng góp. Chúng tôi sẽ phản hồi sớm nhất có thể.
                </p>
                <button 
                  onClick={() => setIsSuccess(false)}
                  className="mt-8 text-black font-semibold hover:underline"
                >
                  Gửi tin nhắn khác
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
                  <input 
                    required
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Nguyễn Văn A"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email của bạn</label>
                  <input 
                    required
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung tin nhắn</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    placeholder="Góp ý về bài viết..."
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:border-transparent outline-none transition resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-black text-white font-bold py-4 rounded-xl hover:bg-gray-800 transition flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isLoading ? <Loader2 className="animate-spin"/> : <Send size={18} />}
                  Gửi tin nhắn
                </button>
              </form>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}