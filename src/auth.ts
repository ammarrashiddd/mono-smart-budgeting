import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import bcrypt from "bcrypt";
import { z } from "zod";
import { prisma } from "./lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // Validasi struktur input menggunakan Zod
        const parsedCredentials = z
          .object({ username: z.string(), password: z.string() })
          .safeParse(credentials);

        if (!parsedCredentials.success) return null;

        const { username, password } = parsedCredentials.data;

        // 1. Cari user di PostgreSQL lokal
        const user = await prisma.user.findUnique({
          where: { username },
        });

        if (!user) return null;

        // 2. Cocokkan password terenkripsi
        const passwordsMatch = await bcrypt.compare(password, user.password);

        if (passwordsMatch) {
          return {
            id: user.id,
            username: user.username,
            name: user.username,
          };
        }

        return null;
      },
    }),
  ],
});
