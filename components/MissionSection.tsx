"use client";

import React, { useState } from "react";
import { Rocket, CheckCircle2, Handshake, BookOpen, ChevronDown } from "lucide-react";

// Dữ liệu giữ nguyên
const missions = [
  {
    id: 1,
    title: "Phát triển kỹ năng",
    icon: <Rocket className="w-8 h-8 text-red-500 mb-3" />,
    color: "border-red-200 bg-red-50",
    content:
      "Rèn luyện các kỹ năng mềm thiết yếu (giao tiếp, làm việc nhóm) và kỹ năng chuyên môn (lập trình, thiết kế) thông qua các buổi workshop thực chiến hàng tháng.",
  },
  {
    id: 2,
    title: "Thực hiện dự án",
    icon: <CheckCircle2 className="w-8 h-8 text-green-500 mb-3" />,
    color: "border-green-200 bg-green-50",
    content:
      "Cơ hội tham gia các dự án thực tế, xây dựng Portfolio ấn tượng ngay từ khi còn ngồi trên ghế nhà trường để ghi điểm tuyệt đối với nhà tuyển dụng sau này.",
  },
  {
    id: 3,
    title: "Hợp tác - Kết nối",
    icon: <Handshake className="w-8 h-8 text-orange-500 mb-3" />,
    color: "border-orange-200 bg-orange-50",
    content:
      "Mở rộng mạng lưới quan hệ (Networking) với các sinh viên giỏi, cựu sinh viên thành đạt và các doanh nghiệp đối tác uy tín trong ngành.",
  },
  {
    id: 4,
    title: "Tinh thần học thuật",
    icon: <BookOpen className="w-8 h-8 text-blue-500 mb-3" />,
    color: "border-blue-200 bg-blue-50",
    content:
      "Nơi chia sẻ kiến thức, tài liệu học tập chất lượng cao và thúc đẩy tư duy nghiên cứu, sáng tạo không giới hạn trong cộng đồng sinh viên.",
  },
];

export default function MissionSection() {
  // Sửa 1: Mặc định là null (không chọn gì cả)
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Hàm xử lý khi bấm vào thẻ
  const handleCardClick = (id: number) => {
    if (selectedId === id) {
      // Nếu đang chọn cái đó mà bấm lại -> Tắt đi (đóng lại)
      setSelectedId(null);
    } else {
      // Nếu chưa chọn -> Mở ra
      setSelectedId(id);
    }
  };

  // Tìm nội dung của thẻ đang chọn
  const activeMission = missions.find((m) => m.id === selectedId);

  return (
    <div className="py-12">
      <h2 className="text-3xl font-bold text-center mb-4 text-gray-800">
        Sứ mệnh – Mục tiêu của nhóm
      </h2>

      {/* Phần lưới 4 thẻ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {missions.map((item) => (
          <div
            key={item.id}
            onClick={() => handleCardClick(item.id)}
            className={`
              cursor-pointer rounded-2xl p-6 text-center border-2 transition-all duration-300 transform hover:-translate-y-1
              flex flex-col items-center justify-center h-48 shadow-sm relative group
              ${
                selectedId === item.id
                  ? `${item.color} shadow-md scale-105 ring-2 ring-offset-2 ring-gray-100` 
                  : "border-gray-100 bg-white hover:border-gray-200"
              }
            `}
          >
            <div className="bg-white p-3 rounded-full shadow-sm mb-2">
                {item.icon}
            </div>
            <h3 className="font-bold text-gray-800">{item.title}</h3>
            
            {/* Mũi tên chỉ xuống: Chỉ hiện khi được chọn */}
            <div className={`absolute bottom-2 transition-opacity duration-300 ${selectedId === item.id ? 'opacity-100' : 'opacity-0'}`}>
                <ChevronDown size={20} className="text-gray-400" />
            </div>
          </div>
        ))}
      </div>

      {/* Phần nội dung chi tiết (Có Animation) */}
      <div className="max-w-4xl mx-auto min-h-[150px]">
        {activeMission ? (
          <div 
            key={selectedId} // Key giúp React biết để chạy lại animation khi đổi tab
            className="bg-white rounded-2xl p-8 border border-gray-200 shadow-xl text-center 
                       animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-500 ease-out"
          >
            <h3 className="text-xl font-bold mb-3 text-gray-900 flex items-center justify-center gap-2">
              {activeMission.icon}
              Chi tiết về: <span className="text-blue-600">{activeMission.title}</span>
            </h3>
            <div className="w-16 h-1 bg-gray-200 mx-auto mb-4 rounded-full"></div>
            <p className="text-lg text-gray-600 leading-relaxed">
              {activeMission.content}
            </p>
          </div>
        ) : (
          // Trạng thái chờ: Khi chưa bấm gì cả
          <div className="flex flex-col items-center justify-center h-full text-gray-400 py-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
             <p>✨ Hãy chọn một mục ở trên để khám phá ✨</p>
          </div>
        )}
      </div>
    </div>
  );
}