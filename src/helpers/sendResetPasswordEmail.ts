import { GenerateVerify, generateResetPasswordHTML } from "./emailContent";
import sendEmail from "./sendEmail";

const sendResetPasswordEmail = async ({
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
    subject: "Reset Password",
    html: generateResetPasswordHTML({
      username,
      email,
      originUrl,
      verificationToken,
    }),
  });
};
export default sendResetPasswordEmail;
