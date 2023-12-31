import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

const createAutomationSchema = z.object({
  name: z.string(),
  desc: z.string(),
  owner: z.string(),
  repository: z.string(),
  webhookID: z.string(),
  condition: z.enum(["issues", "pull_request", "push", "star", ""]),
  actionType: z.enum(["email", ""]),

  // email event type
  toEmail: z.string().optional(),
  subject: z.string().optional(),
  scheduleSend: z.number().optional(),
});

export const automationRouter = createTRPCRouter({
  createAutomation: protectedProcedure
    .input(createAutomationSchema)
    .mutation(async ({ ctx, input }) => {
      const userID = ctx.session.user.id;

      const action = await ctx.prisma.action.create({
        data: {
          hookID: input.webhookID,
          actionType: input.actionType,
          toEmail: input.toEmail,
          subject: input.subject,
          scheduleSend: input.scheduleSend,
        },
      });

      const automation = await ctx.prisma.automation.create({
        data: {
          webhookID: input.webhookID,
          name: input.name,
          desc: input.desc,
          owner: input.owner,
          repository: input.repository,
          status: "active",
          condition: input.condition,
          action: { connect: { id: action.id } },
          createdBy: { connect: { id: userID } },
        },
      });

      return automation;
    }),

  deleteAutomation: protectedProcedure
    .input(z.object({ hookID: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userID = ctx.session.user.id;

      const automation = await ctx.prisma.automation.findFirst({
        where: {
          webhookID: input.hookID,
          createdBy: { id: userID },
        },
      });

      if (!automation) {
        return false;
      }

      await ctx.prisma.automation.delete({
        where: { id: automation.id },
      });

      await ctx.prisma.action.delete({
        where: { hookID: input.hookID },
      });
    }),

  getUserAutomations: protectedProcedure.query(async ({ ctx }) => {
    const userID = ctx.session.user.id;

    const automations = await ctx.prisma.user
      .findUnique({
        where: { id: userID },
      })
      .automations();

    return automations;
  }),
});
