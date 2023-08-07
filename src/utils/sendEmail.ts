// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

import sgMail from "@sendgrid/mail";
import { env } from "~/env.mjs";

export type AutomationAndActionByWebHookIDType = {
  action: {
    toEmail: string;
    subject: string;
    actionType: string;
    scheduleSend: number;
  };
};

// CHECK SPAM WHEN EXPECTING EMAILS
export const sendEmail = (
  automationAndActionByWebHookID: AutomationAndActionByWebHookIDType,
  bodyResponse: unknown,
  eventType: "issues" | "pull_request" | "star" | "push"
) => {
  const scheduleSendInSeconds =
    automationAndActionByWebHookID.action.scheduleSend;

  let html = "";

  // Format the email content based on the event type
  if (eventType === "issues") {
    html = `
        <h1>Issue Event</h1>
        <p>Issue created or updated!</p>
        <pre>${JSON.stringify(bodyResponse, null, 2)}</pre>
      `;
  } else if (eventType === "pull_request") {
    html = `
        <h1>Pull Request Event</h1>
        <p>Pull request opened or updated!</p>
        <pre>${JSON.stringify(bodyResponse, null, 2)}</pre>
      `;
  } else if (eventType === "star") {
    html = `
        <h1>Star Event</h1>
        <p>Repository starred or removed</p>
        <pre>${JSON.stringify(bodyResponse, null, 2)}</pre>
      `;
  } else if (eventType === "push") {
    html = `
        <h1>Push Event</h1>
        <p>Code pushed to repository!</p>
        <pre>${JSON.stringify(bodyResponse, null, 2)}</pre>
      `;
  } else {
    html = `
        <h1>Unknown Event Type</h1>
        <p>Received an unknown event type</p>
        <pre>${JSON.stringify(bodyResponse, null, 2)}</pre>
      `;
  }

  sgMail.setApiKey(env.SEND_GRID_API_KEY);

  const msg = {
    to: automationAndActionByWebHookID.action.toEmail, // enter your email here for testing purposes
    from: "BreadForMeta@gmail.com",
    subject: automationAndActionByWebHookID.action.subject,
    html,
    sendAt: Math.floor(Date.now() / 1000 + scheduleSendInSeconds * 60), // defer email in UNIX Timestamp
  };
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  sgMail.send(msg);
};
