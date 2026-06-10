'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Calendar } from 'lucide-react'

export default function BlogFilter({ years }: { years: number[] }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentYear = searchParams.get('year') || ''
  const currentMonth = searchParams.get('month') || ''
  const category = searchParams.get('category') || ''

  const handleYearChange = (year: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', '1')
    if (year) {
      params.set('year', year)
    } else {
      params.delete('year')
      params.delete('month')
    }
    router.push(`/blog?${params.toString()}`)
  }

  const handleMonthChange = (month: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', '1')
    if (month) {
      params.set('month', month)
    } else {
      params.delete('month')
    }
    router.push(`/blog?${params.toString()}`)
  }

  // Cấu hình style theo chủ đề
  const isTech = category === 'hoc-tap';
  const isDiary = category === 'nhat-ky';
  const isChill = category === 'chill';

  let containerClass = "flex flex-wrap items-center justify-center gap-4 mb-8 px-4 py-3 rounded-full border max-w-md mx-auto transition-all duration-300 ";
  let selectClass = "py-1 px-3 rounded-full text-xs font-semibold focus:outline-none cursor-pointer transition ";
  let iconColor = "text-amber-500";
  let labelClass = "text-xs font-semibold ";

  if (isTech) {
    containerClass += "bg-[#0c1328]/80 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.05)] text-emerald-400 font-fira";
    selectClass += "bg-gray-900 border-gray-800 text-emerald-300 focus:ring-emerald-500/50 focus:border-emerald-500";
    labelClass += "text-emerald-400/80";
    iconColor = "text-emerald-400";
  } else if (isDiary) {
    containerClass += "bg-[#fdfbf7] border-amber-250/50 shadow-xs text-amber-900 font-caveat text-lg";
    selectClass += "bg-[#fcf9f2] border-amber-200 text-amber-800 focus:ring-amber-500/40 focus:border-amber-400 font-caveat text-base";
    labelClass += "text-amber-800";
    iconColor = "text-amber-600";
  } else if (isChill) {
    containerClass += "bg-[#FAF6F0] border-amber-100 shadow-md text-gray-800 font-garamond";
    selectClass += "bg-white border-amber-100 text-gray-700 focus:ring-amber-500";
    labelClass += "text-gray-600 font-serif";
    iconColor = "text-amber-500";
  } else {
    containerClass += "bg-white border-gray-100 shadow-sm text-gray-700";
    selectClass += "bg-gray-50 border-gray-200 text-gray-700 focus:ring-amber-500";
    labelClass += "text-gray-500";
    iconColor = "text-amber-500";
  }

  return (
    <div className={containerClass}>
      <div className={`flex items-center gap-2 ${labelClass}`}>
        <Calendar size={14} className={iconColor} />
        <span>Lọc lưu trữ:</span>
      </div>

      <div className="flex gap-2">
        {/* Chọn năm */}
        <select
          value={currentYear}
          onChange={(e) => handleYearChange(e.target.value)}
          className={selectClass}
        >
          <option value="">Tất cả năm</option>
          {years.map((y) => (
            <option key={y} value={y}>
              Năm {y}
            </option>
          ))}
        </select>

        {/* Chọn tháng - Chỉ hiện khi đã chọn năm */}
        {currentYear && (
          <select
            value={currentMonth}
            onChange={(e) => handleMonthChange(e.target.value)}
            className={`${selectClass} animate-in fade-in slide-in-from-left-2 duration-200`}
          >
            <option value="">Tất cả tháng</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m.toString().padStart(2, '0')}>
                Tháng {m}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  )
}
