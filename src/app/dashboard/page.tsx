"use client";

import Navbar from "@/components/nav/Navbar";

export default function DashboardPage() {
  return (
    <div className="bg-primary h-screen">
      <div className="h-20 px-6 md:px-12 bg-tertiary flex items-center shadow-sm">
        <Navbar />
      </div>

      <h3 className="px-6 md:px-12 mt-8 text-3xl font-semibold tracking-tighter">
        Hello Ammar!
      </h3>

      <div className="px-6 md:px-12 mt-6 flex flex-row gap-4">
        <div className="w-120 h-auto bg-secondary/5 rounded-xl hover:shadow-lg">
          <h3 className="text-2xl font-semibold p-4">Summary</h3>
          <div className="px-4">
            <p className="text-lg font-semibold">Total Pemasukan: 100.000</p>
          </div>
        </div>
        <div className="flex-1">jfdbdn</div>
      </div>
    </div>
  );
}
