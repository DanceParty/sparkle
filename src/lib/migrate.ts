import "dotenv/config";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db, connection } from "./drizzle";

async function migrateDb() {
  try {
    await migrate(db, { migrationsFolder: "drizzle" });

    await connection.end();
    process.exit(0);
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
}

migrateDb();
