export default function ChartSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full animate-pulse">
      {/* SKELETON CHART 1: TREN SALDO (AREA CHART) */}
      <div className="h-72 bg-white rounded-xl border border-[#ebebeb] p-5 md:p-6 flex flex-col justify-between">
        {/* Header Title Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-[#f2f2f2] rounded-md w-1/3" />
        </div>

        {/* Mock Area Chart Lines (Grid Line Simulation) */}
        <div className="w-full space-y-5 pb-4">
          <div className="h-px bg-[#f2f2f2] w-full" />
          <div className="h-px bg-[#f2f2f2] w-full" />
          <div className="h-px bg-[#f2f2f2] w-full" />
          <div className="h-px bg-[#f2f2f2] w-full" />
          {/* X Axis Mock */}
          <div className="flex justify-between pt-2 px-2">
            <div className="h-2 bg-[#f2f2f2] rounded w-8" />
            <div className="h-2 bg-[#f2f2f2] rounded w-8" />
            <div className="h-2 bg-[#f2f2f2] rounded w-8" />
            <div className="h-2 bg-[#f2f2f2] rounded w-8" />
          </div>
        </div>
      </div>

      {/* SKELETON CHART 2: DISTRIBUSI KATEGORI (DONUT CHART) */}
      <div className="h-72 bg-white rounded-xl border border-[#ebebeb] p-5 md:p-6 flex flex-col justify-between">
        {/* Header Title Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-[#f2f2f2] rounded-md w-1/2" />
        </div>

        {/* Mock Donut Circle */}
        <div className="flex justify-center items-center h-40">
          <div className="w-28 h-28 rounded-full border-14 border-[#f2f2f2] flex items-center justify-center" />
        </div>

        {/* Mock Legends */}
        <div className="flex justify-center space-x-4 pb-1">
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-[#f2f2f2]" />
            <div className="h-2 bg-[#f2f2f2] rounded w-12" />
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-[#f2f2f2]" />
            <div className="h-2 bg-[#f2f2f2] rounded w-12" />
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="w-2 h-2 rounded-full bg-[#f2f2f2]" />
            <div className="h-2 bg-[#f2f2f2] rounded w-12" />
          </div>
        </div>
      </div>
    </div>
  );
}
