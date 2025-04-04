"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contacts = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.contacts = (0, pg_core_1.pgTable)('contacts', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    name: (0, pg_core_1.text)('name').notNull(),
    email: (0, pg_core_1.text)('email').notNull(),
    subject: (0, pg_core_1.text)('subject').notNull(),
    message: (0, pg_core_1.text)('message').notNull(),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow().notNull(),
});
