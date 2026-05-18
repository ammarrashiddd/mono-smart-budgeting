"use server";

import { signIn } from "@/auth";
import { prisma } from "@/lib/prisma";

import bcrypt from "bcrypt";
import { AuthError } from "next-auth";

export async function authenticate(prevState: any, formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    return { success: true, message: "Login Berhasil!" };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, message: "Username atau password salah." };
        default:
          return { success: false, message: "Terjadi kesalahan autentikasi." };
      }
    }
    throw error;
  }
}

export async function registerUser(formData: FormData) {
  try {
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;

    if (!username || !password) {
      return { success: false, message: "Semua kolom wajib diisi." };
    }

    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return { success: false, message: "Username sudah digunakan." };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { username, password: hashedPassword },
    });

    return { success: true, message: "Registrasi akun berhasil!" };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Gagal menyimpan data ke database." };
  }
}
