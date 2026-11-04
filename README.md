# Coliseum English Platform

Coliseum Logistics School o'quvchilari uchun alohida ingliz tili platformasi. Boshlang'ich reja [PLAN.md](PLAN.md) da, amaldagi JSX platforma talablari [`new docs/PLAN.md`](new%20docs/PLAN.md) va [`new docs/INTRO_ETALON.md`](new%20docs/INTRO_ETALON.md) da.

## Lokal ishga tushirish

1. Node.js 20.9+ va Supabase loyihasini tayyorlang.
2. `npm install` ni bajaring.
3. Supabase Dashboard'da **Connect > Session pooler** ni tanlab, URI ni ko'chiring. U `postgres.[PROJECT-REF]` username, pooler host va `5432` portidan foydalanadi. Parolni URL-encode qilib, `.env.example` dan yaratilgan `.env` faylida `DATABASE_URL` ga yozing. `.env.example` ga haqiqiy parolni yozmang; `.env` git'ga kiritilmaydi.
4. `npm run db:migrate` va `npm run db:check` ni bajaring.
5. `.env` ga kamida 32 belgili tasodifiy `SESSION_SECRET` yozing. Haqiqiy super admin uchun `SUPER_ADMIN_PHONE` va `SUPER_ADMIN_NAME` ni kiriting, so'ng `npm run seed:super-admin` ni **bir marta** ishga tushiring. Skript PINni terminalda bir marta ko'rsatadi; bazada faqat argon2 hash saqlanadi.
6. `npm run dev` ni ishga tushiring va `http://localhost:3000/login` ni oching. Birinchi kirishda PIN, undan keyin kamida 8 belgili yangi parol ishlatiladi.

## Tekshiruvlar

`npm run lint`, `npm run typecheck`, `npm test`, `npm run build`.

`npm run db:generate` sxema o'zgarganda keyingi SQL migratsiyani yaratadi. `npm run db:migrate` uni `DATABASE_URL` ko'rsatgan Supabase bazasiga session pooler orqali qo'llaydi. 0-bosqichda yaratilgan boshlang'ich migratsiya `drizzle/` ichida saqlanadi. DB klienti har bir server instance uchun ko'pi bilan bitta ulanish, 20 soniyalik idle timeout va majburiy SSL bilan sozlangan.

`coliseum_logistics_assets/` dizayn manbasi sifatida saqlangan. Undagi rasmlar konseptual namuna; ishlab chiqarish saytiga qo'yishdan oldin tasdiqlangan original rasmlar kerak.

## Autentifikatsiya

Telefon raqami `+998XXXXXXXXX` formatiga keltiriladi. 5 ta xato urinishdan keyin telefon yoki IP bo'yicha 15 daqiqa kirish cheklanadi. Sessiya 7 kun amal qiladi; parol almashtirilsa eski sessiyalar yaroqsiz bo'ladi. `src/proxy.ts` tezkor yo'naltirish qiladi, server sahifalari va API esa bazadagi faol holat va sessiya versiyasini tekshiradi.

Ishlab turgan lokal server (`npm run dev -- --port 3137`) bilan `npm run test:auth` Supabase'da vaqtinchalik test foydalanuvchisi yaratib, PIN, parol almashtirish, sessiya, rol va rate limit oqimini tekshiradi; test yozuvlarini yakunda o'chiradi. Boshqa port uchun `AUTH_BASE_URL` ni belgilang.

## O'quvchilar boshqaruvi

Admin yoki super admin `/admin/students` sahifasida o'quvchilarni qidiradi, yangi akkaunt yaratadi, bloklaydi/faollashtiradi va PINni tiklaydi. Yangi PIN faqat o'sha amal javobida ko'rinadi; keyin bazadan olinmaydi. Har bir o'zgarish `audit_log` ga yoziladi, bloklash va PIN tiklash eski sessiyalarni bekor qiladi. Lokal server 3137-portda ishlayotganida `npm run test:students` vaqtinchalik admin va o'quvchi bilan shu oqimni Supabase'da tekshirib, test yozuvlarini o'chiradi.

Super admin `/admin/admins` sahifasida admin akkaunt yaratadi. Tizim 6 xonali PINni faqat bir marta ko'rsatadi; yangi admin birinchi kirishda parolini majburiy almashtiradi. Oddiy admin bu sahifa va yaratish API'siga kira olmaydi. `AUTH_BASE_URL` ishlayotgan lokal serverga ko'rsatilganda `npm run test:admins` vaqtinchalik akkauntlar bilan ushbu oqimni tekshiradi va ularni o'chiradi.

## Dizayn tizimi

`/design-system` sahifasida rang palitrasi, Inter shrifti, Button, Input, Card, Table, Modal va Toast namunalari bor. Ranglar va komponent uslubi `coliseum_logistics_assets/` paketidan olingan; sahifadagi kurs va dars nomlari faqat namuna.

## Kurs, modul va dostup

Super admin `/admin/courses` sahifasida kurslar va modullarni yaratadi, tahrirlaydi, tartiblaydi va nashr qiladi. Admin kurslar va modullarni ko'radi; `/admin/students/[id]` orqali o'quvchiga kurs dostupi beradi yoki bekor qiladi. Muddat ixtiyoriy; tanlangan sana Toshkent vaqti bilan shu kun oxirida tugaydi. O'quvchi `/learn` sahifasida faqat nashr qilingan va faol dostupi bor kurslarni ko'radi; `/learn/[courseId]` manzili ham serverda tekshiriladi.

3137-portdagi lokal server bilan `npm run test:courses` Supabase'da vaqtinchalik akkauntlar va kurslar yaratib, rol, CRUD, tartib, muddat, bekor qilish, URL cheklovi va audit oqimini tekshiradi; test yozuvlarini yakunda o'chiradi. Boshqa port uchun `AUTH_BASE_URL` ni belgilang.

## Intro va dars interfeysi

`/` to'g'ridan-to'g'ri `/login` ga yo'naltiradi. Login/PIN/parol qoidalari saqlanadi. Super admin `/admin/intro` da Intro darsini yaratadi, so'ng `/admin/lessons/[id]` da **Fayl yuklash** oynasini ochadi. Oynada faqat **Turi** (Learn yoki Practice) va **JSX fayl** maydonlari bor. Learn uchun bitta, Practice uchun 1–10 ta mos fayl tanlanadi; mexanika avtomatik aniqlanadi. **Saqlash va nashr qilish** yuklash va nashrni bir amalda bajaradi. Preview uchun ro'yxatdagi ko'z ikonasi bor. To'g'ridan-to'g'ri nashr preview ochilmasdan tasdiqlash sifatida auditga yoziladi. Lokal JSX faylni tahrirlashning o'zi bazadagi nashr qilingan versiyani yangilamaydi.

Nashrdagi Intro login qilgan barcha o'quvchilarga kurs dostupsiz ochiladi. Boshqa darslar faqat admin bergan faol kurs dostupi va nashr holati bilan ochiladi. O'quvchi darsni sidebar/navbarsiz to'liq ekran rejimida ko'radi; Intro 9 ekranli, ovozsiz va `uz/ru/en` tillarida. Natijada qayta ko'rish, chiqish va keyingi darsni boshlash amallari ko'rinadi; keyingi dars ochilmagan bo'lsa boshlash tugmasi o'chiq turadi.

O'quvchi sidebarida **Kurslar** (Intro, Darslar, Imtihonlar, Resurslar) va **Progress** (Sertifikatlarim, Yutuqlarim) yig'iladigan guruhlari, alohida **Mening profilim** bor. Hali tayyor bo'lmagan bo'limlar `Tez orada` holatida. FAQ kartasi 3 savolli modalni va `@coliseumlogistics` Telegram havolasini ochadi. Admin va o'quvchi panellarida asosiy kontent ichki sahifada almashadi, sidebar/navbar joyida qoladi.

Intro manbasi va joylashuvi: [`jsx-lessons/README.md`](jsx-lessons/README.md). Lokal iframe sinovi: `npm run dev` bilan birga `node_modules\.bin\tsx.cmd scripts/check-intro-lesson.ts` (Windows).
