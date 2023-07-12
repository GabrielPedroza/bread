import { NextApiRequest, NextApiResponse } from 'next';
import { Octokit } from '@octokit/rest';

export default async function webhooksHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const octokit = new Octokit();

    const eventType = req.headers['x-github-event'];
    if (eventType !== 'issues') {
      console.log(`Webhook ignored. Unsupported event type: ${eventType}`);
      res.status(200).send('Webhook ignored');
      return;
    }

    const payload = req.body;
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
