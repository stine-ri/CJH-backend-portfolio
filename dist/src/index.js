"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const node_server_1 = require("@hono/node-server");
const db_1 = require("./src/drizzle/db");
const schema_1 = require("./src/drizzle/schema");
const mailer_1 = require("./src/lib/mailer");
const app = new hono_1.Hono();
app.post('/api/contact', async (c) => {
    try {
        const { name, email, subject, message } = await c.req.json();
        // Validate input
        if (!name || !email || !subject || !message) {
            return c.json({ error: 'All fields are required' }, 400);
        }
        // Store in database
        const [contact] = await db_1.db.insert(schema_1.contacts).values({
            name,
            email,
            subject,
            message,
        }).returning();
        // Send email
        await (0, mailer_1.sendContactEmail)({ name, email, subject, message });
        return c.json({ success: true, contact });
    }
    catch (error) {
        console.error('Error processing contact form:', error);
        return c.json({ error: 'Internal server error' }, 500);
    }
});
const port = 8000;
console.log(`Server is running on port ${port}`);
(0, node_server_1.serve)({
    fetch: app.fetch,
    port,
});
