// src/lib/prisma.ts - Supabase specific
import { PrismaClient } from "@prisma/client";
import { Pool } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

let connectionString = process.env.DATABASE_URL!;

// Ensure connection string has proper format
if (!connectionString.includes('sslmode') && !connectionString.includes('pgbouncer')) {
  connectionString += '?sslmode=require';
}

console.log("Using connection string:", connectionString.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'));

// @ts-ignore
const pool = new Pool({ connectionString });
// @ts-ignore
const adapter = new PrismaNeon(pool);

export const prisma = new PrismaClient({ adapter });