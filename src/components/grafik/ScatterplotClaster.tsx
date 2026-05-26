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
  wcss: number | string;
  points: DataPoint[];
  elbow?: Array<{ k: number; wcss: number }>; // Array koordinat metode elbow dari backend
}

interface MlProps {
  data: KmeansResult | null;
  COLORS: string[];
}

export default function ScatterplotClaster({ data, COLORS }: MlProps) {
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
      const currentClusterColor = COLORS[info.cluster % COLORS.length];

      return (
        <div className="bg-white p-3 border border-secondary/10 shadow-xl rounded-lg text-xs font-medium space-y-1">
          <p className="font-black text-secondary">{info.name}</p>
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
          <p
            className="text-[9px] font-black uppercase tracking-wider mt-1"
            style={{ color: currentClusterColor }}
          >
            Klaster #{info.cluster + 1}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <main className="w-full h-full">
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 10, bottom: 0, left: -10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              type="number"
              dataKey="x"
              name="Tanggal"
              domain={[1, 31]}
              tick={{ fontSize: 10, fontWeight: "bold" }}
              stroke="#A3A3A3"
            />
            <YAxis
              type="number"
              dataKey="y"
              name="Nominal"
              tickFormatter={(val) => `${val / 1000}k`}
              tick={{ fontSize: 10, fontWeight: "bold" }}
              stroke="#A3A3A3"
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
    </main>
  );
}
