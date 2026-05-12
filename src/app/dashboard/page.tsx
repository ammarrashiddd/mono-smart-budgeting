"use client";

import Navbar from "@/components/nav/Navbar";
import { WalletIcon } from "@phosphor-icons/react";

export default function DashboardPage() {
  return (
    <div className="bg-primary h-full w-full overflow-hidden">
      <div className="h-20 px-6 md:px-12 bg-tertiary flex items-center shadow-sm">
        <Navbar />
      </div>

      <h3 className="px-6 md:px-12 mt-8 text-3xl font-semibold tracking-tighter">
        Hello Ammar, Welcome Back!
      </h3>

      <div className="flex flex-row items-center gap-6 px-6 md:px-12 mt-8">
        <div className="flex-1 p-4 border-2 border-secondary rounded-xl">
          <h3 className="text-xl font-semibold flex flex-row items-center gap-2">
            <WalletIcon size={30} />
            Total Income
          </h3>
          <p className="text-5xl font-bold">Rp 100.000</p>
        </div>
        <div className="flex-1 p-4 border-2 border-secondary rounded-xl">
          <h3 className="text-xl font-semibold flex flex-row items-center gap-2">
            <WalletIcon size={30} />
            Total Expenses
          </h3>
          <p className="text-5xl font-bold">Rp 100.000</p>
        </div>
        <div className="flex-1 p-4 border-2 border-secondary rounded-xl">
          <h3 className="text-xl font-semibold flex flex-row items-center gap-2">
            Current Savings Rate
          </h3>
          <p className="text-5xl font-bold">Rp 100.000</p>
        </div>
      </div>

      <div className="flex flex-row items-center gap-6 px-6 md:px-12 mt-8">
        <div className="w-3/4 h-screen p-4 border border-secondary rounded-xl">
          Transactions Log
        </div>
        <div className="w-1/4 h-screen p-4 border border-secondary rounded-xl">
          New Transaction
        </div>
      </div>
    </div>
  );
}
