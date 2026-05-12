"use client";
import AuthForm from "@/components/form/AuthForm";
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
    <main className="flex min-h-screen w-full bg-white overflow-hidden max-h-screen">
      <div className="hidden lg:flex flex-1 px-10 py-6">
        <img
          src="/assets/images/5.jpg"
          alt="Auth Image"
          className="rounded-3xl w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-12">
        <div className="w-full max-w-md">
          <AuthForm
            mode={isLogin ? "signin" : "signup"}
            setMode={handleSetMode}
          />

          <p className="text-center mt-8 text-md font-semibold text-gray-400">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                router.push(`/auth?mode=${isLogin ? "signup" : "signin"}`);
              }}
              className="text-secondary tex underline underline-offset-4 hover:opacity-70 transition-all"
            >
              {isLogin ? "Register" : "Login"}
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}
