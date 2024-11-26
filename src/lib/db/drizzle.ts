import pg from 'pg';
import { SECRET_XATA_PG_ENDPOINT } from '$env/static/private';
import { drizzle } from 'drizzle-orm/node-postgres';

const pool = new pg.Pool({ connectionString: SECRET_XATA_PG_ENDPOINT, max: 10 });
export const db = drizzle(pool);
