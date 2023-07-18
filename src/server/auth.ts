import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  User,
} from "next-auth";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      accessToken: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    accessToken: string;
    // ...other properties
    // role: UserRole;
  }
}

interface UserWithAccessToken extends User {
  tokens: {
    access_token: string;
  };
}

let profileWithAccessToken: UserWithAccessToken;

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: async ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          accessToken: profileWithAccessToken?.tokens.access_token,
        },
      };
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: env.GITHUB_CLIENT,
      clientSecret: env.GITHUB_SECRET,
      authorization: {
        params: {
          scope: "repo"
        }
      },
      profile: (profile, tokens) => {
        if (tokens) {
          profileWithAccessToken = { ...profile, tokens }
        }
        return profileWithAccessToken;
      },
    }),
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT,
      clientSecret: env.GOOGLE_SECRET
    })
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
  secret: env.JWT_SECRET
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
