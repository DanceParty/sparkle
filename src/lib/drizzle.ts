import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("database url is undefined");
}

export const sql = postgres(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

export type NewPlayer = typeof schema.player.$inferInsert;
export const insertPlayer = async (newPlayer: NewPlayer) => {
  return db.insert(schema.player).values(newPlayer);
};

export type NewGame = typeof schema.game.$inferInsert;
export const insertGame = async (newGame: NewGame) => {
  return db.insert(schema.game).values(newGame);
};
