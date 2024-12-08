import { defineConfig } from 'drizzle-kit';

export default defineConfig({
	schema: './src/lib/db/schema.ts',
	out: './src/lib/db/migrations',
	dialect: 'postgresql',
	dbCredentials: {
		url: process.env.SECRET_XATA_PG_ENDPOINT!
	},
	verbose: true,
	strict: true
});
