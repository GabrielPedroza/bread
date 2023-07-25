import { Octokit } from "@octokit/rest";
import { z } from "zod";
import { env } from "~/env.mjs";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const webhookRouter = createTRPCRouter({
  createWebhook: protectedProcedure.input(z.object({ accessToken: z.string()})).mutation(async ({ input }) => {
    const owner = "GabrielPedroza";
    const repo = "exotica";

    const WEBHOOK_URL = "https://hkdk.events/G3KE7hkFpr5I";
    // const WEBHOOK_URL = "https://bread-meta.vercel.app/api/webhooks/webhook";
    
    const octokit = new Octokit({
      auth: input.accessToken
    })

    try {
      const response = await octokit.request('POST /repos/{owner}/{repo}/hooks', {
        owner,
        repo,
        name: 'web',
        active: true,
        events: [
          "issues",
          'pull_request'
        ],
        config: {
          url: WEBHOOK_URL,
          content_type: 'json',
          insecure_ssl: '0',
          secret: env.WEBHOOK_SECRET
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })

      if (response.status === 201) {
        // response.headers.location example - location: 'https://api.github.com/repos/GabrielPedroza/exotica/hooks/425484562'
        const locationURL = response.headers.location!
        const lastURLSlash = locationURL.lastIndexOf("/")
        const hookID = locationURL.slice(lastURLSlash + 1)
        console.log("Webhook created successfully", hookID);
      } else {
        console.error("Error Status: ", response.status, response)
      }

    } catch (error) {
      console.error("Error creating webhook:", error);
      return false
    }

    return true
  }),
});