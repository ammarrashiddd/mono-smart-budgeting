export default function Goals() {
  const goals = [
    { name: "Dana Darurat", target: 10000000, current: 7500000 },
    { name: "Liburan Keluarga", target: 15000000, current: 4500000 },
    { name: "Gadget Baru", target: 5000000, current: 2000000 },
  ];

  return (
    <main>
      <div className="bg-white rounded-lg p-6 md:p-10 border border-secondary/5 shadow-xl shadow-secondary/5">
        <div className="flex flex-row items-center justify-between mb-8 md:mb-12">
          <h3 className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-secondary">
            Tujuan Keuangan
          </h3>
          <button className="text-tertiary text-[10px] md:text-xs font-black uppercase tracking-widest hover:underline transition-all whitespace-nowrap">
            Kelola Target
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-10">
          {goals.map((item) => {
            const progress = (item.current / item.target) * 100;
            return (
              <div className="group" key={item.name}>
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-3 gap-1 sm:gap-0">
                  {/* Nama Goal */}
                  <p className="text-sm md:text-base font-bold text-secondary tracking-tight truncate">
                    {item.name}
                  </p>

                  {/* Progress & Amount */}
                  <p className="text-[10px] md:text-xs font-black text-tertiary uppercase tracking-tighter flex items-center">
                    <span className="bg-tertiary/10 px-2 py-0.5 rounded-md mr-2 sm:mr-0 sm:bg-transparent sm:px-0">
                      {Math.round(progress)}%
                    </span>
                    <span className="hidden sm:inline mx-1 text-secondary/20">
                      •
                    </span>
                    <span className="text-secondary/60 sm:text-tertiary">
                      Rp {new Intl.NumberFormat("id-ID").format(item.current)}
                    </span>
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="h-2 md:h-2.5 w-full bg-secondary/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-tertiary rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(30,86,205,0.4)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Target Info */}
                <p className="text-[8px] md:text-[9px] font-medium text-secondary/30 mt-1.5 uppercase tracking-widest text-right">
                  Target: Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(item.target)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
