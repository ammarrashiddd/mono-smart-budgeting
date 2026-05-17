"use client";

import Navbar from "@/components/nav/Navbar";
import Ai from "@/components/ui/dashboard/Ai";
import Goals from "@/components/ui/dashboard/Goals";
import Ml from "@/components/ui/dashboard/Ml";
import { Stats } from "@/components/ui/dashboard/Stats";
import Transactions from "@/components/ui/dashboard/Transactions";

export default function DashboardPage() {
  return (
    <main className="bg-primary min-h-screen w-full pb-10  text-secondary overflow-x-hidden no-scrollbar">
      <nav className="h-16 md:h-20 px-4 md:px-12 bg-tertiary flex items-center border-b border-tertiary/10 shadow-sm sticky top-0 z-50">
        <Navbar />
      </nav>

      <header className="px-4 md:px-12 mt-6 md:mt-10">
        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tighter text-secondary leading-tight">
          Hello Ammar, <br className="block sm:hidden" /> Welcome Back!
        </h3>
      </header>

      {/* --- Section 1: Stats (Responsive Grid) --- */}
      <div className="px-4 md:px-12 mt-6 md:mt-12">
        <Stats />
      </div>

      {/* --- Section 2: Goals (Responsive List) --- */}
      <div className="px-4 md:px-12 mt-10 md:mt-16">
        <Goals />
      </div>

      {/* --- Section 3: Transaction History */}
      <div className="px-4 md:px-12 mt-10 md:mt-16">
        <Transactions />
      </div>

      {/* --- Section 4: Machine Learning Visualization */}
      <div className="px-4 md:px-12 mt-10 md:mt-16">
        <Ml />
      </div>

      {/* --- Section 5: AI Strategy Analysis */}
      <div className="px-4 md:px-12 mt-10 md:mt-16">
        <Ai />
      </div>
    </main>
  );
}
