// using Twilio SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs

import sgMail from "@sendgrid/mail";
import { env } from "~/env.mjs";

// CHECK SPAM WHEN EXPECTING EMAILS
export const sendEmail = () => {
  sgMail.setApiKey(env.SEND_GRID_API_KEY);

  // info here will be grabbed from params that contain user's info from automation
  const msg = {
    to: "gabrielpedroza2002167@gmail.com", // enter your email here for testing purposes
    from: "BreadForMeta@gmail.com",
    subject: "Sending with SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: "<strong>and easy to do anywhere, even with Node.js</strong>",
  };

  sgMail.send(msg)
};
