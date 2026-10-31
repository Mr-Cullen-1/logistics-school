import "dotenv/config";

import { readFileSync } from "node:fs";

import { getSqlClient } from "../src/db";

async function main() {
  const sql = getSqlClient();
  const rollback = new Error("verification rollback");
  const statements = readFileSync("drizzle/0002_cold_hannibal_king.sql", "utf8").split("--> statement-breakpoint").map((part) => part.trim()).filter(Boolean);
  try {
    const [existing] = await sql`select to_regclass('public.lesson_files') as name`;
    if (existing.name) {
      const tables = await sql`select relname, relrowsecurity from pg_class where oid in ('public.lesson_files'::regclass, 'public.lesson_progress'::regclass, 'public.practice_attempts'::regclass)`;
      if (tables.length !== 3 || tables.some((table) => !table.relrowsecurity)) throw new Error("Yangi jadvallar yoki RLS to‘liq emas");
      const [counts] = await sql`select (select count(*)::int from lesson_files) as files, (select count(*)::int from lesson_progress) as progress`;
      console.log(`Migratsiya bazada mavjud: 3 jadvalda RLS yoqilgan, ${counts.files} fayl, ${counts.progress} progress yozuvi.`);
      return;
    }
    const [before] = await sql`select (select count(*)::int from lessons) as lessons, (select count(*)::int from progress) as progress`;
    try {
      await sql.begin(async (tx) => {
        for (const statement of statements) await tx.unsafe(statement);
        const [after] = await tx`select (select count(*)::int from lesson_files) as files, (select count(*)::int from lesson_progress) as progress`;
        if (after.files < 0 || after.progress < 0) throw new Error("Migratsiya tekshiruvi xato");
        console.log(`Migratsiya tranzaksiyada o'tdi: eski darslar ${before.lessons}, eski progress ${before.progress}; yangi fayllar ${after.files}, yangi progress ${after.progress}.`);
        throw rollback;
      });
    } catch (error) {
      if (error !== rollback) throw error;
    }
    const [table] = await sql`select to_regclass('public.lesson_files') as name`;
    if (table.name) throw new Error("Tekshiruv tranzaksiyasi rollback bo‘lmadi");
    console.log("Rollback tasdiqlandi; baza o‘zgarmadi.");
  } finally { await sql.end(); }
}

main().catch((error: unknown) => { console.error(error instanceof Error ? error.message : String(error)); process.exitCode = 1; });
