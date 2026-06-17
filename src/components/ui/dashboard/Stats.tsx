import { InvoiceIcon, MoneyIcon, TrendUp, Wallet } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

interface StatsData {
  totalPemasukan: number;
  totalPengeluaran: number;
  sisaSaldo: number;
}

interface StatsProps {
  refreshKey?: number;
}

export function Stats({ refreshKey }: StatsProps) {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/stats", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        } else {
          console.error("Stats API tidak berhasil:", response.status);
        }
      } catch (error) {
        console.error("Gagal memuat data statistik:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [refreshKey]);

  // Format angka ke Rupiah (Rp)
  const formatRupiah = (num: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(num);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="bg-white/50 h-32 rounded-2xl border border-secondary/5"
          />
        ))}
      </div>
    );
  }

  return (
    <main className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 ">
      {/* pemasukan */}
      <div className="p-4 md:p-6 rounded-lg transition-all group bg-white border border-secondary/10 hover:border-tertiary shadow-sm hover:shadow-md">
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-widest opacity-40 group-hover:opacity-100 transition-opacity truncate mr-2">
            Uang Masuk
          </span>
          <div className="shrink-0 text-secondary/20 group-hover:text-tertiary transition-colors">
            <div className="scale-75 md:scale-100 origin-right">
              <Wallet weight="bold" className="text-tertiary" size={20} />
            </div>
          </div>
        </div>

        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-secondary tracking-tighter leading-none">
          {formatRupiah(stats?.totalPemasukan ?? 0)}
        </p>
      </div>

      {/* pengeluaran */}
      <div className="p-4 md:p-6 rounded-lg transition-all group bg-white border border-secondary/10 hover:border-tertiary shadow-sm hover:shadow-md">
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-widest opacity-40 group-hover:opacity-100 transition-opacity truncate mr-2">
            Uang Keluar
          </span>
          <div className="shrink-0 text-secondary/20 group-hover:text-tertiary transition-colors">
            <div className="scale-75 md:scale-100 origin-right">
              <TrendUp weight="bold" className="text-red-500" size={20} />
            </div>
          </div>
        </div>

        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-secondary tracking-tighter leading-none">
          {formatRupiah(stats?.totalPengeluaran ?? 0)}
        </p>
      </div>

      {/* sisa saldo */}
      <div className="p-4 md:p-6 rounded-lg transition-all group bg-white border border-secondary/10 hover:border-tertiary shadow-sm hover:shadow-md">
        <div className="flex items-center justify-between mb-2 md:mb-4">
          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] md:tracking-widest opacity-40 group-hover:opacity-100 transition-opacity truncate mr-2">
            Sisa Uang
          </span>
          <div className="shrink-0 text-secondary/20 group-hover:text-tertiary transition-colors">
            <div className="scale-75 md:scale-100 origin-right">
              <MoneyIcon weight="bold" className="text-tertiary" size={20} />
            </div>
          </div>
        </div>

        <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-black text-secondary tracking-tighter leading-none">
          {formatRupiah(stats?.sisaSaldo ?? 0)}
        </p>
      </div>
    </main>
  );
}
