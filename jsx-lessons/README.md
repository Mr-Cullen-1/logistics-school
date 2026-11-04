# JSX darslar joylashuvi

Bu papka yuklashga tayyor dars manbalarini saqlaydi. Platformaning Next.js kodi va generatsiya qilingan runtime fayli bu yerga qo'yilmaydi.

```text
jsx-lessons/
├─ intro/
│  └─ INTRO.learn.jsx
├─ module-01/
│  ├─ M1L01.learn.jsx
│  ├─ M1L02.learn.jsx ... M1L07.learn.jsx
│  └─ M1L08.learn.jsx
├─ module-02/ ... module-04/
└─ practice/
   ├─ M1L01/
   │  ├─ M1L01.p01.jsx
   │  └─ ... M1L01.p10.jsx
   └─ ... M4L08/
```

Har bir `module-XX` papkasiga faqat shu modulning 8 ta Learn fayli joylanadi. `practice/<dars kodi>/` papkasida faqat shu darsning 10 ta Practice fayli bo'ladi. Intro uchun practice yo'q. Hozirgi `.gitkeep` fayllari bo'sh papkalarni Gitda saqlaydi; dars fayllari yozilganda olib tashlanadi.

Fayl nomlari va ichki shartnoma: [`../new docs/JSX_CONTRACT.md`](../new%20docs/JSX_CONTRACT.md). Dars mazmuni: [`../new docs/COURSE.md`](../new%20docs/COURSE.md). Intro etaloni: [`../new docs/INTRO_ETALON.md`](../new%20docs/INTRO_ETALON.md). Barcha Learn va Practice ekranlari uchun rang va stil: [`LESSON_DESIGN.md`](LESSON_DESIGN.md).

Intro'ni lokal tekshirish: bir terminalda `npm run dev`, ikkinchisida `node_modules\.bin\tsx.cmd scripts/check-intro-lesson.ts` (Windows). Sinov localhost:3000 dagi runtime iframe ichida barcha 9 ekranni ochadi.

Hozir tayyor fayl — `intro/INTRO.learn.jsx`. U 9 ta ekran, `uz/ru/en` matnlari, har ekran uchun alohida harakat, javobga mos vizual feedback, CSS 3D o'tishlar va `public/` dagi mavjud rasmlardan foydalanadi; audio yo'q. 9-ekranda birinchi urinish ko'rsatkichi, tanlangan maqsad/qiyinchilik, uchta xulosa va keyingi bosqich bor. Platformaning yakun sahifasida **Qayta ko'rish**, **Chiqish**, **Darslarni boshlash** tugmalari ko'rinadi; kurs dostupi bo'lmasa oxirgisi o'chiq.

`module-01/M1L01.learn.jsx` — 19 slaydli birinchi Learn darsi: boshida 5 ta nazariy qoida (SVO, be, have/need, Yes/No va Wh-savollar), keyin avvalgi 14 ekran. Nazariyada 2D so'z sxemalari va xatoni tuzatadigan 3D aylanuvchi kartalar bor. Matn va topshiriqlar `MODULE1_LESSONS.md` dagi M1L01 bo'limidan olingan. Dars platformaning to'q fon, tilla aksent va shisha kartalaridan foydalanadi (`LESSON_DESIGN.md`). Vaziyat ekranidagi Dallas–Atlanta yo'li `rive/m1l01/scene.rml` dan yig'ilgan lokal Rive animatsiyasi; yuk mashinasi, kartalar va javob holatlaridagi 3D/2D effektlar CSS orqali ishlaydi. Ovoz va tashqi media yo'q. Rive sahnasini o'zgartirsangiz, `rive rive/m1l01 --once` qilib `rive/m1l01/build/m1l01-route.riv` faylini `runtime/assets/m1l01-route.riv` ga ko'chiring, so'ng `npm run build:runtime` bajaring. Lokal iframe sinovi: `node_modules\.bin\tsx.cmd scripts/check-m1l01-lesson.ts`.

`module-01/M1L02.learn.jsx`–`M1L08.learn.jsx` — qolgan 7 ta mustaqil nazariy dars. Har biri M1L01 kabi keyingi ichki mashqlarni tushuntiruvchi 5 ta animatsiyali nazariy slayddan boshlanadi: qoida yoziladi, misol bo‘laklari yig‘iladi, xato/to‘g‘ri karta aylantiriladi. Asosiy matn, lug‘at, savollar va keyingi slayd tartibi `module-01/MODULE1_LESSONS.md` dan, boshlang‘ich besh qoida `scripts/module1-theory.mjs` dan olinadi. M1L01 etalonidagi to‘q fon, tilla aksent, Rive marshruti, harakatlanuvchi yuk mashinasi, ketma-ket paydo bo‘lish va 3D kartalar ishlatiladi. `M1L02` va `M1L08` jami 19 slayd, `M1L03`–`M1L07` jami 20 slayd; `M1L08` da 8 savolli yakuniy checkpoint bor. Fayllar `node scripts/generate-module1-learn.mjs` bilan qayta yaratiladi. Bu fayllarda hozir kontentning o‘zbekcha izohlari bor; `ru/en` tarjimalar manbada hali tayyor emas. Fayllar lokal manba sifatida yozilgan, platformaga alohida yuklash va Preview qilish kerak.

`practice/M1L01/` ichida p01–p10 Practice fayllari tayyor: MC, MATCH, READ-MC, GAP, ORDER, FIX, SORT, READ-TYPE va uch qadamli SCENE. Har bir fayl bitta topshiriq; ovoz yo'q. Platforma barcha 10 fayl uchun umumiy shisha kartali `PracticeTask` ko'rinishini ishlatadi va tekshirish tugmasini o'zi beradi.

`practice/M1L02/`–`practice/M1L08/` ichida ham har dars uchun p01–p10, jami 70 ta alohida Practice fayli tayyor. Topshiriqlar `new docs/COURSE.md` dagi mexanika va mavzu rejasiga mos; dizayn, animatsiya, tekshirish va feedback M1L01 bilan bir xil `PracticeTask` komponentidan keladi. `TYPE` yozma javob, `REPLY` javob tanlash sifatida ishlaydi. Kontent manbasi va qayta yaratish buyrug'i: `node scripts/generate-module1-practice.mjs`. Yangi fayllar lokal manba, platformaga yuklash va har birini Preview qilish alohida bajariladi.

Practice iframe sinovi: `node_modules\.bin\tsx.cmd scripts/check-m1l01-practice.ts` (Windows). U 10 faylni kompilyatsiya qilib, har biriga to'g'ri javobni iframe ichida tekshiradi.

Admin paneldagi dars sahifasida Learn fayli alohida birma-bir, Practice fayllari esa 1–10 tadan bir vaqtda tanlanadi. Bir xil dars kodi, `p01`–`p10` nomlari va mexanika tekshiriladi. Yuklash natijasi har fayl uchun alohida ko'rinadi; xato fayl qoladi va qayta yuboriladi. M1L01 mexanikalari avtomatik tanlanadi, boshqa darslarda admin belgilaydi. Nashr qilishdan avval 11 faylning har birini iframe Preview orqali tekshirish kerak.

Manbani o'zgartirgach, yangi holatni o'quvchida ko'rish uchun super admin `/admin/intro` orqali `/admin/lessons/[id]` ga o'tib JSX faylni draft sifatida qayta yuklaydi, Preview qiladi va nashr qiladi. Git commit yoki lokal faylning o'zgarishi bazadagi joriy versiyani almashtirmaydi.
