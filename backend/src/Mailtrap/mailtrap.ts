import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USERNAME, // Must match the "from" email
    pass: process.env.EMAIL_PASSWORD, // App password if using Gmail
  },
});

export const sender = process.env.EMAIL_USERNAME;
