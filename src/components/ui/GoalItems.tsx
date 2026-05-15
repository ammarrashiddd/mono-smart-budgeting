export default function GoalItems({ name, target, current }: any) {
  const progress = (current / target) * 100;
  return (
    <div>
      <div className="flex justify-between items-end mb-3">
        <p className="font-bold text-secondary tracking-tight">{name}</p>
        <p className="text-xs font-black text-tertiary uppercase tracking-tighter">
          {Math.round(progress)}%{" "}
          <span className="mx-1 text-secondary/20">•</span> Rp{" "}
          {new Intl.NumberFormat("id-ID").format(current)}
        </p>
      </div>
      <div className="h-2.5 w-full bg-secondary/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-tertiary rounded-full transition-all duration-1000 shadow-[0_0_8px_rgba(30,86,205,0.4)]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
