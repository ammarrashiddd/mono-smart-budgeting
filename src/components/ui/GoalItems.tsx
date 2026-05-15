export default function GoalItems({ name, target, current }: any) {
  const progress = (current / target) * 100;

  return (
    <div className="group">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-3 gap-1 sm:gap-0">
        {/* Nama Goal - Font lebih besar di mobile agar mudah dibaca */}
        <p className="text-sm md:text-base font-bold text-secondary tracking-tight truncate">
          {name}
        </p>

        {/* Progress & Amount - Ukuran sangat ringkas di mobile */}
        <p className="text-[10px] md:text-xs font-black text-tertiary uppercase tracking-tighter flex items-center">
          <span className="bg-tertiary/10 px-2 py-0.5 rounded-md mr-2 sm:mr-0 sm:bg-transparent sm:px-0">
            {Math.round(progress)}%
          </span>
          <span className="hidden sm:inline mx-1 text-secondary/20">•</span>
          <span className="text-secondary/60 sm:text-tertiary">
            Rp {new Intl.NumberFormat("id-ID").format(current)}
          </span>
        </p>
      </div>

      {/* Progress Bar Container */}
      <div className="h-2 md:h-2.5 w-full bg-secondary/5 rounded-full overflow-hidden">
        <div
          className="h-full bg-tertiary rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(30,86,205,0.4)]"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Target Info (Optional but helpful for context) */}
      <p className="text-[8px] md:text-[9px] font-medium text-secondary/30 mt-1.5 uppercase tracking-widest text-right">
        Target: Rp {new Intl.NumberFormat("id-ID").format(target)}
      </p>
    </div>
  );
}
