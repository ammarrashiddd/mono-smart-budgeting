import { PencilSimple, Plus, Trash } from "@phosphor-icons/react";
import { useState } from "react";

export default function Goals() {
  const goals = [
    { name: "Dana Darurat", target: 10000000, current: 7500000 },
    { name: "Joki", target: 10000000, current: 7500000 },
  ];

  const [isManaging, setIsManaging] = useState(false);

  return (
    <main>
      <div className="bg-white rounded-lg p-6 md:p-10 border border-secondary/5 shadow-xl shadow-secondary/5">
        <div className="flex flex-row items-center justify-between mb-8 md:mb-12">
          {/* Bungkus Judul dan Tombol Tambah ke dalam satu flex container */}
          <div className="flex items-center gap-3">
            <h3 className="text-xs md:text-base font-black uppercase text-secondary">
              Tujuan Keuangan
            </h3>
            {isManaging && (
              <button
                onClick={() => alert("Fitur Tambah Target")}
                className="flex items-center gap-1 bg-tertiary text-primary px-3 py-1 rounded-md text-[10px] font-black uppercase hover:opacity-90 transition-all animate-in fade-in slide-in-from-left-2 duration-200 cursor-pointer"
              >
                Tambah
              </button>
            )}
          </div>

          <button
            onClick={() => setIsManaging(!isManaging)}
            className={`text-xs md:text-base font-black uppercase hover:underline hover:cursor-pointer transition-all whitespace-nowrap ${
              isManaging ? "text-red-500" : "text-tertiary"
            }`}
          >
            {isManaging ? "Selesai" : "Kelola Target"}
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 md:gap-8">
          {goals.map((item) => {
            const progress = (item.current / item.target) * 100;
            return (
              <div className="group" key={item.name}>
                <div className="flex flex-row justify-between sm:items-end mb-3 gap-1 sm:gap-0">
                  {/* Nama Goal */}
                  <p className="text-sm md:text-base font-bold text-secondary tracking-tight truncate">
                    {item.name}
                  </p>

                  {/* Progress & Amount / Management Actions */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 min-h-5">
                    {isManaging ? (
                      <div className="flex items-center gap-2 animate-in fade-in duration-200">
                        <button
                          onClick={() => alert(`Edit ${item.name}`)}
                          className="p-1 text-secondary/40 hover:text-tertiary hover:bg-secondary/5 rounded-md transition-all"
                          title="Edit Target"
                        >
                          <PencilSimple size={16} weight="bold" />
                        </button>
                        <button
                          onClick={() => alert(`Hapus ${item.name}`)}
                          className="p-1 text-secondary/40 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
                          title="Hapus Target"
                        >
                          <Trash size={16} weight="bold" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-[10px] md:text-xs font-black text-tertiary uppercase flex items-center animate-in fade-in duration-200">
                        <span className="bg-tertiary/10 px-2 py-0.5 rounded-md mr-2 sm:mr-0 sm:bg-transparent sm:px-0">
                          {Math.round(progress)}%
                        </span>
                        <span className="hidden sm:inline mx-1 text-secondary/20">
                          •
                        </span>
                        <span className="text-secondary/60 sm:text-tertiary">
                          Rp{" "}
                          {new Intl.NumberFormat("id-ID").format(item.current)}
                        </span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="h-2 md:h-2.5 w-full bg-secondary/5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-tertiary rounded-full transition-all duration-1000 ease-out shadow-[0_0_8px_rgba(30,86,205,0.4)]"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Target Info */}
                <p className="text-[8px] md:text-[10px] font-medium text-secondary/80 mt-1.5 uppercase text-right">
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
