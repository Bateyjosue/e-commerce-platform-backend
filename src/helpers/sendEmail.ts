import sgMail from "@sendgrid/mail";

interface SendEmailObject {
  to: string;
  from: string;
  subject: string;
  html: string;
}
const sendEmail = async ({ to, from, subject, html }: SendEmailObject) => {
  if (typeof process.env.SENDGRID_API_KEY === "string") {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  }
  const msg = {
    to,
    from,
    subject,
    html,
  };
  try {
    await sgMail.send(msg);
    console.log("Email sent");
  } catch (error) {
    console.error(error);
  }
};

export default sendEmail;
