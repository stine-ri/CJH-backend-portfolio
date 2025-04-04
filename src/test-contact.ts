import { sendContactEmail } from './lib/mailer';

const testData = {
  name: "Test User",
  email: "christineportfolio03@gmail.com",
  subject: "Automated Test",
  message: "This is an automated backend test"
};

// Test the email sending
sendContactEmail(testData)
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