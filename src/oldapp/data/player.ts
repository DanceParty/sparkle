import { sql } from "drizzle-orm";
import { player } from "../lib/schema";
import { db } from "@/oldapp/lib/drizzle";

export type NewPlayer = typeof player.$inferInsert;
export const insertPlayer = async (newPlayer: NewPlayer) => {
  return db.insert(player).values(newPlayer).returning();
};

export const getPlayersForGame = async (gameId: string) => {
  return db
    .select()
    .from(player)
    .where(sql`${player.gameId} = ${gameId}`);
};
