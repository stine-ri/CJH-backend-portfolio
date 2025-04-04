import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { db } from './drizzle/db';
import { contacts } from './drizzle/schema';
import { sendContactEmail } from './lib/mailer';
import {cors} from 'hono/cors'
const app = new Hono();


// Apply CORS middleware to all routes
app.use(
  '*',
  cors({
    origin: [
      'https://christine-portfolio-red.vercel.app',
      'http://localhost:5500', // For local development
      'http://127.0.0.1:5500' // Alternative localhost
    ],
    allowMethods: ['POST', 'GET', 'OPTIONS'],
    allowHeaders: ['Content-Type'],
    credentials: true,
    maxAge: 600
  })
)

app.post('/api/contact', async (c) => {
  try {
    const { name, email, subject, message } = await c.req.json();

    // Validate input
    if (!name || !email || !subject || !message) {
      return c.json({ error: 'All fields are required' }, 400);
    }

    // Store in database
    const [contact] = await db.insert(contacts).values({
      name,
      email,
      subject,
      message,
    }).returning();

    // Send email
    await sendContactEmail({ name, email, subject, message });

    return c.json({ success: true, contact });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});


// Add this export:
export default {
  port: process.env.PORT || 8000,
  fetch: app.fetch
};