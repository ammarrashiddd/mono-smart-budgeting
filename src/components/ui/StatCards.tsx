export default function StatCard({
  title,
  value,
  icon,
  subValue,
  highlight = false,
}: any) {
  return (
    <div
      className={`p-4 md:p-6 rounded-lg transition-all group bg-white border border-secondary/10 hover:border-tertiary shadow-sm hover:shadow-md`}
    >
      <div className="flex items-center justify-between mb-2 md:mb-4">
        <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-widest opacity-40 group-hover:opacity-100 transition-opacity truncate mr-2">
          {title}
        </span>
        <div
          className={`shrink-0 ${
            highlight
              ? "text-tertiary"
              : "text-secondary/20 group-hover:text-tertiary transition-colors"
          }`}
        >
          {/* Ukuran icon otomatis menyesuaikan container lewat props size di parent, 
              atau bisa kita bungkus div untuk kontrol skala */}
          <div className="scale-75 md:scale-100 origin-right">{icon}</div>
        </div>
      </div>

      <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-secondary tracking-tighter leading-none">
        {value}
      </p>

      {subValue && (
        <p className="text-[9px] md:text-xs font-bold text-tertiary mt-1 md:mt-2 uppercase tracking-tighter opacity-80">
          {subValue}
        </p>
      )}
    </div>
  );
}
