# JSX darslar joylashuvi

Bu papka yuklashga tayyor dars manbalarini saqlaydi. Platformaning Next.js kodi va generatsiya qilingan runtime fayli bu yerga qo'yilmaydi.

```text
jsx-lessons/
├─ intro/
│  └─ INTRO.learn.jsx
├─ module-01/
│  ├─ M1L01.learn.jsx
│  └─ ... M1L08.learn.jsx
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

`practice/M1L01/` ichida p01–p10 Practice fayllari tayyor: MC, MATCH, READ-MC, GAP, ORDER, FIX, SORT, READ-TYPE va uch qadamli SCENE. Har bir fayl bitta topshiriq; ovoz yo'q. Platforma barcha 10 fayl uchun umumiy shisha kartali `PracticeTask` ko'rinishini ishlatadi va tekshirish tugmasini o'zi beradi.

Practice iframe sinovi: `node_modules\.bin\tsx.cmd scripts/check-m1l01-practice.ts` (Windows). U 10 faylni kompilyatsiya qilib, har biriga to'g'ri javobni iframe ichida tekshiradi.

Admin paneldagi dars sahifasida Learn fayli alohida birma-bir, Practice fayllari esa 1–10 tadan bir vaqtda tanlanadi. Bir xil dars kodi, `p01`–`p10` nomlari va mexanika tekshiriladi. Yuklash natijasi har fayl uchun alohida ko'rinadi; xato fayl qoladi va qayta yuboriladi. M1L01 mexanikalari avtomatik tanlanadi, boshqa darslarda admin belgilaydi. Nashr qilishdan avval 11 faylning har birini iframe Preview orqali tekshirish kerak.

Manbani o'zgartirgach, yangi holatni o'quvchida ko'rish uchun super admin `/admin/intro` orqali `/admin/lessons/[id]` ga o'tib JSX faylni draft sifatida qayta yuklaydi, Preview qiladi va nashr qiladi. Git commit yoki lokal faylning o'zgarishi bazadagi joriy versiyani almashtirmaydi.
