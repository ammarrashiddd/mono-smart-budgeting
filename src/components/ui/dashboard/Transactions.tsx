import { PencilSimple, Trash } from "@phosphor-icons/react";
import { useState } from "react";

export default function TransactionHistory() {
  const transactions = [
    {
      id: 1,
      name: "Starbucks Coffee",
      date: "15 May 2026",
      category: "Lifestyle",
      amount: 55000,
      type: "expense",
    },
    {
      id: 2,
      name: "Listrik & Air",
      date: "05 May 2026",
      category: "Bills",
      amount: 450000,
      type: "expense",
    },
    {
      id: 3,
      name: "Subscription Netflix",
      date: "10 May 2026",
      category: "Entertainment",
      amount: 186000,
      type: "expense",
    },
    {
      id: 4,
      name: "Subscription Netflix",
      date: "10 May 2026",
      category: "Entertainment",
      amount: 186000,
      type: "income",
    },
  ];

  const [isManaging, setIsManaging] = useState(false);

  return (
    <main>
      <div className="bg-white rounded-lg p-6 md:p-10 border border-secondary/5 shadow-xl shadow-secondary/5">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <h3 className="text-xs md:text-base font-black uppercase text-secondary">
              Transaksi
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
            className={`text-${isManaging ? "red-500" : "tertiary"} text-xs md:text-base font-black uppercase hover:underline transition-all whitespace-nowrap`}
          >
            {isManaging ? "Selesai" : "Kelola Transaksi"}
          </button>
        </div>

        <div className="space-y-4">
          {transactions.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 md:p-4 rounded-xl hover:bg-secondary/2 transition-all border border-transparent hover:border-secondary/50"
            >
              <div className="flex items-center gap-3 md:gap-4">
                {/* Info */}
                <div className="max-w-30 sm:max-w-none">
                  <p className="text-sm md:text-base font-bold text-secondary tracking-tight truncate">
                    {item.name}
                  </p>
                  <div className="mt-0.5">
                    <span className="text-[8px] md:text-[9px] font-medium text-secondary/30 hidden sm:block">
                      {item.date}
                    </span>
                  </div>
                </div>
              </div>

              {isManaging ? (
                <div className="flex items-center gap-2 animate-in fade-in duration-200">
                  <button
                    onClick={() => alert(`Edit ${item.name}`)}
                    className="p-1 text-secondary/40 hover:text-tertiary hover:bg-secondary/5 rounded-md transition-all cursor-pointer"
                    title="Edit Transaksi"
                  >
                    <PencilSimple size={16} weight="bold" />
                  </button>
                  <button
                    onClick={() => alert(`Hapus ${item.name}`)}
                    className="p-1 text-secondary/40 hover:text-red-500 hover:bg-red-50 rounded-md transition-all cursor-pointer"
                    title="Hapus Transaksi"
                  >
                    <Trash size={16} weight="bold" />
                  </button>
                </div>
              ) : (
                <div className="text-right">
                  <p
                    className={`text-sm md:text-lg font-black tracking-tighter ${
                      item.type === "income" ? "text-green-600" : "text-red-500"
                    }`}
                  >
                    {item.type === "income" ? "+" : "-"}
                    {new Intl.NumberFormat("id-ID").format(item.amount)}
                  </p>
                  <p className="text-[8px] md:text-[9px] font-bold text-secondary/80 uppercase tracking-widest">
                    IDR
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
