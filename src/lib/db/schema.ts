import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// Users table
export const users = sqliteTable('users', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	githubUserId: text('github_user_id').notNull().unique(),
	username: text('username').notNull()
		.unique(),
	email: text('email').notNull()
		.unique(),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

// Projects table
export const projects = sqliteTable('projects', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	userId: integer('user_id')
		.notNull()
		.references(() => users.id),
	name: text('name').notNull(),
	description: text('description'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

// Websites table
export const websites = sqliteTable('websites', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	projectId: integer('project_id')
		.notNull()
		.references(() => projects.id),
	url: text('url').notNull(),
	name: text('name').notNull(),
	checkInterval: integer('check_interval').notNull().default(300), // in seconds
	status: text('status').notNull().default('unknown'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

// Uptime checks table
export const uptimeChecks = sqliteTable('uptime_checks', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	websiteId: integer('website_id')
		.notNull()
		.references(() => websites.id),
	status: text('status').notNull(),
	responseTime: integer('response_time'), // in milliseconds
	statusCode: integer('status_code'),
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

// Alerts table
export const alerts = sqliteTable('alerts', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	websiteId: integer('website_id')
		.notNull()
		.references(() => websites.id),
	type: text('type').notNull(),
	target: text('target').notNull(), // email address, phone number, or webhook URL
	enabled: integer('enabled').notNull().default(1), // SQLite doesn't have a boolean type, so we use integer
	createdAt: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`),
	updatedAt: integer('updated_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`CURRENT_TIMESTAMP`)
});

// Relations
import { relations } from 'drizzle-orm';

export const usersRelations = relations(users, ({ many }) => ({
	projects: many(projects)
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
