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
  eventType: string
) => {
  const scheduleSendInSeconds =
    automationAndActionByWebHookID.action.scheduleSend;

  sgMail.setApiKey(env.SEND_GRID_API_KEY);

  const msg = {
    to: automationAndActionByWebHookID.action.toEmail, // enter your email here for testing purposes
    from: "BreadForMeta@gmail.com",
    subject: automationAndActionByWebHookID.action.subject,
    text: JSON.stringify(bodyResponse),
    sendAt: Math.floor(Date.now() / 1000 + scheduleSendInSeconds * 60), // defer email in UNIX Timestamp
  };
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  sgMail.send(msg);
};
