import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

// Custom Tooltip Minimalis untuk Distribusi Kategori
const CustomPieTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1c1c1c] p-2.5 rounded-lg shadow-xl text-white text-xs font-medium border border-[#ebebeb]/10">
        <p
          className="font-bold"
          style={{
            color:
              payload[0].payload.fill === "#1c1c1c"
                ? "#ebebeb"
                : payload[0].payload.fill,
          }}
        >
          {payload[0].name}
        </p>
        <p className="text-[11px] opacity-80 mt-0.5">
          Rp {payload[0].value.toLocaleString("id-ID")}
        </p>
      </div>
    );
  }
  return null;
};

interface CategoryData {
  name: string;
  value: number;
}

// palet warna
const MINIMALIST_COLORS = [
  "#5D5FEF", // Indigo Soft
  "#339AF0", // Blue Soft
  "#20C997", // Teal Soft
  "#FAB005", // Amber Soft (Cukup gelap agar kontras di putih)
  "#FF6B6B", // Red Soft
  "#F06595", // Pink Soft
  "#845EF7", // Purple Soft
  "#22B8CF", // Cyan Soft
  "#51CF66", // Green Soft
  "#FF922B", // Orange Soft
  "#AE3EC9", // Fuchsia Soft
  "#868E96", // Slate Soft (Pem優 pemisah netral)
];

export default function AlokasiPengeluaran({
  categoryData,
  isMobile,
}: {
  categoryData: CategoryData[];
  isMobile: boolean;
}) {
  return (
    <main className="w-full h-full">
      <div className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy={isMobile ? "42%" : "45%"}
              innerRadius={isMobile ? 48 : 60}
              outerRadius={isMobile ? 64 : 78}
              paddingAngle={3} // Celah minimalis antar segmen
              dataKey="value"
            >
              {categoryData.map((entry: any, index: number) => (
                <Cell
                  key={`cell-${index}`}
                  fill={MINIMALIST_COLORS[index % MINIMALIST_COLORS.length]} // Loop 15 warna minimalis
                  stroke="#white"
                  strokeWidth={1.5}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomPieTooltip />} />
            <Legend
              layout="horizontal"
              verticalAlign="bottom"
              align="center"
              iconSize={6}
              iconType="circle"
              wrapperStyle={{
                fontSize: "10px",
                bottom: -5,
                left: 0,
                right: 0,
                maxHeight: isMobile ? "45px" : "55px",
                overflowY: "auto",
                paddingTop: "2px",
                color: "#1c1c1c" /* --color2 */,
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </main>
  );
}
