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
export const checkIntervalEnum = pgEnum('check_interval_enum', ['1', '2', '5', '10']);
export const statusEnum = pgEnum('status_enum', [
	'up',
	'degraded',
	'down',
	'maintenance',
	'warning'
]);

// Types
export type CheckInterval = '1' | '2' | '5' | '10';
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
	url: varchar('url', { length: 2083 }).notNull(), // max URL length for compatibility
	name: varchar('name', { length: 25 }).notNull(),
	checkInterval: checkIntervalEnum('check_interval').notNull().default('5'),
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
		.references(() => websites.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	type: varchar('type', { length: 25 }).notNull(),
	target: varchar('target', { length: 255 }).notNull(), // email, webhook URL, etc
	enabled: boolean('enabled').notNull().default(true),
	createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
	updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
	projects: many(projects),
	websites: many(websites)
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
	alerts: many(alerts)
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
	})
}));

// Insert types
export type InsertUser = typeof users.$inferInsert;
export type InsertProject = typeof projects.$inferInsert;
export type InsertWebsite = typeof websites.$inferInsert;

// Select types
export type SelectUptimeCheck = typeof uptimeChecks.$inferSelect;
export type SelectProject = typeof projects.$inferSelect;
export type SelectWebsite = typeof websites.$inferSelect;
export type SelectStatus = typeof uptimeChecks.$inferSelect;

// Partial Select types
export type SelectWebsiteStatusCard = Pick<SelectWebsite, 'id' | 'name' | 'url' | 'checkInterval'>;
export type SelectProjectPartial = Pick<SelectProject, 'id' | 'slug' | 'name' | 'description'>;
export type SelectWebsitePartial = Pick<SelectWebsite, 'id' | 'name' | 'url' | 'checkInterval'>;
export type SelectPartialStatus = Pick<
	SelectStatus,
	'status' | 'responseTime' | 'statusCode' | 'createdAt'
>;

// Zod Schemas
export const InsertProjectSchema = createInsertSchema(projects);
export const InsertWebsiteSchema = createInsertSchema(websites);
