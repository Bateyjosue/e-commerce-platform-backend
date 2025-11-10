export interface GenerateVerify {
  username: string;
  email: string;
  verificationToken: string;
  originUrl: string;
}
const generateVerifyEmailHTML = ({
  username,
  email,
  originUrl,
  verificationToken,
}: GenerateVerify) =>
  `
<div style="width: 70%; margin: 0 auto; font-family: sans-serif;">
  <nav style="background-color: #c4c4c4; padding: 0.1rem;">
    <h1 style="text-align: center;">Reaction Road API needs you to verify your email address</h1>
  </nav>

  <div style="padding: 2rem;">
    <h2>Hi ${username}!</h2>

    
  <p>You recently registered on Reaction Road, we sent you this email in order to verify if the email you provided us is viable,
      for the sake of security and better services you receive from Reaction Road!</p>

  <p>Kindly click the link below, so that we will know that this email belongs to you. Keep in mind that you need to always remember your email
    and password you used and don’t share it with anyone else!</p>
    
    <div style="padding: 1rem 0 1rem 0;">
      <a href="${originUrl}/user/verify-email?token=${verificationToken}&email=${email}" style="background-color: #14a2b5; color: #ffffff; width: 40%; padding: 0.8rem; text-decoration: none; border-radius: 0.2rem;">
        Verify email address</a>
      </div>

    <p>If you didn’t register on Reaction Road system recently,
    we are sorry for that inconvenience, ignore this email!</p>

    <div>
      <p>Yours truly,</p>
      <p>Reaction Road</p>
    </div>
  </div>
  <footer style="background-color: #c4c4c4; padding: 0.1rem">
    <p style="text-align: center; font-size: 0.8rem;">© 2023 click here <a href="${originUrl}">Reaction Road</a>. All rights reserved.</p>
  </footer>
</div>
  `;

export const generateResetPasswordHTML = ({
  username,
  email,
  originUrl,
  verificationToken,
}: GenerateVerify) => `
<div style="width: 70%; margin: 0 auto; font-family: sans-serif;">
  <nav style="background-color: #c4c4c4; padding: 0.1rem;">
    <h1 style="text-align: center;">Reset your Reaction Road Password</h1>
  </nav>

  <div style="padding: 2rem;">
    <h2>Hi ${username}!</h2>

    
  <p>You need to reset your password? No problem! just click the button below and you'll be in your way.</p>

  <p>If you did not make this request, Please ignore this email</p>

  <div style="padding: 1rem 0 1rem 0;">
  <a href="${originUrl}/user/reset-password?token=${verificationToken}&email=${email}" style="background-color: #14a2b5; color: #ffffff; width: 40%; padding: 0.8rem; text-decoration: none; border-radius: 0.2rem;">
    Reset Password</a>
  </div>

    <p>If you didn’t make this request on Reaction Road system recently,
    we are sorry for that inconvenience, ignore this email!</p>

    <div>
      <p>Yours truly,</p>
      <p>Reaction Road System</p>
    </div>
  </div>
  <footer style="background-color: #c4c4c4; padding: 0.1rem">
    <p style="text-align: center; font-size: 0.8rem;">© 2022 <a href="#">Reaction Road</a>. All rights reserved.</p>
  </footer>
</div>
`;

export default generateVerifyEmailHTML;
