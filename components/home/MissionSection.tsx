"use client";

import React, { useState } from "react";
import { Heart, BookOpen, Map, Coffee, ChevronDown } from "lucide-react";


const missions = [
  {
    id: 1,
    title: "Nhật ký ngày thường",
    icon: <Heart className="w-8 h-8 text-red-500 mb-3" />,
    color: "border-red-200 bg-red-50",
    content:
      "Những suy ngẫm đời thường, cảm xúc vui buồn, hay các câu chuyện nhỏ bé diễn ra trong ngày. Nơi trút bầu tâm sự và lưu giữ cảm xúc chân thật nhất.",
  },
  {
    id: 2,
    title: "Học tập & Công việc",
    icon: <BookOpen className="w-8 h-8 text-green-500 mb-3" />,
    color: "border-green-200 bg-green-50",
    content:
      "Ghi lại những kiến thức công nghệ mới học được, những cột mốc phát triển bản thân và tiến độ các dự án phần mềm mình đang thực hiện.",
  },
  {
    id: 3,
    title: "Đi & Trải nghiệm",
    icon: <Map className="w-8 h-8 text-orange-500 mb-3" />,
    color: "border-orange-200 bg-orange-50",
    content:
      "Những chuyến đi phượt, hành trình khám phá các vùng đất mới, các buổi gặp gỡ bạn bè và những khoảnh khắc dịch chuyển đầy hào hứng.",
  },
  {
    id: 4,
    title: "Sở thích & Chill",
    icon: <Coffee className="w-8 h-8 text-blue-500 mb-3" />,
    color: "border-blue-200 bg-blue-50",
    content:
      "Nơi chia sẻ về những bộ phim hay, bản nhạc yêu thích, cuốn sách tâm đắc hoặc những quán cà phê chill mà mình vô tình ghé qua.",
  },
];

export default function MissionSection() {
  // Mặc định là null (không chọn gì cả)
  const [selectedId, setSelectedId] = useState<number | null>(null);

  // Hàm xử lý khi click vào thẻ
  const handleCardClick = (id: number) => {
    if (selectedId === id) {
      // Nếu đang chọn cái đó mà bấm lại -> đóng lại
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
        Những mảnh ghép cuộc sống 🧩
      </h2>

      {/* lưới thẻ */}
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
          <div className="flex flex-col items-center justify-center h-full text-gray-800 py-8 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
             <p>✨ Hãy chọn một mục ở trên để khám phá ✨</p>
          </div>
        )}
      </div>
    </div>
  );
}