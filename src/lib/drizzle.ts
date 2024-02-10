import { drizzle } from "drizzle-orm/postgres-js";
import { sql } from "drizzle-orm";
import postgres from "postgres";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  throw new Error("database url is undefined");
}

export const connection = postgres(process.env.DATABASE_URL);
export const db = drizzle(connection, { schema });

// player queries
export type NewPlayer = typeof schema.player.$inferInsert;
export const insertPlayer = async (newPlayer: NewPlayer) => {
  return db.insert(schema.player).values(newPlayer);
};

// game queries
export type NewGame = typeof schema.game.$inferInsert;
export const insertGame = async (newGame: NewGame) => {
  return db.insert(schema.game).values(newGame);
};
export const checkDuplicatedGame = async (gameCode: string) => {
  return db
    .select({ gameCodeCount: sql<number>`count(*)`.mapWith(Number) })
    .from(schema.game)
    .where(
      sql`${schema.game.code} = ${gameCode} AND (${
        schema.game.status
      } = ${"in progress"} OR ${schema.game.status} = ${"setting up"})`
    );
};
