import prisma from "@News-Monkey/db";
import { env } from "@News-Monkey/env/server";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

const isProduction = env.NODE_ENV === "production";
const allowedOrigins = [
  "http://localhost:3001",
  "http://localhost:5173",
  "https://typenews.in",
  "https://www.typenews.in",
  "https://news-monkey.vercel.app", // keep this too
];

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),

  baseURL: env.BETTER_AUTH_URL, // Explicitly set the base URL for auth
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
