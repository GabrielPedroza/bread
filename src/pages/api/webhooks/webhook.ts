import type { NextApiRequest, NextApiResponse } from "next";
import * as crypto from "crypto";
import { env } from "~/env.mjs";
import {
  type AutomationAndActionByWebHookIDType,
  sendEmail,
} from "~/utils/sendEmail";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const receivedDeliveryIds = new Set();

export default async function webhooksHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const verify_signature = (req: NextApiRequest) => {
    const signature = crypto
      .createHmac("sha256", env.WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");
    return `sha256=${signature}` === req.headers["x-hub-signature-256"];
  };

  if (!verify_signature(req)) {
    res.status(401).send("Unauthorized");
    return;
  }

  const deliveryId = req.headers["x-github-delivery"];

  type eventActionType = "push" | "issues" | "pull_request" | "star" | "ping"

  // eventType is guaranteed to be a string because with how ruleset form is set up, it only listens to one event. it will never be undefined
  const eventType = req.headers["x-github-event"] as eventActionType;
  // GitHubWebHookID is guaranteed to be a string because the hook is tied to one event (even when multiple hooks are in one repo). it will never be undefined
  const GitHubWebHookID = req.headers["x-github-hook-id"] as string;

  // checks for duplicate webhooks
  if (receivedDeliveryIds.has(deliveryId)) {
    res.status(202).send("Duplicate webhook received, no action needed");
    return;
  }

  // checks for initial response from github when webhook is first created
  if (eventType === "ping") {
    res.status(200).send("Webhook ping received successfully");
    return;
  }

  if (req.method === "POST") {
    const automationAndActionByWebHookID = await fetchUserAutomationByHookID(
      GitHubWebHookID
    );
    if (automationAndActionByWebHookID?.action.actionType === "email") {
      // Action model in DB is denormalized which makes toEmail, subject, etc... optional. If actionType is email, the toEmail, subject, etc... are not null/undefined
      sendEmail(
        automationAndActionByWebHookID as AutomationAndActionByWebHookIDType,
        req.body,
        eventType
      );
    }
    res.status(200).send("Webhook received successfully");

    receivedDeliveryIds.add(deliveryId);

    setTimeout(() => {
      receivedDeliveryIds.delete(deliveryId);
    }, 3_600_000); // one hour
  }
}

async function fetchUserAutomationByHookID(WebhookID: string) {
  try {
    const userAutomation = await prisma.automation.findFirst({
      where: {
        webhookID: WebhookID,
      },
      select: {
        action: {
          select: {
            toEmail: true,
            subject: true,
            actionType: true,
            scheduleSend: true,
          },
        },
      },
    });
    return userAutomation;
  } finally {
    await prisma.$disconnect();
  }
}
