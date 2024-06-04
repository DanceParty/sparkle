import { score } from "../lib/schema";
import { db } from "@/lib/drizzle";

export type NewScore = typeof score.$inferInsert;
export const insertScore = async (newScore: NewScore) => {
  return db.insert(score).values(newScore);
};
