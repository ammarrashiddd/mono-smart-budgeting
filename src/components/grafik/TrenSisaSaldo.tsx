import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

// Custom Tooltip Minimalis untuk Tren Saldo
const CustomAreaTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1c1c1c] p-2.5 rounded-lg shadow-xl text-white text-xs font-medium border border-[#ebebeb]/10">
        <p className="opacity-50 text-[9px] uppercase tracking-wider mb-0.5 ">
          {payload[0].payload.name}
        </p>
        <p className="font-bold text-[#ebebeb]">
          Rp {payload[0].value.toLocaleString("id-ID")}
        </p>
      </div>
    );
  }
  return null;
};

interface BalanceTrendData {
  name: string;
  saldo: number;
}

export default function TrenSisaSaldo({
  balanceTrendData,
}: {
  balanceTrendData: BalanceTrendData[];
}) {
  return (
    <main>
      <div className="w-full h-56 md:h-64 text-[10px] font-medium">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={balanceTrendData}
            margin={{ top: 10, right: 5, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient
                id="colorSaldoMinimal"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                {/* Menggunakan --color3 (#1e56cd) sebagai base area dengan opacity sangat soft */}
                <stop offset="5%" stopColor="#1e56cd" stopOpacity={0.08} />
                <stop offset="95%" stopColor="#1e56cd" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke="#ebebeb" /* --color1 untuk gridline minimalis */
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
              tickFormatter={(value) =>
                value >= 1000000
                  ? `${(value / 1000000).toFixed(1).replace(".0", "")}M`
                  : value.toLocaleString("id-ID")
              }
            />
            <Tooltip
              content={<CustomAreaTooltip />}
              cursor={{ stroke: "#1c1c1c", strokeWidth: 1, opacity: 0.2 }}
            />
            <Area
              name="Total Saldo"
              type="monotone"
              dataKey="saldo"
              stroke="#1e56cd" /* --color3 untuk garis tren utama */
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorSaldoMinimal)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
