import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CustomAreaTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1c1c1c] p-2.5 rounded-lg shadow-xl text-white text-xs font-medium border border-[#ebebeb]/10 space-y-1">
        <p className="opacity-50 text-[9px] uppercase tracking-wider mb-1">
          {payload[0].payload.name}
        </p>
        {payload.map((item: any, index: number) => (
          <div key={index} className="flex items-center gap-2 justify-between">
            <span className="flex items-center gap-1.5 opacity-80">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: item.stroke }}
              />
              {item.name}:
            </span>
            <span className="font-bold text-[#ebebeb]">
              Rp {item.value.toLocaleString("id-ID")}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

interface CashflowTrendData {
  name: string;
  pemasukan: number;
  pengeluaran: number;
}

export default function TrenPengeluaranPemasukan({
  cashflowData,
}: {
  cashflowData: CashflowTrendData[];
}) {
  return (
    // FIX 1: Ditambahkan overflow-x-auto dan scrollbar-none (opsional) agar bisa digeser ke samping di mobile
    <main className="w-full overflow-x-auto select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      {/* FIX 2: Tentukan tinggi container kaku. 
        Pada elemen ini, kita pasang min-w-[650px] (atau bisa dinaikkan ke 800px jika datanya 12 bulan penuh) 
        agar di mobile chart-nya tetap lebar dan memicu scrolling horizontal, sementara di desktop tetap lebar penuh (md:min-w-full).
      */}
      <div className="h-56 md:h-64 text-[10px] font-medium min-w-187.5 md:min-w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={cashflowData}
            margin={{ top: 10, right: 15, left: 5, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.08} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.08} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke="#ebebeb"
              opacity={0.7}
            />
            <XAxis
              dataKey="name"
              stroke="#9ca3af"
              tickLine={false}
              axisLine={false}
              dy={8}
            />
            <YAxis
              stroke="#9ca3af"
              tickLine={false}
              axisLine={false}
              dx={-5}
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  const formatted = (value / 1000000)
                    .toFixed(1)
                    .replace(".0", "");
                  return `Rp ${formatted}jt`;
                } else if (value >= 1000) {
                  const formatted = (value / 1000).toFixed(1).replace(".0", "");
                  return `Rp ${formatted}rb`;
                }
                return `Rp ${value.toLocaleString("id-ID")}`;
              }}
            />
            <Tooltip
              content={<CustomAreaTooltip />}
              cursor={{ stroke: "#1c1c1c", strokeWidth: 1, opacity: 0.1 }}
            />
            <Area
              name="Pemasukan"
              type="monotone"
              dataKey="pemasukan"
              stroke="#10b981"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fillOpacity={1}
              fill="url(#colorPemasukan)"
              dot={{ r: 3, stroke: "#10b981", strokeWidth: 1, fill: "#ffffff" }}
              activeDot={{
                r: 5,
                stroke: "#10b981",
                strokeWidth: 2,
                fill: "#ffffff",
              }}
            />
            <Area
              name="Pengeluaran"
              type="monotone"
              dataKey="pengeluaran"
              stroke="#ef4444"
              strokeWidth={2.5}
              strokeLinecap="round"
              strokeLinejoin="round"
              fillOpacity={1}
              fill="url(#colorPengeluaran)"
              dot={{ r: 3, stroke: "#ef4444", strokeWidth: 1, fill: "#ffffff" }}
              activeDot={{
                r: 5,
                stroke: "#ef4444",
                strokeWidth: 2,
                fill: "#ffffff",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
