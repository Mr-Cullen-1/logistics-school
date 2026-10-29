# Coliseum English Platform

Coliseum Logistics School o'quvchilari uchun alohida ingliz tili platformasi. To'liq bosqichlar va qarorlar [PLAN.md](PLAN.md) da.

## Lokal ishga tushirish

1. Node.js 20.9+ va PostgreSQL ulanish manzilini tayyorlang.
2. `npm install` ni bajaring.
3. `.env.example` dan `.env` nusxa oling va `DATABASE_URL` ni haqiqiy Neon yoki Supabase PostgreSQL connection string bilan almashtiring. `.env` git'ga kiritilmaydi.
4. `npm run db:migrate` va `npm run db:check` ni bajaring.
5. `npm run dev` ni ishga tushiring va `http://localhost:3000` ni oching.

## Tekshiruvlar

`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.

`npm run db:generate` sxema o'zgarganda keyingi SQL migratsiyani yaratadi. `npm run db:migrate` uni `DATABASE_URL` ko'rsatgan bazaga qo'llaydi. 0-bosqichda yaratilgan boshlang'ich migratsiya `drizzle/` ichida saqlanadi.

`coliseum_logistics_assets/` dizayn manbasi sifatida saqlangan. Undagi rasmlar konseptual namuna; ishlab chiqarish saytiga qo'yishdan oldin tasdiqlangan original rasmlar kerak.
