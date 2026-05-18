import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/auth", // Mengarahkan ke halaman login kustom milikmu
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard");

      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; // Tendang user yang belum login ke halaman login
      } else if (isLoggedIn && nextUrl.pathname.startsWith("/auth")) {
        return Response.redirect(new URL("/dashboard", nextUrl)); // Jika sudah login, dilarang masuk ke form login lagi
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        if ("username" in user) {
          token.username = user.username;
        }
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        if ("username" in token) {
          (session.user as any).username = token.username as string;
        }
      }
      return session;
    },
  },
  providers: [], // Diisi di file auth.ts utama
  secret: process.env.NEXTAUTH_SECRET ?? process.env.BETTER_AUTH_SECRET,
} satisfies NextAuthConfig;
