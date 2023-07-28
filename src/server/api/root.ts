import { createTRPCRouter } from "~/server/api/trpc";
import { webhookRouter } from "./routers/webhook";
import { automationRouter } from "./routers/automation";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  webhook: webhookRouter,
  automation: automationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
