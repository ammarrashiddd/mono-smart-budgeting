"use client";

import { useForm } from "react-hook-form";
import { useState } from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react"; // Pastikan nama icon benar
import { useRouter } from "next/navigation";

interface AuthFormData {
  username: string;
  password: string;
  confirmPassword?: string; // Opsional karena hanya ada di sign up
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
    watch, // Digunakan untuk memvalidasi repeat password
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

  const onSubmit = (data: AuthFormData) => {
    console.log("Form Data:", data);
    // Simulasi proses autentikasi
    setTimeout(() => {
      alert(
        mode === "signin"
          ? "Successfully signed in!"
          : "Account created successfully!",
      );
      if (mode === "signup") {
        setMode("signin");
      } else if (mode === "signin") {
        router.push("/dashboard");
      }
    }, 1000);
  };

  return (
    <main className="w-full">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-secondary">
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </h2>
        <p className="text-gray-500 mt-2">
          {mode === "signin"
            ? "Welcome back! Please enter your details"
            : "Create your account to get started"}
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Username
          </label>
          <input
            {...register("username", { required: "Username is required" })}
            type="text"
            placeholder="Enter your username..."
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">
              {errors.username.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <input
              {...register("password", { required: "Password is required" })}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <EyeSlash size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* REPEAT PASSWORD FIELD (Hanya muncul jika mode === 'signup') */}
        {mode === "signup" && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
              >
                {showConfirmPassword ? (
                  <EyeSlash size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        )}

        {/* Terms Checkbox */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <input
              {...register("agree", {
                required: "You must agree to the terms",
              })}
              type="checkbox"
              id="agree"
              className="w-4 h-4 rounded text-blue-600"
            />
            <label htmlFor="agree" className="text-sm text-gray-600">
              I agree to the{" "}
              <span className="font-semibold border-b">Terms & Privacy</span>
            </label>
          </div>

          {errors.agree && (
            <p className="text-red-500 text-sm mt-1">{errors.agree.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-lg transition-all"
        >
          {mode === "signin" ? "Log in" : "Create Account"}
        </button>
      </form>
    </main>
  );
}
