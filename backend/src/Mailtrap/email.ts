import { generatePasswordResetEmailHtml, generateResetSuccessEmailHtml, generateWelcomeEmailHtml, htmlContent } from "./htmlEmail";
import { sender, transporter } from "./mailtrap";

export const sendVerificationEmail = async (
  email: string,
  verificationCode: string
) => {
  // Replace the placeholder in the HTML content
  const finalHtmlContent = htmlContent.replace("{verificationToken}", verificationCode);

  try {
    const info = await transporter.sendMail({
      from: sender,
      to: email,
      subject: "Verify your email address",
      html: finalHtmlContent,
    });

    console.log("Email sent successfully:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email verification!");
  }
};

export const sendWelcomeEmail = async (
  email: string,
  fullname: string
): Promise<void> => {
  const htmlContent = generateWelcomeEmailHtml(fullname);

  const mailOptions = {
    from: sender,
    to: email,
    subject: 'Welcome to Fork & Flame',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Welcome email sent successfully!');
  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw new Error('Failed to send welcome email!');
  }
};

export const sendPasswordResetEmail = async (
  email: string,
  resetURL: string
): Promise<void> => {
  const htmlContent = generatePasswordResetEmailHtml(resetURL);

  const mailOptions = {
    from: sender,
    to: email,
    subject: 'Reset your password!',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reset password email sent successfully!');
  } catch (error) {
    console.error('Error sending reset password email:', error);
    throw new Error('Failed to send reset password email!');
  }
};

export const sendResetSuccessEmail = async (email: string): Promise<void> => {
  const htmlContent = generateResetSuccessEmailHtml();

  const mailOptions = {
    from: sender,
    to: email,
    subject: 'Password Reset Successfully!',
    html: htmlContent,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Reset success email sent successfully!');
  } catch (error) {
    console.error('Error sending reset success email:', error);
    throw new Error('Failed to send Password Reset Success email!');
  }
};
  