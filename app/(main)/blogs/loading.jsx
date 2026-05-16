// app/blogs/loading.js
export default function Loading() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        {/* Category Filter Skeleton */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-28 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-32 h-8 bg-gray-200 rounded-full animate-pulse"></div>
          <div className="w-24 h-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>

        {/* Featured Post Skeleton */}
        <div className="mb-16">
          <div className="w-48 h-8 bg-gray-200 rounded-lg animate-pulse mb-8 mx-auto"></div>
          <div className="grid md:grid-cols-2 gap-8 items-center bg-gray-50 rounded-xl overflow-hidden">
            <div className="h-80 bg-gray-200 animate-pulse"></div>
            <div className="p-8 space-y-4">
              <div className="flex gap-3">
                <div className="w-20 h-6 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="w-24 h-6 bg-gray-200 rounded-full animate-pulse"></div>
              </div>
              <div className="w-3/4 h-8 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-full h-20 bg-gray-200 rounded-lg animate-pulse"></div>
              <div className="w-32 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>

        {/* Blog Grid Skeleton */}
        <div className="w-48 h-8 bg-gray-200 rounded-lg animate-pulse mb-10 mx-auto"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-50 rounded-lg overflow-hidden">
              <div className="h-48 bg-gray-200 animate-pulse"></div>
              <div className="p-6 space-y-3">
                <div className="w-3/4 h-6 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-full h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="w-2/3 h-4 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex gap-2 mt-4">
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="w-20 h-4 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}