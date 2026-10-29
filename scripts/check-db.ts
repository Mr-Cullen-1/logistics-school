import "dotenv/config";
import { getSqlClient } from "../src/db";

async function main() {
  const sql = getSqlClient();
  try {
    const result = await sql`select current_database() as database, 1 as ok`;
    if (result[0]?.ok !== 1) throw new Error("DB tekshiruvi kutilmagan javob qaytardi.");
    console.log(`DB ulanishi ishladi: ${result[0].database}`);
  } finally {
    await sql.end();
  }
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
});
