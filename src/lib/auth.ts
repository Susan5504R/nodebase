import { betterAuth } from "better-auth";
import { checkout, polar, portal } from "@polar-sh/better-auth";
import { polarClient } from "./polar";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/db"
if (process.env.BETTER_AUTH_URL && !process.env.BETTER_AUTH_URL.startsWith("http")) {
  process.env.BETTER_AUTH_URL = `https://${process.env.BETTER_AUTH_URL}`;
} else if (!process.env.BETTER_AUTH_URL && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
  process.env.BETTER_AUTH_URL = `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
} else if (!process.env.BETTER_AUTH_URL && process.env.VERCEL_URL) {
  process.env.BETTER_AUTH_URL = `https://${process.env.VERCEL_URL}`;
}

export const auth = betterAuth({
  database: prismaAdapter(
    prisma, {
    provider: "postgresql",
  }
  ),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  trustedOrigins: process.env.VERCEL_URL ? [
    `https://${process.env.VERCEL_URL}`,
    ...(process.env.VERCEL_BRANCH_URL ? [`https://${process.env.VERCEL_BRANCH_URL}`] : [])
  ] : [],
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "7a4354d0-4fe2-48aa-ba55-fee036fba626",
              slug: "Nodebase-Pro",
            }
          ],
          successUrl: process.env.POLAR_SUCCESS_URL,
          authenticatedUsersOnly: true,
        }),
        portal()
      ]
    }),
  ]
});
