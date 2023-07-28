import { createTRPCRouter } from "~/server/api/trpc";
import { webhookRouter } from "./routers/webhook";
import { automationRouter } from "./routers/automation";

export const appRouter = createTRPCRouter({
  webhook: webhookRouter,
  automation: automationRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
