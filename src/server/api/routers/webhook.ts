import { Octokit } from "@octokit/rest";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

interface GitHubAPIError {
  status: number;
}

export const webhookRouter = createTRPCRouter({
  // accessToken is optional because there can be instances where the user's session is remembered (automatically is redirected to hompage)
  // which makes the accessToken undefined since accessToken is grabbed when user is logging in (authenticating).
  // if this occurs, we use the accessToken in the DB and if that is stale, we require the user to log out and log back in.
  createWebhook: protectedProcedure
    .input(z.object({ accessToken: z.string().optional() }))
    .mutation(async ({ ctx, input }) => {
      const owner = "GabrielPedroza";
      const repo = "exotica";

      const WEBHOOK_URL = "https://hkdk.events/G3KE7hkFpr5I";
      // const WEBHOOK_URL = "https://bread-meta.vercel.app/api/webhooks/webhook";

      // grabbing DB access token
      const accessToken = await ctx.prisma.account
        .findFirst({
          where: {
            userId: ctx.session.user.id,
          },
          select: {
            access_token: true,
          },
        })
        .then((account) => account?.access_token);

      // if access token on DB is stale, update it. Not doing so will cause a 401 Error: Bad Credentials
      if (input.accessToken != undefined && input.accessToken !== accessToken) {
        await ctx.prisma.account.update({
          where: {
            userId: ctx.session.user.id,
          },
          data: {
            access_token: input.accessToken,
          },
        });
      }
      // getting authorization using accessToken to create webhook
      const octokit = new Octokit({
        auth: input.accessToken || accessToken,
      });

      let hookID = "";

      try {
        const response = await octokit.request(
          "POST /repos/{owner}/{repo}/hooks",
          {
            owner,
            repo,
            name: "web",
            active: true,
            events: ["issues", "pull_request"],
            config: {
              url: WEBHOOK_URL,
              content_type: "json",
              insecure_ssl: "0",
              secret: env.WEBHOOK_SECRET,
            },
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );

        if (response.status === 201) {
          // response.headers.location example - location: "https://api.github.com/repos/GabrielPedroza/exotica/hooks/425484562"
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const locationURL = response.headers.location!;
          const lastURLSlash = locationURL.lastIndexOf("/");
          hookID = locationURL.slice(lastURLSlash + 1);
          console.log("Webhook created successfully", hookID);
        }
      } catch (error) {
        if (isGitHubAPIError(error)) {
          // if 422: hook already exists in the repository
          if (error.status === 422) {
            return 422;
          }
        }
        // a possible error can be 401: Bad Credentials if DB accessToken is stale AND user's session is remembered.
        // We require the user to log out and log in.
        return false;
      }
      // returning hookID so automation model can grab it. occurs in src/components/FormType.tsx
      return hookID;
    }),

  deleteWebhook: protectedProcedure
    .input(z.object({ accessToken: z.string().optional(), hookID: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const owner = "GabrielPedroza";
      const repo = "exotica";

      // grabbing DB access token
      const accessToken = await ctx.prisma.account
        .findFirst({
          where: {
            userId: ctx.session.user.id,
          },
          select: {
            access_token: true,
          },
        })
        .then((account) => account?.access_token);

      // if access token on DB is stale, update it.
      if (input.accessToken != undefined && input.accessToken !== accessToken) {
        await ctx.prisma.account.update({
          where: {
            userId: ctx.session.user.id,
          },
          data: {
            access_token: input.accessToken,
          },
        });
      }

      // Getting authorization using accessToken to delete the webhook
      const octokit = new Octokit({
        auth: input.accessToken || accessToken,
      });

      try {
        const response = await octokit.request(
          "DELETE /repos/{owner}/{repo}/hooks/{hook_id}",
          {
            owner,
            repo,
            hook_id: input.hookID,
            headers: {
              "X-GitHub-Api-Version": "2022-11-28",
            },
          }
        );

        if (response.status === 204) {
          console.log("Webhook deleted successfully");
          return input.hookID;
        } else if (response.status === 404) {
          console.log("WebHook doesn't exist", response.status);
          return false;
        } else {
          console.log("log out and log back in");
          return false;
        }
      } catch (error) {
        if (isGitHubAPIError(error)) {
          console.log("Error deleting webhook:", error.status);
        }
        return false;
      }
    }),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGitHubAPIError = (error: any): error is GitHubAPIError => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return typeof error.status === "number";
};
