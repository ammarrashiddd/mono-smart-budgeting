"use client";

import { SignOut, User } from "@phosphor-icons/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const Router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isDashboard = pathname.startsWith("/dashboard");

  const handleLogout = () => {
    Router.push("/");
  };

  return (
    <main className="flex items-center justify-between w-full">
      <h1 className="text-primary text-3xl md:text-4xl font-black tracking-tighter">
        MONO.
      </h1>
      <div className="flex gap-2 md:gap-4">
        {isDashboard ? (
          <>
            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 bg-primary text-secondary px-5 py-2 rounded-full text-sm font-bold hover:opacity-90 transition-all active:scale-95"
              >
                Ammar
                <div className="w-5 h-5 rounded-full bg-secondary/20 flex items-center justify-center">
                  <User size={14} weight="bold" />
                </div>
              </button>

              {/* Dropdown Logout */}
              {isOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setIsOpen(false)}
                  ></div>

                  <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-100 rounded-2xl shadow-xl z-20 py-2 animate-in fade-in zoom-in duration-200">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 font-bold hover:bg-red-50 transition-colors text-left"
                    >
                      <SignOut size={18} weight="bold" />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        ) : (
          <>
            <button
              className="text-primary font-bold px-4 py-2 hover:bg-primary/10 rounded-full transition-all text-sm md:text-base"
              onClick={() => {
                Router.push("/auth?mode=signin");
              }}
            >
              Sign In
            </button>
            <button
              className="bg-primary text-secondary font-bold px-5 py-2 rounded-full hover:scale-105 active:scale-95 transition-all text-sm md:text-base"
              onClick={() => {
                Router.push("/auth?mode=signup");
              }}
            >
              Get started
            </button>
          </>
        )}
      </div>
    </main>
  );
}
