export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-20 pb-12">
      <div className="container mx-auto px-4">
        
        {/* Skeleton Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="h-10 w-64 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
          <div className="h-4 w-96 bg-gray-200 rounded-full mx-auto animate-pulse"></div>
        </div>

        {/* Skeleton Grid (Mô phỏng 3 cột bài viết) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Tạo mảng giả 6 phần tử để hiện 6 cái khung loading */}
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex flex-col h-full">
              {/* Ảnh bìa giả */}
              <div className="w-full h-48 bg-gray-200 rounded-xl animate-pulse mb-4"></div>
              
              {/* Tiêu đề giả */}
              <div className="h-6 w-3/4 bg-gray-200 rounded mb-2 animate-pulse"></div>
              <div className="h-6 w-1/2 bg-gray-200 rounded mb-4 animate-pulse"></div>
              
              {/* Footer giả */}
              <div className="mt-auto flex justify-between pt-4 border-t border-gray-50">
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}