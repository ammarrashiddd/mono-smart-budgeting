"use client";

import { SignOut, User } from "@phosphor-icons/react";
import { useState } from "react";
import { signOut } from "next-auth/react";

export default function NavDashboard() {
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  return (
    <main>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 bg-primary text-secondary px-4 md:px-5 py-2 rounded-md text-[12px] md:text-sm font-black hover:opacity-90 transition-all active:scale-95 shadow-lg shadow-primary/10"
        >
          {/* Nanti teks Ammar ini bisa kamu buat dinamis menggunakan useSession() */}
          <span className="max-w-17.5 md:max-w-none truncate">Ammar</span>
          <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
            <User size={12} weight="bold" />
          </div>
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            ></div>

            <div className="absolute right-0 mt-3 w-40 bg-white border border-gray-100 rounded-md shadow-2xl z-20 py-1 animate-in fade-in zoom-in duration-200">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 font-bold hover:bg-red-50 transition-colors text-left"
              >
                <SignOut size={18} weight="bold" />
                Logout
              </button>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
