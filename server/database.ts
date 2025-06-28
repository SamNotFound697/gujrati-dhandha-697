import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '@shared/schema';

// Database configuration with SSL
const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Configure SSL for production
const sql = neon(connectionString, {
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true'
  } : false
});

export const db = drizzle(sql, { schema });

// Connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await sql`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database connection failed:', error);
    return false;
  }
}

// Database migration runner
export async function runMigrations(): Promise<void> {
  try {
    // In production, migrations should be run separately
    console.log('Database migrations should be run via drizzle-kit in production');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}