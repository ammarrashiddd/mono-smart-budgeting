"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

interface AuthFormData {
  username: string;
  password: string;
  confirmPassword?: string;
  agree: boolean;
}

export default function AuthForm({
  mode = "signin",
  setMode,
}: {
  mode?: "signin" | "signup";
  setMode: (mode: "signin" | "signup") => void;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<AuthFormData>({
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      agree: false,
    },
  });

  const password = watch("password");
  const router = useRouter();

  const onSubmit = () => {
    if (mode === "signin") {
      router.push("/dashboard");
    } else {
      setMode("signin");
    }
  };

  return (
    <main className="w-full max-w-md mx-auto px-2">
      {" "}
      {/* Container tambahan untuk mobile */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl md:text-3xl font-black text-secondary tracking-tighter">
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h2>
        <p className="text-gray-500 mt-2 text-sm md:text-base font-medium">
          {mode === "signin"
            ? "Welcome back! Please enter your details"
            : "Create your account to get started"}
        </p>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 md:space-y-5"
      >
        {/* Username Field */}
        <div>
          <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
            Username
          </label>
          <input
            {...register("username", { required: "Username is required" })}
            type="text"
            placeholder="Enter your username..."
            className="w-full px-4 py-3 md:py-3.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
          />
          {errors.username && (
            <p className="text-red-500 text-[10px] md:text-sm mt-1 font-bold">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password", {
                required: "Password is required",
                minLength:
                  mode === "signup"
                    ? {
                        value: 8,
                        message: "Password must be at least 8 characters long",
                      }
                    : undefined,
              })}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 md:py-3.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary transition-colors"
            >
              {showPassword ? (
                <EyeSlash size={18} weight="bold" />
              ) : (
                <Eye size={18} weight="bold" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-[10px] md:text-sm mt-1 font-bold">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* REPEAT PASSWORD FIELD */}
        {mode === "signup" && (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="block text-xs md:text-sm font-bold text-gray-700 mb-1.5 uppercase tracking-wider">
              Repeat Password
            </label>
            <div className="relative">
              <input
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === password || "Passwords do not match",
                })}
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••••••"
                className="w-full px-4 py-3 md:py-3.5 rounded-md border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-secondary transition-colors"
              >
                {showConfirmPassword ? (
                  <EyeSlash size={18} weight="bold" />
                ) : (
                  <Eye size={18} weight="bold" />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-[10px] md:text-sm mt-1 font-bold">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}

        {/* Terms Checkbox */}
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <input
              {...register("agree", {
                required: "You must agree to the terms",
              })}
              type="checkbox"
              id="agree"
              className="w-4 h-4 md:w-5 md:h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500 transition-all cursor-pointer"
            />
            <label
              htmlFor="agree"
              className="text-xs md:text-sm text-gray-600 cursor-pointer select-none"
            >
              I agree to the{" "}
              <span className="font-bold border-b-2 border-blue-500/20 text-secondary">
                Terms & Privacy
              </span>
            </label>
          </div>

          {errors.agree && (
            <p className="text-red-500 text-[10px] md:text-sm mt-1 font-bold">
              {errors.agree.message}
            </p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base font-black py-3.5 md:py-4 rounded-md shadow-xl shadow-blue-500/20 transition-all active:scale-[0.98] mt-2"
        >
          {mode === "signin" ? "Log in" : "Create Account"}
        </button>
      </form>
    </main>
  );
}
