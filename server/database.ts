import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from '@shared/schema';

// For development, we'll use in-memory storage
// In production, you'd use a real PostgreSQL database
const isDevelopment = process.env.NODE_ENV === 'development';

let db: any;

if (isDevelopment) {
  // Use in-memory storage for development
  console.log('Using in-memory database for development');
  db = null; // Will be handled by MemStorage in storage.ts
} else {
  // Production database setup
  const connectionString = process.env.DATABASE_URL;
  
  if (!connectionString) {
    throw new Error('DATABASE_URL environment variable is required in production');
  }

  const sql = neon(connectionString, {
    ssl: process.env.NODE_ENV === 'production' ? {
      rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED === 'true'
    } : false
  });

  db = drizzle(sql, { schema });
}

export { db };

// Connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    if (isDevelopment) {
      return true; // Always healthy in development
    }
    
    if (!db) return false;
    
    const sql = neon(process.env.DATABASE_URL!);
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
    if (isDevelopment) {
      console.log('Skipping migrations in development (using in-memory storage)');
      return;
    }
    
    console.log('Database migrations should be run via drizzle-kit in production');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}