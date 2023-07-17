import { Octokit } from "@octokit/rest";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const webhookRouter = createTRPCRouter({
  createWebhook: protectedProcedure.mutation(async () => {
    const owner = "GabrielPedroza";
    const repo = "e-commerce";

    const WEBHOOK_URL = "https://bread-meta.vercel.app/api/webhooks/webhook";

    // create your own auth code here: https://github.com/settings/tokens/new?scopes=repo
    
    const octokit = new Octokit({
      auth: process.env.TEST_AUTH
    })

    try {
      const response = await octokit.request('POST /repos/{owner}/{repo}/hooks', {
        owner,
        repo,
        name: 'web',
        active: true,
        events: [
          'push',
          "issues",
          'pull_request'
        ],
        config: {
          url: WEBHOOK_URL,
          content_type: 'json',
          insecure_ssl: '0'
        },
        headers: {
          'X-GitHub-Api-Version': '2022-11-28'
        }
      })

      if (response.status === 201) {
        console.log("Webhook created successfully", response);
      } else {
        console.error("Error Status: ", response.status, response)
      }

    } catch (error) {
      console.error("Error creating webhook:", error);
    }

    return "Webhook created successfully";
  }),
});