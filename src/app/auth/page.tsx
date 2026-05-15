"use client";
import AuthForm from "@/components/form/AuthForm";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AuthPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mode = searchParams.get("mode");
  const isLogin = mode !== "signup";

  const handleSetMode = (newMode: "signin" | "signup") => {
    router.push(`/auth?mode=${newMode}`);
  };

  return (
    <main className="flex min-h-screen w-full bg-white overflow-x-hidden md:max-h-screen">
      {/* Gambar: Disembunyikan di Mobile, Muncul di Desktop sebagai panel kiri */}
      <div className="hidden lg:flex flex-1 px-6 py-6 md:px-10">
        <img
          src="/assets/images/5.jpg"
          alt="Auth Image"
          className="rounded-3xl w-full h-full object-cover shadow-2xl"
        />
      </div>

      {/* Form Section: Full width di mobile, 50% di desktop */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 lg:p-20">
        <div className="w-full max-w-sm md:max-w-md">
          {/* Tombol Back: Disesuaikan ukurannya agar pas di layar kecil */}
          <button
            onClick={() => router.push("/")}
            className="font-black text-secondary hover:text-tertiary hover:cursor-pointer text-base md:text-lg flex flex-row items-center gap-2 mb-8 md:mb-10 transition-all duration-150 group"
          >
            <ArrowLeftIcon
              size={24}
              weight="bold"
              className="group-hover:-translate-x-1 transition-transform"
            />
            Back
          </button>

          <AuthForm
            mode={isLogin ? "signin" : "signup"}
            setMode={handleSetMode}
          />

          {/* Switch Login/Register: Font size disesuaikan agar tidak wrap berantakan */}
          <p className="text-center mt-8 md:mt-10 text-sm md:text-md font-bold text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                router.push(`/auth?mode=${isLogin ? "signup" : "signin"}`);
              }}
              className="text-secondary underline underline-offset-4 hover:opacity-70 transition-all font-black"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
