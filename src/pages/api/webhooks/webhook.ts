import type { NextApiRequest, NextApiResponse } from 'next';
import * as crypto from "crypto";
import { env } from '~/env.mjs';

interface IssuePayload {
  issue: {
    html_url: string;
    title: string;
  };
  repository: {
    name: string;
  };
}

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

  if (req.method === 'POST') {
    const payload = req.body as IssuePayload;
    const issueTitle = payload.issue.title;
    const repositoryName = payload.repository.name;
    const issueUrl = payload.issue.html_url;

    console.log(`Webhook received for issue: ${issueTitle}`);
    console.log(`Repository: ${repositoryName}`);
    console.log(`Issue URL: ${issueUrl}`);

    res.status(200).send('Webhook received successfully');
  }
}