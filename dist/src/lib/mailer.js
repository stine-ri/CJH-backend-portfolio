"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendContactEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // Load environment variables from .env file
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
    // Gmail often requires these additional settings
    tls: {
        rejectUnauthorized: false
    }
});
console.log('SMTP Config:', {
    host: process.env.SMTP_HOST,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD ? '***' : 'MISSING' // Masked logging
});
const sendContactEmail = async (data) => {
    const mailOptions = {
        from: process.env.SMTP_FROM,
        to: process.env.CONTACT_RECIPIENT,
        replyTo: `${data.name} <${data.email}>`, // Added replyTo field here
        subject: `New Portfolio Message: ${data.subject}`,
        text: `
      New contact form submission:
      
      Name: ${data.name}
      Email: ${data.email}
      Subject: ${data.subject}
      
      Message:
      ${data.message}
    `,
        html: `
      <h1>New Portfolio Contact</h1>
      <p><strong>From:</strong> ${data.name} (${data.email})</p>
      <p><strong>Subject:</strong> ${data.subject}</p>
      <p><strong>Message:</strong></p>
      <p>${data.message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p>You can reply directly to ${data.email}</p>
    `,
    };
    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    }
    catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
};
exports.sendContactEmail = sendContactEmail;
