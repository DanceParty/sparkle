import { player } from "../../lib/schema";
import { db } from "@/lib/drizzle";

export type NewPlayer = typeof player.$inferInsert;
export const insertPlayer = async (newPlayer: NewPlayer) => {
  return db.insert(player).values(newPlayer).returning();
};
