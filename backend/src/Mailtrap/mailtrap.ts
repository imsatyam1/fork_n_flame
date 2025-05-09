import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv"

dotenv.config();

const TOKEN = process.env.API_TOKEN;

export const client = new MailtrapClient({
  token: TOKEN!,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "Fork & Flame",
};