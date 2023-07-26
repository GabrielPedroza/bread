// // utils/sendEmail.ts
// import nodemailer from "nodemailer";
// import sgTransport from "nodemailer-sendgrid-transport";

// interface EmailOptions {
//   to: string;
//   subject: string;
//   htmlContent: string;
// }

// // Function to send an email
// async function sendEmail(options: EmailOptions): Promise<void> {
//   try {
//     // Create a nodemailer transporter using SendGrid
//     const transporter = nodemailer.createTransport(
//       sgTransport({
//         auth: {
//           api_key: "YOUR_SENDGRID_API_KEY", // Replace with your SendGrid API key
//         },
//       })
//     );

//     // Email options
//     const mailOptions = {
//       from: "sender@example.com", // Replace with your email address
//       ...options,
//     };

//     // Send the email
//     const info = await transporter.sendMail(mailOptions);

//     console.log("Email sent:", info);
//   } catch (error) {
//     console.error("Error sending email:", error);
//   }
// }

// export default sendEmail;
