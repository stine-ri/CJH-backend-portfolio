"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mailer_1 = require("./lib/mailer");
const testData = {
    name: "Test User",
    email: "christineportfolio03@gmail.com",
    subject: "Automated Test",
    message: "This is an automated backend test"
};
// Test the email sending
(0, mailer_1.sendContactEmail)(testData)
    .then(() => console.log("✅ Email sent successfully"))
    .catch(err => console.error("❌ Error:", err.message));
// Jest mock (for future unit tests)
if (process.env.NODE_ENV === 'test') {
    jest.mock('nodemailer', () => ({
        createTransport: () => ({
            sendMail: jest.fn().mockResolvedValue({ messageId: 'mocked' })
        })
    }));
}
