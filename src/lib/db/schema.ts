import {
	pgTable,
	text,
	boolean,
	integer,
	timestamp,
	uuid,
	pgEnum,
	varchar
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { createInsertSchema } from 'drizzle-zod';

// Enums
export const statusEnum = pgEnum('status_enum', [
	'up',
	'degraded',
	'down',
	'maintenance',
	'warning'
]);

// Types
export type WebsiteStatus = 'up' | 'degraded' | 'down' | 'maintenance' | 'warning';

// Helper functions
export const getStatusColor = (status: WebsiteStatus) => {
	const colors = {
		up: 'green',
		degraded: 'yellow',
		down: 'red',
		maintenance: 'blue',
		warning: 'orange'
	} as const;

	return colors[status];
};

export const getStatusText = (status: WebsiteStatus) => {
	const text = {
		up: 'Operational',
		degraded: 'Degraded Performance',
		down: 'Major Outage',
		maintenance: 'Maintenance',
		warning: 'Minor Issue'
	} as const;

	return text[status];
};

// Tables
export const users = pgTable('users', {
	id: text('id').notNull().unique().primaryKey(),
	name: varchar('name', { length: 25 }),
	pro: boolean('pro').default(false),
	stripeSubscriptionId: varchar('stripe_subsription_id', { length: 255 }),
	username: varchar('username', { length: 39 }).notNull().unique(),
	email: varchar('email', { length: 255 }).notNull().unique(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const projects = pgTable('projects', {
	id: uuid('id').primaryKey().defaultRandom(),
	slug: varchar('slug', { length: 10 }).notNull().unique(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id),
	name: varchar('name', { length: 25 }).notNull(),
	description: varchar('description', { length: 400 }),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const websites = pgTable('websites', {
	id: uuid('id').primaryKey().defaultRandom(),
	projectId: uuid('project_id')
		.notNull()
		.references(() => projects.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	url: varchar('url', { length: 2083 }).notNull(),
	paused: boolean('paused').notNull().default(false),
	name: varchar('name', { length: 25 }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const uptimeChecks = pgTable('uptime_checks', {
	id: uuid('id').primaryKey().defaultRandom(),
	websiteId: uuid('website_id')
		.notNull()
		.references(() => websites.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	status: statusEnum('status').notNull(),
	responseTime: integer('response_time'),
	statusCode: integer('status_code'),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const alerts = pgTable('alerts', {
	id: uuid('id').primaryKey().defaultRandom(),
	websiteId: uuid('website_id')
		.notNull()
		.references(() => websites.id, { onDelete: 'cascade', onUpdate: 'cascade' })
		.unique(), // This ensures one alert per website
	userId: text('user_id') // Add user column
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	type: varchar('type', { length: 25 }).notNull(),
	target: varchar('target', { length: 255 }).notNull(),
	enabled: boolean('enabled').notNull().default(true),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

export const alertLogs = pgTable('alert_logs', {
	id: uuid('id').primaryKey().defaultRandom(),
	alertId: uuid('alert_id')
		.notNull()
		.references(() => alerts.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	websiteId: uuid('website_id')
		.notNull()
		.references(() => websites.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	userId: text('user_id') // Add user column
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	websiteStatus: statusEnum('website_status').notNull(), // The status that triggered the alert
	webhookStatus: integer('webhook_status'), // The status of the webhook request
	sent: boolean('sent').notNull().default(false), // Whether the alert was successfully sent
	message: varchar('message', { length: 400 }),
	error: varchar('error', { length: 255 }), // Optional error message if alert failed
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow()
});

export const messages = pgTable('messages', {
	id: uuid('id').primaryKey().defaultRandom(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	websiteId: uuid('website_id')
		.notNull()
		.references(() => websites.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	title: varchar('title', { length: 100 }).notNull(),
	content: varchar('content', { length: 1000 }).notNull(),
	startTime: timestamp('start_time', { withTimezone: true, mode: 'string' }).notNull(),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	projects: many(projects),
	websites: many(websites),
	messages: many(messages),
	alerts: many(alerts), // Add alerts relation
	alertLogs: many(alertLogs) // Add alertLogs relation
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
	user: one(users, {
		fields: [projects.userId],
		references: [users.id]
	}),
	websites: many(websites)
}));

export const websitesRelations = relations(websites, ({ one, many }) => ({
	project: one(projects, {
		fields: [websites.projectId],
		references: [projects.id]
	}),
	user: one(users, {
		fields: [websites.userId],
		references: [users.id]
	}),
	uptimeChecks: many(uptimeChecks),
	alerts: many(alerts),
	alertLogs: many(alertLogs), // Add this line
	messages: many(messages)
}));

export const uptimeChecksRelations = relations(uptimeChecks, ({ one }) => ({
	website: one(websites, {
		fields: [uptimeChecks.websiteId],
		references: [websites.id]
	})
}));

export const alertsRelations = relations(alerts, ({ one }) => ({
	website: one(websites, {
		fields: [alerts.websiteId],
		references: [websites.id]
	}),
	user: one(users, {
		fields: [alerts.userId],
		references: [users.id]
	})
}));

export const messagesRelations = relations(messages, ({ one }) => ({
	website: one(websites, {
		fields: [messages.websiteId],
		references: [websites.id]
	}),
	user: one(users, {
		fields: [messages.userId],
		references: [users.id]
	})
}));

export const alertLogsRelations = relations(alertLogs, ({ one }) => ({
	alert: one(alerts, {
		fields: [alertLogs.alertId],
		references: [alerts.id]
	}),
	website: one(websites, {
		fields: [alertLogs.websiteId],
		references: [websites.id]
	}),
	user: one(users, {
		// Add user relation
		fields: [alertLogs.userId],
		references: [users.id]
	})
}));

// Insert types
export type InsertUser = typeof users.$inferInsert;
export type InsertProject = typeof projects.$inferInsert;
export type InsertWebsite = typeof websites.$inferInsert;
export type InsertMessage = typeof messages.$inferInsert;
export type InsertAlert = typeof alerts.$inferInsert;
export type InsertAlertLog = typeof alertLogs.$inferInsert;

// Select types
export type SelectUser = typeof users.$inferSelect;
export type SelectUptimeCheck = typeof uptimeChecks.$inferSelect;
export type SelectProject = typeof projects.$inferSelect;
export type SelectWebsite = typeof websites.$inferSelect;
export type SelectStatus = typeof uptimeChecks.$inferSelect;
export type SelectMessage = typeof messages.$inferSelect;
export type SelectAlert = typeof alerts.$inferSelect;
export type SelectAlertLog = typeof alertLogs.$inferSelect;

// Partial Select types
export type SelectWebsiteStatusCard = Pick<SelectWebsite, 'id' | 'name' | 'url'>;
export type SelectProjectPartial = Pick<SelectProject, 'id' | 'slug' | 'name' | 'description'>;
export type SelectWebsitePartial = Pick<SelectWebsite, 'id' | 'name' | 'url'>;
export type SelectPartialStatus = Pick<
	SelectStatus,
	'status' | 'responseTime' | 'statusCode' | 'createdAt'
>;
export type SelectMessagePartial = Pick<
	SelectMessage,
	'id' | 'title' | 'content' | 'startTime' | 'websiteId'
>;
export type SelectAlertPartial = Pick<
	SelectAlert,
	'id' | 'websiteId' | 'type' | 'target' | 'enabled'
>;
export type SelectAlertLogsPartial = Pick<
	SelectAlertLog,
	| 'id'
	| 'websiteId'
	| 'websiteStatus'
	| 'webhookStatus'
	| 'createdAt'
	| 'message'
	| 'error'
	| 'sent'
>;

// Zod Schemas
export const InsertProjectSchema = createInsertSchema(projects);
export const InsertWebsiteSchema = createInsertSchema(websites);
export const InsertMessageSchema = createInsertSchema(messages);
export const InsertAlertSchema = createInsertSchema(alerts);
