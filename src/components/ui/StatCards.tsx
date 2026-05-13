export default function StatCard({
  title,
  value,
  icon,
  subValue,
  highlight = false,
}: any) {
  return (
    <div
      className={`p-6 rounded-3xl transition-all group bg-white border border-secondary/30 hover:border-tertiary`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className={`text-[10px] font-black uppercase tracking-widest`}>
          {title}
        </span>
        <div
          className={
            highlight
              ? "text-tertiary"
              : "text-secondary/20 group-hover:text-tertiary transition-colors"
          }
        >
          {icon}
        </div>
      </div>
      <p className="text-3xl font-black text-secondary tracking-tighter">
        {value}
      </p>
      {subValue && (
        <p className="text-xs font-bold text-tertiary mt-1 uppercase tracking-tighter">
          {subValue}
        </p>
      )}
    </div>
  );
}
