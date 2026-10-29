import { config } from "dotenv";
import argon2 from "argon2";
import { eq } from "drizzle-orm";

import { getDatabase, getSqlClient } from "../src/db";
import { users } from "../src/db/schema";
import { generatePin } from "../src/lib/auth/pin";
import { normalizePhone } from "../src/lib/auth/phone";

config({ quiet: true });

async function main() {
  const phone = normalizePhone(process.env.SUPER_ADMIN_PHONE || "");
  const fullName = process.env.SUPER_ADMIN_NAME?.trim();
  if (!phone || !fullName) throw new Error(".env da SUPER_ADMIN_PHONE va SUPER_ADMIN_NAME ni belgilang");
  const existing = await getDatabase().select({ id: users.id }).from(users).where(eq(users.phone, phone)).limit(1);
  if (existing.length) throw new Error("Bu telefon raqami allaqachon mavjud; seed qayta ishlamaydi");
  const pin = generatePin();
  await getDatabase().insert(users).values({
    phone,
    fullName,
    role: "super_admin",
    passwordHash: await argon2.hash(pin),
    mustChangePassword: true,
  });
  console.log(`Super admin yaratildi: ${fullName} (${phone})`);
  console.log(`Bir martalik PIN: ${pin}`);
  console.log("PINni hozir xavfsiz saqlang; keyin qayta ko'rib bo'lmaydi.");
}

main().catch((error) => { console.error(error.message); process.exitCode = 1; }).finally(async () => {
  await getSqlClient().end();
});
