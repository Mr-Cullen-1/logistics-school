// Deliberately ignores .env/DATABASE_URL. Only a disposable loopback cluster is allowed.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import * as schema from "../src/db/schema";
import { seedExamDatabase } from "../tests/helpers/exam-db";

export async function nativeExamFixture() {
  const raw = process.env.PK_IK_TEST_ADMIN_URL;
  assert(raw, "Set PK_IK_TEST_ADMIN_URL to the disposable local cluster, never production.");
  const target = new URL(raw);
  assert(["localhost", "127.0.0.1"].includes(target.hostname));
  assert.equal(target.port, "55439");
  assert.equal(target.pathname, "/postgres");
  const admin = postgres(raw, { max: 1, ssl: "require", prepare: false });
  const name = `pk_ik_qa_${randomUUID().replaceAll("-", "")}`;
  const clients: ReturnType<typeof postgres>[] = [];
  async function close() {
    await Promise.all(clients.map(client => client.end({ timeout: 5 })));
    try { await admin.unsafe(`DROP DATABASE IF EXISTS "${name}" WITH (FORCE)`); }
    finally { await admin.end({ timeout: 5 }); }
  }
  try {
    await admin.unsafe(`CREATE DATABASE "${name}"`);
    target.pathname = `/${name}`;
    const url = target.href;
    function connect() {
      const client = postgres(url, { max: 1, ssl: "require", prepare: false, connection: { application_name: "pk-ik-local-qa", statement_timeout: 20000 } });
      clients.push(client);
      return { client, db: drizzle(client, { schema }) };
    }
    const primary = connect();
    await migrate(primary.db, { migrationsFolder: "drizzle" });
    const fixture = await seedExamDatabase(primary.db);
    return { ...fixture, url, name, adminConnection: admin, connect, close };
  } catch (error) { await close(); throw error; }
}
