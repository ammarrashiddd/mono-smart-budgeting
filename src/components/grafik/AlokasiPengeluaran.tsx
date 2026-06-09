import { useState } from "react";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

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
  isCurrentMonth: boolean;
}

const MINIMALIST_COLORS = [
  "#5D5FEF",
  "#339AF0",
  "#20C997",
  "#FAB005",
  "#FF6B6B",
  "#F06595",
  "#845EF7",
  "#22B8CF",
  "#51CF66",
  "#FF922B",
  "#AE3EC9",
  "#868E96",
];

export default function AlokasiPengeluaran({
  categoryData,
  isMobile,
}: {
  categoryData: CategoryData[];
  isMobile: boolean;
}) {
  const [filter, setFilter] = useState<"all" | "month">("month");

  // FIX LOGIKA FILTER: Memisahkan secara mutlak agar tidak ada duplikasi kategori
  const filteredData = categoryData.filter((item) => {
    if (filter === "month") {
      return item.isCurrentMonth === true;
    } else {
      return item.isCurrentMonth === false; // "all" mengambil rekap total tahunan dari backend
    }
  });

  return (
    <main className="w-full h-full flex flex-col">
      {/* Header & Filter Control */}
      <div className="flex items-center justify-between w-full mb-1">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as "all" | "month")}
          className="bg-transparent text-[11px] font-semibold text-[#1c1c1c] border border-[#ebebeb] rounded-md py-1 px-2 cursor-pointer focus:outline-none"
        >
          <option value="month">Bulan Ini</option>
          <option value="all">Semua Riwayat</option>
        </select>
      </div>

      {/* Container Grafik */}
      <div className="w-full flex-1 min-h-52">
        {filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                // Menaikkan grafik ke atas (dari 42% ke 35%) agar ruang bawah lebih luas
                cy={isMobile ? "35%" : "45%"}
                // Memperkecil sedikit radius lingkaran khusus mobile
                innerRadius={isMobile ? 38 : 60}
                outerRadius={isMobile ? 52 : 78}
                paddingAngle={3}
                dataKey="value"
              >
                {filteredData.map((entry: any, index: number) => (
                  <Cell
                    key={`cell-${index}`}
                    // Menggunakan indeks dari filteredData yang bersih dari duplikasi
                    fill={MINIMALIST_COLORS[index % MINIMALIST_COLORS.length]}
                    stroke="#ffffff"
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
                  fontSize: "9px", // Sedikit diperkecil dari 10px ke 9px untuk mobile
                  position: "absolute",
                  bottom: 0, // Jangan gunakan minus agar tidak offside keluar container
                  left: 0,
                  right: 0,
                  maxHeight: isMobile ? "50px" : "70px", // Batasi tinggi maksimal legend
                  overflowY: "auto", // Aktifkan scrollbar vertikal jika kategori terlalu banyak
                  paddingTop: "4px",
                  lineHeight: "14px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs opacity-40">
            Tidak ada data pengeluaran
          </div>
        )}
      </div>
    </main>
  );
}
