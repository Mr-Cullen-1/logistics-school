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

Fayl nomlari va ichki shartnoma: [`../new docs/JSX_CONTRACT.md`](../new%20docs/JSX_CONTRACT.md). Dars mazmuni: [`../new docs/COURSE.md`](../new%20docs/COURSE.md). Intro etaloni: [`../new docs/INTRO_ETALON.md`](../new%20docs/INTRO_ETALON.md).

Intro'ni lokal tekshirish: bir terminalda `npm run dev`, ikkinchisida `node_modules\.bin\tsx.cmd scripts/check-intro-lesson.ts` (Windows). Sinov localhost:3000 dagi runtime iframe ichida barcha 9 ekranni ochadi.
