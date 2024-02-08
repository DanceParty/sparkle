DO $$ BEGIN
 CREATE TYPE "status" AS ENUM('in progress', 'setting up', 'finished');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "role" AS ENUM('OWNER', 'PLAYER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "game" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(20),
	"status" "status"
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "player" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" varchar(15),
	"role" "role",
	"turn_order_index" integer,
	"game_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "roll" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"dice_one" smallint DEFAULT 0,
	"dice_two" smallint DEFAULT 0,
	"dice_three" smallint DEFAULT 0,
	"dice_four" smallint DEFAULT 0,
	"dice_five" smallint DEFAULT 0,
	"dice_six" smallint DEFAULT 0,
	"player_id" uuid,
	"game_id" uuid,
	"turn_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "score" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"total_score" smallint DEFAULT 0,
	"player_id" uuid,
	"game_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "turn" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"score" smallint DEFAULT 0,
	"is_farkle" boolean DEFAULT false,
	"player_id" uuid,
	"game_id" uuid
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "player" ADD CONSTRAINT "player_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roll" ADD CONSTRAINT "roll_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roll" ADD CONSTRAINT "roll_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "roll" ADD CONSTRAINT "roll_turn_id_turn_id_fk" FOREIGN KEY ("turn_id") REFERENCES "turn"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "score" ADD CONSTRAINT "score_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "score" ADD CONSTRAINT "score_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "turn" ADD CONSTRAINT "turn_player_id_player_id_fk" FOREIGN KEY ("player_id") REFERENCES "player"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "turn" ADD CONSTRAINT "turn_game_id_game_id_fk" FOREIGN KEY ("game_id") REFERENCES "game"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
