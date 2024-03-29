import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("database url is undefined");
}

export const connection = postgres(process.env.DATABASE_URL);
export const db = drizzle(connection, { schema });
