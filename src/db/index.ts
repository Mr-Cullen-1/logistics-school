import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import * as schema from "./schema";

function createDatabase() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL belgilanmagan. .env.example dan .env yarating.");
  }

  const client = postgres(url, { max: 1, prepare: false });
  return { db: drizzle(client, { schema }), client };
}

let connection: ReturnType<typeof createDatabase> | undefined;

export function getDatabase() {
  connection ??= createDatabase();
  return connection.db;
}

export function getSqlClient() {
  connection ??= createDatabase();
  return connection.client;
}
