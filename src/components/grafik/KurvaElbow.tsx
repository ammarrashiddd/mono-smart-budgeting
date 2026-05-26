import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
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
}

export default function KurvaElbow({ data }: MlProps) {
  // Custom Tooltip untuk Elbow Chart
  const ElbowTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-white p-2 border border-secondary/10 shadow-md rounded text-xs">
          <p className="font-bold text-secondary">
            Jumlah Klaster (K): {dataPoint.k}
          </p>
          <p className="text-secondary/60">
            Skor WCSS:{" "}
            <span className="font-bold text-tertiary">
              {new Intl.NumberFormat("id-ID").format(dataPoint.wcss)}
            </span>
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
          <LineChart
            data={data?.elbow}
            margin={{ top: 10, right: 15, bottom: 0, left: -15 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="k"
              tick={{ fontSize: 10, fontWeight: "bold" }}
              stroke="#A3A3A3"
            />
            <YAxis
              tickFormatter={(val) => `${val}`}
              tick={{ fontSize: 9, fontWeight: "bold" }}
              stroke="#A3A3A3"
            />
            <Tooltip content={<ElbowTooltip />} />
            <Line
              type="monotone"
              dataKey="wcss"
              stroke="#F59E0B"
              strokeWidth={2.5}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
