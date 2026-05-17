import { InvoiceIcon, MoneyIcon, TrendUp, Wallet } from "@phosphor-icons/react";

export function Stats() {
  return (
    <main className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 ">
      {/* pemasukan */}
      <div className="p-4 md:p-6 rounded-lg transition-all group bg-white border border-secondary/10 hover:border-tertiary shadow-sm hover:shadow-md">
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-widest opacity-40 group-hover:opacity-100 transition-opacity truncate mr-2">
            Total Pemasukan
          </span>
          <div className="shrink-0 text-secondary/20 group-hover:text-tertiary transition-colors">
            <div className="scale-75 md:scale-100 origin-right">
              <Wallet weight="bold" className="text-tertiary" size={20} />
            </div>
          </div>
        </div>

        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-secondary tracking-tighter leading-none">
          Rp 8.500.000
        </p>
      </div>

      {/* pengeluaran */}
      <div className="p-4 md:p-6 rounded-lg transition-all group bg-white border border-secondary/10 hover:border-tertiary shadow-sm hover:shadow-md">
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-widest opacity-40 group-hover:opacity-100 transition-opacity truncate mr-2">
            Total Pengeluaran
          </span>
          <div className="shrink-0 text-secondary/20 group-hover:text-tertiary transition-colors">
            <div className="scale-75 md:scale-100 origin-right">
              <TrendUp weight="bold" className="text-red-500" size={20} />
            </div>
          </div>
        </div>

        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-secondary tracking-tighter leading-none">
          Rp 4.200.000
        </p>
      </div>

      {/* sisa saldo */}
      <div className="p-4 md:p-6 rounded-lg transition-all group bg-white border border-secondary/10 hover:border-tertiary shadow-sm hover:shadow-md">
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-widest opacity-40 group-hover:opacity-100 transition-opacity truncate mr-2">
            Sisa Saldo
          </span>
          <div className="shrink-0 text-secondary/20 group-hover:text-tertiary transition-colors">
            <div className="scale-75 md:scale-100 origin-right">
              <MoneyIcon weight="bold" className="text-tertiary" size={20} />
            </div>
          </div>
        </div>

        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-secondary tracking-tighter leading-none">
          Rp 4.300.000
        </p>
      </div>

      {/* kategori terbesar */}
      <div className="p-4 md:p-6 rounded-lg transition-all group bg-white border border-secondary/10 hover:border-tertiary shadow-sm hover:shadow-md">
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-widest opacity-40 group-hover:opacity-100 transition-opacity truncate mr-2">
            Kategori Terbesar
          </span>
          <div className="shrink-0 text-secondary/20 group-hover:text-tertiary transition-colors">
            <div className="scale-75 md:scale-100 origin-right">
              <InvoiceIcon weight="bold" className="text-tertiary" size={20} />
            </div>
          </div>
        </div>

        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-secondary tracking-tighter leading-none">
          Belanja
        </p>
      </div>
    </main>
  );
}
