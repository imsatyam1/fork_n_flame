import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlEmail";
import { client, sender } from "./mailtrap";

export const sendVerificationEmail = async (
  email: string,
  verificationCode: string
) => {
  const recipients = [{ email }];
  try {
    client.send({
      from: sender,
      to: recipients,
      subject: "You are awesome!",
      html: htmlContent.replace("{verificationToken}", verificationCode),
      category: "Email Verification",
    });
  } catch (error) {
    console.error(error);
    throw new Error("Failed to send email verification!");
  }
};

export const sendWelcomeEmail = async (
    email: string,
    fullname: string
  ) => {
    const recipients = [{ email }];
    const htmlContent = generateWelcomeEmailHtml(fullname);
    try {
      client.send({
        from: sender,
        to: recipients,
        subject: "Welcome to Form & Flame",
        html: htmlContent,
        category: "Welcome Email",
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to send Welcome email!");
    }
  };

  export const sendPasswordResetEmail = async (
    email: string,
    resetURL: string
  ) => {
    const recipients = [{ email }];
    const htmlContent = generatePasswordResetEmailHtml(resetURL);
    try {
      client.send({
        from: sender,
        to: recipients,
        subject: "Reset your password!",
        html: htmlContent,
        category: "Reset Password",
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to send Reset Password email!");
    }
  };

  export const sendResetSuccessEmail = async ( email: string, ) => {
    const recipients = [{ email }];
    const htmlContent = generateResetSuccessEmailHtml();
    try {
      client.send({
        from: sender,
        to: recipients,
        subject: "Password Reset Succesfully!",
        html: htmlContent,
        category: "Reset Password",
      });
    } catch (error) {
      console.error(error);
      throw new Error("Failed to send Password Reset SUccess email!");
    }
  };

  