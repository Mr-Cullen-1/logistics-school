# Module 4 — Practice

M4L01–M4L08 uchun 10 tadan, jami **80 ta mustaqil JSX**. Kontent `new docs/MODULE4_CONTENT.md` va tegishli Learn darslaridagi T1–T10 qoidalariga bog‘langan (`theoryRefs`). Yangi case shartlari, vaqtlar va vakolatlar o‘quvchini qarorni qayta chiqarishga undaydi.

| Dars | Amaliy ko‘nikma |
|---|---|
| M4L01 | Broker bilan availability, qualification va booking holatlarini ajratish |
| M4L02 | Yangi rate con, kelishuv va driver imkoniyatini birga tekshirish |
| M4L03 | Total, xizmat hajmi, counteroffer va acceptance |
| M4L04 | Driverga tasdiqlangan ko‘rsatma, check-back va vakolat |
| M4L05 | Appointment, loading/transit hisobi va revised slot |
| M4L06 | Hodisa, ETA, update va tasdiqlanmagan taxmin |
| M4L07 | Signed record, hisob, approval va settlement chegarasi |
| M4L08 | Kurs bo‘yicha ko‘p bosqichli qaror va handover |

Har to‘plamda kamida 5 mexanika, 2 reading, 2 yozma topshiriq va FIX mavjud. p10 — 3 bosqichli SCENE. Qolgan slotlar kontent rejasiga mos MC, MATCH, READ-MC, GAP/ORDER, TYPE, FIX, REPLY va READ-TYPE dan tuzilgan. M4L08 da 3 ta yozma vazifa bor.

Variantlar professional va yaqin ma’noli; xato variant bitta muhim fakt yoki shartni buzadi. Variantlar va ORDER bo‘laklari ochilishda aralashadi. Xato feedback tekshiriladigan detalni ko‘rsatadi; muvaffaqiyat feedbacki sababini tushuntiradi. Yozma javoblar chegaralangan maydonlardan iborat, erkin matn sifati string tengligi bilan baholanmaydi. Case shartlari xayoliy o‘quv vaziyatlariga tegishli.

## Dizayn va runtime

Module 4 Learn bilan bir xil zumrad/platina/amber palitra, `.m4-practice` scope. `PracticeTask` ning karta hajmi, 2D/3D kirish va feedback animatsiyalari, mobil ko‘rinish va reduced-motion saqlanadi. Tekshirish tugmasi platformada; ovoz yo‘q.

Yangi fayllarda `normalization: "meaningful"`: yozma javobda decimal, ID, vaqt zonasi, AM/PM, inkor va birlik saqlanadi. Harf registri, ortiqcha bo‘shliq, yakuniy tinish belgilari va minglik verguli normallashtiriladi. Oldingi modullar avvalgi tekshiruvdan foydalanadi. Ushbu runtime o‘zgarishi productionga deploy bo‘lgach fayllarni nashr qilish kerak.

## Manbalar va tekshiruv

- `scripts/module4-practice-a.mjs`, `module4-practice-b.mjs`, `module4-practice-c.mjs`: 80 topshiriq.
- `scripts/module4-practice-helpers.mjs`: umumiy kontent shakli.
- `scripts/module4-practice-theme.css`: modul ranglari.
- `scripts/generate-module4-practice.mjs`: generatsiya va tarkib talablari.
- `scripts/check-module4-practice.ts`: 80 fayl kompilyatsiyasi/nashr talablari va mexanikalardan bittadan sandbox namunasi.

```powershell
node scripts/generate-module4-practice.mjs
npm.cmd run build:runtime
node_modules\.bin\tsx.cmd scripts/check-module4-practice.ts
```

Admin panelda tegishli darsga p01–p10 birgalikda yuklanadi va nashr qilinadi. Mavjud current Learn saqlanadi. Git push bazaga fayllarni o‘zi yuklamaydi.

## Production nashri — 2026-11-05

80/80 Practice fayli tegishli M4L01–M4L08 darslariga yuklandi va v1 `published/current` qilindi. 8/8 dars `published`: har birida 1 Learn + 10 Practice. Server xeshlari va mexanika metama’lumotlari lokal fayllarga mos; current Learn identifikatori va xeshi saqlandi. Yangi `meaningful` runtime production manzilida yuklashdan oldin tasdiqlandi.

Qisqa tekshiruv: 80 fayl kompilyatsiyasi va 8 to‘plam readiness talablari, har mexanikadan bittadan sandbox namunasi, xato/to‘g‘ri callback, mobil MATCH/TYPE hamda final READ-TYPE. Ikki kichik kit/normalizatsiya testi o‘tdi. Kontent reviewida aniqlangan review va next-update farqi M4L07 p10 matnida aniqlandi.
