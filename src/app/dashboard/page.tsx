"use client";

import { useState } from "react";
import Navbar from "@/components/nav/Navbar";
import Ai from "@/components/ui/dashboard/Ai";
import Goals from "@/components/ui/dashboard/Goals";
import Ml from "@/components/ui/dashboard/Ml";
import { Stats } from "@/components/ui/dashboard/Stats";
import Transactions from "@/components/ui/dashboard/Transactions";
import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const username = session?.user?.name;
  const [statsRefreshKey, setStatsRefreshKey] = useState(0);

  return (
    <main className="bg-primary min-h-screen w-full pb-10  text-secondary overflow-x-hidden no-scrollbar">
      {/* navbar */}
      <nav className="h-16 md:h-20 px-4 md:px-12 bg-tertiary flex items-center border-b border-tertiary/10 shadow-sm sticky top-0 z-50">
        <Navbar name={username} />
      </nav>

      {/* header */}
      <header className="px-4 md:px-12 mt-6 md:mt-10">
        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold tracking-tighter text-secondary leading-tight capitalize">
          Hello {username}, <br className="block sm:hidden" /> Welcome Back!
        </h3>
      </header>

      {/* --- Section 1: Stats (Responsive Grid) --- */}
      <div className="px-4 md:px-12 mt-6 md:mt-10">
        <Stats refreshKey={statsRefreshKey} />
      </div>

      {/* --- Section 2: Goals (Responsive List) --- */}
      <div className="px-4 md:px-12 mt-6 md:mt-10">
        <Goals />
      </div>

      {/* --- Section 3: Transaction History */}
      <div className="px-4 md:px-12 mt-6 md:mt-10">
        <Transactions
          onTransactionChange={() => setStatsRefreshKey((prev) => prev + 1)}
        />
      </div>

      {/* --- Section 4: Machine Learning Visualization */}
      <div className="px-4 md:px-12 mt-6 md:mt-10">
        <Ml />
      </div>

      {/* --- Section 5: AI Strategy Analysis */}
      <div className="px-4 md:px-12 mt-6 md:mt-10">
        <Ai />
      </div>
    </main>
  );
}
