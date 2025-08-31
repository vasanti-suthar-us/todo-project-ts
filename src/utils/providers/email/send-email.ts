import config from "../../../config/config";
import nodemailer from "nodemailer";

export const sendEmail = async ({ to, subject, text }: { to: string; subject: string; text: string; }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: config.EMAIL_PROVIDER.USER,
        pass: config.EMAIL_PROVIDER.PASSWORD,
      },
    });
    await transporter.sendMail({
      from: `"Todo App" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.log(`Error from sendEmail service ${error}`)
  }
};
