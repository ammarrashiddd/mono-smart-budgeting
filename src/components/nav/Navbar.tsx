"use client";

import { useRouter } from "next/navigation";

export default function Navbar() {
  const Router = useRouter();
  return (
    <main className="flex items-center justify-between w-full">
      <h1 className="text-primary text-3xl md:text-4xl font-black tracking-tighter">
        MONO.
      </h1>
      <div className="flex gap-2 md:gap-4">
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
      </div>
    </main>
  );
}
