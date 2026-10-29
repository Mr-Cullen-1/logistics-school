# Coliseum English Platform

Coliseum Logistics School o'quvchilari uchun alohida ingliz tili platformasi. To'liq bosqichlar va qarorlar [PLAN.md](PLAN.md) da.

## Lokal ishga tushirish

1. Node.js 20.9+ va Supabase loyihasini tayyorlang.
2. `npm install` ni bajaring.
3. Supabase Dashboard'da **Connect > Session pooler** ni tanlab, URI ni ko'chiring. U `postgres.[PROJECT-REF]` username, pooler host va `5432` portidan foydalanadi. Parolni URL-encode qilib, `.env.example` dan yaratilgan `.env` faylida `DATABASE_URL` ga yozing. `.env.example` ga haqiqiy parolni yozmang; `.env` git'ga kiritilmaydi.
4. `npm run db:migrate` va `npm run db:check` ni bajaring.
5. `npm run dev` ni ishga tushiring va `http://localhost:3000` ni oching.

## Tekshiruvlar

`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.

`npm run db:generate` sxema o'zgarganda keyingi SQL migratsiyani yaratadi. `npm run db:migrate` uni `DATABASE_URL` ko'rsatgan Supabase bazasiga session pooler orqali qo'llaydi. 0-bosqichda yaratilgan boshlang'ich migratsiya `drizzle/` ichida saqlanadi. DB klienti har bir server instance uchun ko'pi bilan bitta ulanish, 20 soniyalik idle timeout va majburiy SSL bilan sozlangan.

`coliseum_logistics_assets/` dizayn manbasi sifatida saqlangan. Undagi rasmlar konseptual namuna; ishlab chiqarish saytiga qo'yishdan oldin tasdiqlangan original rasmlar kerak.

## Dizayn tizimi

`/design-system` sahifasida rang palitrasi, Inter shrifti, Button, Input, Card, Table, Modal va Toast namunalari bor. Ranglar va komponent uslubi `coliseum_logistics_assets/` paketidan olingan; sahifadagi kurs va dars nomlari faqat namuna.
