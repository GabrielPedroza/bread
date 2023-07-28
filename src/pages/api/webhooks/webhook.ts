import type { NextApiRequest, NextApiResponse } from "next";
import * as crypto from "crypto";
import { env } from "~/env.mjs";

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

  if (req.method === "POST") {
    console.log("webhook received: ", req.headers["x-github-hook-id"]);
    res.status(200).send("Webhook received successfully");
  }
}
