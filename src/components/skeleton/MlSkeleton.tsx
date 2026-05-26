export default function MlSkeleton() {
  return (
    <main className="bg-white rounded-xl p-6 md:p-8 border border-secondary/5 shadow-sm animate-pulse space-y-4 w-full">
      <div className="flex justify-between items-center border-b border-gray-100 pb-4">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-5 bg-gray-100 rounded w-28"></div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-64 bg-gray-50 rounded-lg"></div>
        <div className="h-64 bg-gray-50 rounded-lg"></div>
      </div>
    </main>
  );
}
