# Coliseum English Platform

Alohida ta'lim platformasi. Reja: [PLAN.md](PLAN.md). Landing sayti mustaqil qoladi.

## Qoidalar

- Stack: Next.js App Router, TypeScript, Tailwind, Drizzle, PostgreSQL, jose, argon2, sucrase, zod.
- Interfeys tili: o'zbek. Ro'yxatdan o'tish yo'q; akkauntni faqat admin yaratadi.
- Kirish: `+998XXXXXXXXX` telefon + parol. Birinchi kirish admin bergan PIN bilan; keyin parolni almashtirish majburiy.
- PIN va parol faqat hash ko'rinishida saqlanadi, logga yozilmaydi.
- Rollar: `super_admin`, `admin`, `student`. Dars yuklash faqat `super_admin` uchun.
- Darslar faqat `.jsx`; ular `allow-scripts` sandbox iframe ichida, `allow-same-origin` siz ishlaydi.
- Rol va kurs dastupini serverda har safar tekshir; middlewarega yolg'iz ishonma.
- Dizayn manbasi: `coliseum_logistics_assets/`. Asosiy fon `#0D1114`, bronza aksent, ivory matn; ortiqcha glow yo'q.
- Har bosqichdan keyin lint, typecheck, test va tegishli ishlash tekshiruvi; so'ng commit.
- Secrets faqat `.env` da, git'ga qo'shilmaydi.

## Buyruqlar

- `npm run dev`, `npm run build`, `npm run lint`, `npm run typecheck`, `npm test`
- `npm run db:generate`, `npm run db:migrate`, `npm run db:check`
- `npm run seed:super-admin` va `npm run build:runtime` keyingi bosqichlarda qo'shiladi.
