import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

export default NextAuth(authConfig).auth;

export const config = {
  // Melindungi seluruh halaman dashboard dan API internal dari akses ilegal
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico|$).*)"],
};
