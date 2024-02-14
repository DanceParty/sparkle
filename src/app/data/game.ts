import { game, player } from "../../lib/schema";
import { eq, sql } from "drizzle-orm";
import { db } from "@/lib/drizzle";

export type NewGame = typeof game.$inferInsert;
export const insertGame = async (newGame: NewGame) => {
  return db.insert(game).values(newGame);
};
export const checkDuplicatedGame = async (gameCode: string) => {
  return db
    .select({ gameCodeCount: sql<number>`count(*)`.mapWith(Number) })
    .from(game)
    .where(
      sql`${game.code} = ${gameCode} AND (${
        game.status
      } = ${"in progress"} OR ${game.status} = ${"setting up"})`
    );
};

export const getGame = async (gameCode: string) => {
  return db
    .select()
    .from(game)
    .where(
      sql`${game.code} = ${gameCode} AND ${game.status} = ${"setting up"}`
    );
};

export const getPlayersForGame = async (gameId: string) => {
  return db
    .select()
    .from(game)
    .rightJoin(player, eq(game.id, player.gameId))
    .where(sql`${game.id} = ${gameId}`);
};
