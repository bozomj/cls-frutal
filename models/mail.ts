import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

const options: SMTPTransport.Options = {
  host: process.env.EMAIL_SMTP_HOST,
  port: Number(process.env.EMAIL_SMTP_PORT) || 465,
  auth: {
    user: process.env.EMAIL_SMTP_USER,
    pass: process.env.EMAIL_SMTP_PASSWORD,
  },
  secure: process.env.NODE_ENV === "production" ? true : false,
};

const transporter = nodemailer.createTransport(options);

async function send(mail: {
  to: string;
  subject: string;
  text: string;
  html?: string;
}) {
  await transporter.sendMail({
    from: "<CLS-FRUTAL <contato@bzmj.com.br>",
    ...mail,
  });
}

const mail = {
  send,
};

export default mail;
