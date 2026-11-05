# Module 2 — Everyday Communication

8 ta mustaqil, yuklashga tayyor **Learn JSX** fayli. Kontent `new docs/COURSE.md` ning Module 2 rejasidan ishlab chiqilgan. Inglizcha misollar va o‘zbekcha tushuntirishlar; `ru/en` interfeys tarjimalari hali yo‘q.

| Fayl | Mavzu | Yakuniy test |
|---|---|---|
| [M2L01.learn.jsx](M2L01.learn.jsx) | Introducing Yourself Professionally | 4 savol |
| [M2L02.learn.jsx](M2L02.learn.jsx) | Asking for Information | 4 savol |
| [M2L03.learn.jsx](M2L03.learn.jsx) | Numbers, Dates and Times | 4 savol |
| [M2L04.learn.jsx](M2L04.learn.jsx) | Spelling and Confirming Details | 4 savol |
| [M2L05.learn.jsx](M2L05.learn.jsx) | Making and Answering Phone Calls | 4 savol |
| [M2L06.learn.jsx](M2L06.learn.jsx) | Filling Out Forms | 4 savol |
| [M2L07.learn.jsx](M2L07.learn.jsx) | Writing Simple Work Emails | 4 savol |
| [M2L08.learn.jsx](M2L08.learn.jsx) | Confirming Information in Writing | Checkpoint 2: 8 savol |

## Har bir darsning 20 slaydi

1. **Hook** — ishdagi muammo va dars natijasi.
2. **5 ta nazariy slayd (2–6)** — qoida, uch bo‘lakli 2D sxema, ikki izoh, tarjimali misol va xato/to‘g‘ri 3D karta. Bular keyingi ichki mashqlarni tushuntiradi.
3. **Mission (7)** — mavzuga mos vaziyat va savol.
4. **Read (8)** — suhbat yoki email.
5. **Notice va Pattern (9–10)** — ochiladigan ibora va qolip kartalari.
6. **Vocabulary (11)** — 8 ta aylanuvchi lug‘at kartasi.
7. **Guided check (12)** — 3 savol.
8. **Build (13)** — aralashtirilgan bo‘laklardan 3 gap.
9. **Read va Read check (14–15)** — yangi manba va uning detali bo‘yicha savol.
10. **Fix it (16)** — 2 ta xato tuzatish savoli.
11. **Apply (17)** — manbadan yozma ma’lumot kiritish; M2L06 da 6 maydonli yuk formasi.
12. **Role-play (18)** — uch bosqichli javob tanlash.
13. **Rapid test / Checkpoint 2 (19)** — natija kartasi va qayta urinish.
14. **Summary (20)** — 6 iborali phrase bank, ovozsiz o‘zini baholash va yakunlash.

M2L07 dagi o‘qish manbalari uchta emaildan iborat: rate request, attachment va follow-up. Telefon suhbatlari matn ko‘rinishida; ovoz yozilmaydi va ijro etilmaydi.

## Dizayn va ishlash

- Module 1 dan farqli **to‘q ko‘k + firuza + och ko‘k**, sarlavhalarda shampan aksenti. Module 1 va umumiy Practice stiliga tegilmaydi.
- Hook va Mission: 2D xabar oqimi, perspektivaga ega CSS 3D xabar kartasi, pauza tugmasi.
- Nazariya: matn yozilishi → sxema bo‘laklari → izohlar → misol/tarjima → 3D tuzatish. **Qayta** va **Hammasi** boshqaruvi saqlangan.
- Barcha 20 slaydda sarlavha ustidagi takroriy tur/kod qatori olib tashlangan. Progress va mashq ichidagi kerakli belgilar saqlangan.
- Balandligi 760px gacha bo‘lgan desktop iframe uchun ichki bo‘shliqlar ixcham. Desktopda Mission variantlari ikki ustunda, ma’lumot kiritish maydonlari uch ustunda; ekran va asosiy karta geometriyasi, animatsiya ketma-ketligi saqlangan.
- Variantlar hamda gap bo‘laklari bir marta aralashtiriladi; javob identifikatori joylashuvdan mustaqil.
- `prefers-reduced-motion` yoqilganda mazmun statik ko‘rinadi. Kichik ekranda asosiy karta ichida vertikal scroll, navigatsiya esa ko‘rinadigan joyda qoladi.
- JSX ichida React, ma’lumot, SVG va CSS bor. Tashqi rasm, CDN, Rive fayli, audio yoki API talab qilinmaydi.
- Iframe `allow-scripts` rejimiga mos: yozma mashq JS tugmasi/Enter orqali tekshiriladi, native form submission ishlatilmaydi.
- Oddiy dars testi: kamida 60% (4 tadan 3). Checkpoint: kamida 70% (8 tadan 6). Yetarli ball bo‘lmasa qayta urinish kerak. Ichki mashqlar mustahkamlash uchun; yakuniy ball tezkor testdan olinadi.
- `onProgress` va bir martalik `onFinished` platforma shartnomasiga mos; `answers` da slayd kesimidagi mashq natijalari beriladi.

## Tahrirlash va qayta yaratish

Manba fayllar:

- `scripts/module2-content.mjs` — M2L01–M2L04.
- `scripts/module2-content-writing.mjs` — M2L05–M2L08.
- `scripts/module2-scenes.jsx.txt` — xabar animatsiyasi, Hook va yozma mashq.
- `scripts/module2-theme.css` — faqat Module 2 uslubi.
- `scripts/generate-module2-learn.mjs` — ketma-ketlik, yozma mashq ma’lumotlari va generatsiya. Module 1 shablonidan mustaqil JSX chiqaradi; Module 1 fayllarini o‘zgartirmaydi.

```powershell
node scripts/generate-module2-learn.mjs
node_modules\.bin\tsx.cmd scripts/check-module2-lessons.ts
node_modules\.bin\tsx.cmd scripts/check-module2-layout.ts
```

Tekshiruv alohida lokal iframe ichida ishlaydi; DB, login yoki ishlab turgan Next dev server kerak emas. Barcha 8 fayl kompilyatsiyasi, 20 slaydli oqim, ball payloadi, 2D/3D harakat, mobil yozma mashq va checkpoint qayta urinishi tekshiriladi.

`check-module2-layout.ts` — alohida fokuslangan layout tekshiruvi: barcha 8 darsning 20 slaydi 1536×650, 1280×620 va 1920×810 iframe o‘lchamlarida. To‘liq ochilgan nazariya, aylantirilgan karta, savol feedbacki va to‘ldirilgan forma holatlari tekshiriladi. 2026-11-05 tekshiruvida shu o‘lchamlarda ichki scroll yo‘q, footer ko‘rinadi. Kichik/mobil ekranda mazmun kesilmaydi, zarur scroll saqlanadi. Faqat tegishli dars/slaydni tekshirish uchun `M2_LAYOUT_LESSON=M2L06` va `M2_LAYOUT_SLIDES=7,17` muhit o‘zgaruvchilari mavjud.

## Yuklash

Admin panelda tegishli `M2L0x` darsini oching → **Fayl yuklash** → **Learn** → shu koddagi `.learn.jsx` faylini tanlang. Generator manbalarini yuklamang. Dars ichidagi mashqlar Learn tarkibida. Alohida 80 ta Practice fayli `../practice/M2L01/`–`../practice/M2L08/` papkalarida tayyor: [Practice qo‘llanmasi](../practice/MODULE2_PRACTICE.md). Ularni **Practice** turi orqali har darsga 10 tadan yuklang. Lokal fayl yaratilishi bazadagi darsni avtomatik yuklamaydi yoki nashr qilmaydi.

2026-11-05: M2L01–M2L08 Learn fayllari platformaning bazasiga v1 sifatida yuklandi, tasdiqlandi va joriy nashr sifatida saqlandi. Fayl xeshlari lokal JSX bilan tekshirildi. Shu kuni har darsning 10 ta alohida Practice fayli ham productionga yuklanib nashr qilindi. M2L01–M2L08 ning barchasi `published`: har birida 1 Learn + 10 Practice. Practice xeshlari va production API nashr holati tekshirildi.

2026-11-05 yangilanish: takroriy sarlavha belgisi va desktop scroll tuzatishlari bilan barcha 8 Learn fayli **v2** sifatida productionga yuklandi va joriy nashr qilindi. Production API holati va bazadagi SHA-256 lokal JSX bilan mosligi tekshirildi. Har darsning 10 ta joriy Practice identifikatori o‘zgarmadi.
