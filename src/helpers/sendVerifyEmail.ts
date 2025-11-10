import generateVerifyEmailHTML, { GenerateVerify } from "./emailContent";
import sendEmail from "./sendEmail";

const sendVerifyEmail = async ({
  username,
  email,
  originUrl,
  verificationToken,
}: GenerateVerify) => {
  const from =
    typeof process.env.ADMIN_EMAIL_ADDRESS === "string"
      ? process.env.ADMIN_EMAIL_ADDRESS
      : "";
  return sendEmail({
    to: email,
    from,
    subject: "Verify your email address",
    html: generateVerifyEmailHTML({
      username,
      email,
      originUrl,
      verificationToken,
    }),
  });
};
export default sendVerifyEmail;
