import {
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DataPoint {
  id: string;
  name: string;
  x: number;
  y: number;
  cluster: number;
}

interface KmeansResult {
  k: number;
  points: DataPoint[];
}

interface MlProps {
  data: KmeansResult | null;
  COLORS: string[];
}

export default function ScatterplotClaster({ data, COLORS }: MlProps) {
  const clusterLabels: Record<number, string> = {
    0: "Hemat",
    1: "Sedang",
    2: "Boros",
  };

  // Format angka rupiah untuk tooltip grafik scatter
  const formatRupiah = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Custom Tooltip untuk Scatter Plot
  const ScatterTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const info = payload[0].payload;
      const clusterName =
        clusterLabels[info.cluster] ?? `Cluster ${info.cluster}`;

      return (
        <div className="bg-white p-3 border border-secondary/10 shadow-xl rounded-lg text-xs font-medium space-y-1">
          <p className="font-black text-secondary">{info.name}</p>
          <p className="text-secondary/60">
            Kategori:{" "}
            <span className="text-secondary font-bold">{clusterName}</span>
          </p>
          <p className="text-secondary/60">
            Tanggal Pengambilan:{" "}
            <span className="text-secondary font-bold">{info.x}</span>
          </p>
          <p className="text-secondary/60">
            Nominal:{" "}
            <span className="text-secondary font-bold">
              {formatRupiah(info.y)}
            </span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="w-full overflow-x-auto select-none [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] scrollbar-none">
      <div className="h-56 md:h-64 text-[10px] font-medium min-w-187.5 md:min-w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              dataKey="x"
              name="Tanggal"
              domain={[1, 31]}
              ticks={Array.from({ length: 31 }, (_, i) => i + 1)}
              tick={{ fontSize: 10, fontWeight: "bold" }}
              interval={0}
              stroke="#A3A3A3"
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Nominal"
              tick={{ fontSize: 10, fontWeight: "bold" }}
              stroke="#A3A3A3"
              tickFormatter={(value) => {
                if (value >= 1000000) {
                  const formatted = (value / 1000000)
                    .toFixed(1)
                    .replace(".0", "");
                  return `${formatted}jt`;
                } else if (value >= 1000) {
                  const formatted = (value / 1000).toFixed(1).replace(".0", "");
                  return `${formatted}rb`;
                }
                return `${value.toLocaleString("id-ID")}`;
              }}
            />
            <Tooltip content={<ScatterTooltip />} />
            <Scatter name="Transaksi" data={data?.points}>
              {data?.points.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[entry.cluster % COLORS.length]}
                  radius={4}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3 md:gap-5">
        {Object.entries(clusterLabels).map(([cluster, label]) => (
          <div key={cluster} className="flex items-center gap-2">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: COLORS[Number(cluster) % COLORS.length],
              }}
            />
            <span className="text-[10px] md:text-xs font-bold text-secondary">
              {label}
            </span>
          </div>
        ))}
      </div>
    </main>
  );
}
