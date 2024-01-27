import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgEnum,
  pgTable,
  smallint,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
export const gameStatusEnum = pgEnum("status", [
  "in progress",
  "setting up",
  "finished",
]);
export const playerRoleEnum = pgEnum("role", ["OWNER", "PLAYER"]);

export const player = pgTable("player", {
  id: uuid("id").primaryKey().defaultRandom(),
  username: varchar("username", { length: 15 }),
  role: playerRoleEnum("role"),
  turnOrderIndex: integer("turn_order_index"),
  gameId: uuid("game_id").references(() => game.id),
});

export const playerRelations = relations(player, ({ one, many }) => ({
  score: one(score, {
    fields: [player.id],
    references: [score.playerId],
  }),
  rolls: many(roll),
  turns: many(turn),
}));

export const game = pgTable("game", {
  id: uuid("id").primaryKey().defaultRandom(),
  code: varchar("code", { length: 20 }),
  status: gameStatusEnum("status"),
});

export const gameRelations = relations(game, ({ many }) => ({
  players: many(player),
  turns: many(turn),
}));

export const score = pgTable("score", {
  id: uuid("id").primaryKey().defaultRandom(),
  totalScore: smallint("total_score").default(0),
  playerId: uuid("player_id").references(() => player.id),
  gameId: uuid("game_id").references(() => game.id),
});

export const roll = pgTable("roll", {
  id: uuid("id").primaryKey().defaultRandom(),
  diceOne: smallint("dice_one").default(0),
  diceTwo: smallint("dice_two").default(0),
  diceThree: smallint("dice_three").default(0),
  diceFour: smallint("dice_four").default(0),
  diceFive: smallint("dice_five").default(0),
  diceSix: smallint("dice_six").default(0),
  playerId: uuid("player_id").references(() => player.id),
  gameId: uuid("game_id").references(() => game.id),
  turnId: uuid("turn_id").references(() => turn.id),
});

export const turn = pgTable("turn", {
  id: uuid("id").primaryKey().defaultRandom(),
  score: smallint("score").default(0),
  isFarkle: boolean("is_farkle").default(false),
  playerId: uuid("player_id").references(() => player.id),
  gameId: uuid("game_id").references(() => game.id),
});

export const turnRelations = relations(turn, ({ many }) => ({
  rolls: many(roll),
}));
