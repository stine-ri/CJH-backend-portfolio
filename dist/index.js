"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const node_server_1 = require("@hono/node-server");
const db_1 = require("./src/drizzle/db");
const schema_1 = require("./src/drizzle/schema");
const mailer_1 = require("./src/lib/mailer");
const cors_1 = require("hono/cors");
const app = new hono_1.Hono();
// CORS Middleware
app.use('*', (0, cors_1.cors)({
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
        const [contact] = await db_1.db.insert(schema_1.contacts).values({
            name,
            email,
            subject,
            message,
        }).returning();
        await (0, mailer_1.sendContactEmail)({ name, email, subject, message });
        return c.json({ success: true, contact });
    }
    catch (error) {
        console.error('Error processing contact form:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});
const port = Number(process.env.PORT) || 8000;
console.log(`Server is running on port ${port}`);
(0, node_server_1.serve)({
    fetch: app.fetch,
    port
});
