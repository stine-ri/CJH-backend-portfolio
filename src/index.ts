import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { db } from './drizzle/db';
import { contacts } from './drizzle/schema';
import { sendContactEmail } from './lib/mailer';
import { cors } from 'hono/cors';

const app = new Hono();

// CORS Middleware
app.use('*', cors({
  origin: [
    'https://christine-portfolio-red.vercel.app',
    'http://localhost:5500',
    'http://127.0.0.1:5500'
  ],
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  credentials: true,
  maxAge: 600
}));

// Root endpoint
app.get('/', (c) => {
  return c.json({
    status: 'running',
    message: 'Backend service is operational',
    available_endpoints: {
      contact: 'POST /api/contact'
    }
  });
});

// Contact endpoint
app.post('/api/contact', async (c) => {
  try {
    const { name, email, subject, message } = await c.req.json();
    
    if (!name || !email || !subject || !message) {
      return c.json({ error: 'All fields are required' }, 400);
    }

    const [contact] = await db.insert(contacts).values({
      name,
      email,
      subject,
      message,
    }).returning();

    await sendContactEmail({ name, email, subject, message });

    return c.json({ success: true, contact });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
});

// Start server in both dev and production
const port = parseInt(process.env.PORT || '8000', 10);
serve({
  fetch: app.fetch,
  port,
  hostname: '0.0.0.0'  // Important for Render
}, () => {
  console.log(`Server running on port ${port}`);
});

export default app;  