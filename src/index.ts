import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { db } from './drizzle/db';
import { contacts } from './drizzle/schema';
import { sendContactEmail } from './lib/mailer';
import {cors} from 'hono/cors'
const app = new Hono();


//middleware
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // ✅ Allow only your frontend
    credentials: true, // ✅ Allow authentication
  })
);
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

const port = 8000;
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port,
});