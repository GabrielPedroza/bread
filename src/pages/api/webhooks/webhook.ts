import type { NextApiRequest, NextApiResponse } from 'next';

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
  if (req.method === 'POST') {
    const eventType = req.headers['x-github-event'];
    if (eventType !== 'issues') {
      console.log(`Webhook ignored. Unsupported event type: ${eventType as string}`);
      res.status(200).send('Webhook ignored');
      return;
    }

    const payload = req.body as IssuePayload;
    const issueTitle = payload.issue.title;
    const repositoryName = payload.repository.name;
    const issueUrl = payload.issue.html_url;

    console.log(`Webhook received for issue: ${issueTitle}`);
    console.log(`Repository: ${repositoryName}`);
    console.log(`Issue URL: ${issueUrl}`);

    res.status(200).send('Webhook received successfully');
  } else {
    res.status(405).send('Method Not Allowed');
  }
}

