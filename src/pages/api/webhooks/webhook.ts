import type { NextApiRequest, NextApiResponse } from "next";
import * as crypto from "crypto";
import { env } from "~/env.mjs";
import { sendEmail } from "~/utils/sendEmail";

const receivedDeliveryIds = new Set();

export default function webhooksHandler(
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
  const eventType = req.headers["x-github-event"];

  // checks for duplicate webhooks
  if (receivedDeliveryIds.has(deliveryId)) {
    res.status(202).send("Duplicate webhook received, no action needed");
    return;
  }

  // checks for initial response from github when webhook is first created
  if (eventType === "ping") {
    console.log("Ping event received: ", deliveryId);
    res.status(200).send("Webhook ping received successfully");
    return;
  }

  if (req.method === "POST") {
    sendEmail();
    console.log("Webhook received!");
    res.status(200).send("Webhook received successfully");

    receivedDeliveryIds.add(deliveryId);

    setTimeout(() => {
      receivedDeliveryIds.delete(deliveryId);
    }, 3_600_000); // one hour
  }
  console.log(receivedDeliveryIds);
}
