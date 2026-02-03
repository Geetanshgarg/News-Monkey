import prisma from "@News-Monkey/db";
import { env } from "@News-Monkey/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const isProduction = env.NODE_ENV === "production";
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://news-monkey-six-rho.vercel.app",
];
export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  trustedOrigins: allowedOrigins,
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    defaultCookieAttributes: {
      // sameSite: "none" requires secure: true, which doesn't work on localhost
      // Use "lax" in development for cookies to work properly
      sameSite: isProduction ? "none" : "lax",
      secure: isProduction,
      httpOnly: true,
    },
  },
  plugins: [],
});
