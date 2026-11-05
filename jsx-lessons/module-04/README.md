# Module 4 — Professional Logistics English

8 ta mustaqil, yuklashga tayyor Learn JSX. Jami 73 nazariy slayd; alohida p01–p10 Practice fayllari keyingi bosqichda yaratiladi.

| Dars | Nazariya | Jami slayd |
|---|---:|---:|
| M4L01 — Talking to Brokers | 8 | 24 |
| M4L02 — Load Booking Conversations | 9 | 25 |
| M4L03 — Rate Negotiation | 9 | 25 |
| M4L04 — Communicating with Drivers | 9 | 25 |
| M4L05 — Pickup and Delivery Coordination | 9 | 25 |
| M4L06 — Handling Delays and Emergencies | 9 | 25 |
| M4L07 — Resolving Disputes Professionally | 10 | 26 |
| M4L08 — Full Logistics Communication Simulation + Final Assessment | 10 | 26 |

## Oqim va baholash

Hook → 8–10 nazariya → mission → dalillar → hujjatlarni solishtirish → notice/pattern → vocabulary → guided analysis → gap tuzish → reading/check → xatoni tuzatish → yozma detallar → role-play → final test → phrase bank.

Har qoida: chuqur izoh, uch bosqichli sxema, ikkita tushuntirish, tarjimali misol, xato/to‘g‘ri flip karta. Vaziyatdagi raqam, vaqt, vakolat va tasdiq holati qarorni belgilaydi. Shartlar o‘quv misollariga xos.

Oddiy dars finali 6 savol, jumladan 2 yozma javob; o‘tish uchun kamida 4/6. M4L08 — yagona yuk tarixining rivojlanishi bo‘yicha 12 savol, jumladan 4 yozma javob; kamida 9/12. Tanlovlar aralashtiriladi. Birinchi urinish hisoblanadi; orqaga qaytish javob tarixini tozalamaydi. Finaldan o‘tilmasa alohida qayta urinish bor. Yozma javoblar ko‘rsatilgan qisqa qolip va ruxsat etilgan variantlarga asoslanadi; raqam, ID, inkor va vaqt zonasi saqlanadi.

## Dizayn

To‘q zumrad operatsion panel, och platina matn, amber aksent. CSS 3D konsol, 2D signal oqimi, ketma-ket yozilish, flip kartalar va slayd o‘tishlari. Animatsiyani to‘xtatish/yoqish va reduced-motion mavjud; ovoz va tashqi media yo‘q. Desktopda ixcham joylashuv, mobil ekranda kerakli ichki scroll va ko‘rinadigan navigatsiya.

## Manbalar va qayta yaratish

- Kontent rejasi: `new docs/MODULE4_CONTENT.md`.
- Kontent: `scripts/module4-content-a.mjs`, `module4-content-b.mjs`, `module4-content-c.mjs`.
- Yordamchilar: `scripts/module4-helpers.mjs`.
- Ko‘rinish: `scripts/module4-scenes.jsx.txt`, `scripts/module4-theme.css`.
- Generator barqaror Module 1 template va Module 3 hook/document/details komponentlaridan foydalanadi; ularni o‘zgartirmaydi.

```powershell
node scripts/generate-module4-learn.mjs
node_modules\.bin\tsx.cmd scripts/check-module4-learn.ts
$env:LAYOUT_MODULE='4'; node_modules\.bin\tsx.cmd scripts/check-module2-layout.ts
```

Tekshiruvlar faqat lesson sandboxga tegishli; butun platforma buildi talab qilinmaydi. O‘zbekcha izohlar va inglizcha ish vaziyatlari mavjud; ru/en tarjimalar hali yozilmagan.

Git push bazadagi darsni yangilamaydi. Learn admin API orqali alohida yuklanadi, Preview OK va current/published qilinadi. Darsning umumiy holati 10 ta Practice nashr talablariga javob bermaguncha draft bo‘lib turadi.

## Yuklash holati — 2026-11-05

M4L01–M4L08 productionga yuklandi: har birida Learn v1 `published/current`, server xeshi lokal JSX bilan bir xil. Har darsda 0 ta standalone Practice; umumiy lesson holati `draft`. Yuklash mavjud readiness qoidalarini chetlab o‘tmadi.

Tekshiruv: barcha fayllar kompilyatsiyasi; M4L01 va M4L08 sandbox oqimi, 2D/3D harakat, yozma javob, finaldan yiqilish/qayta urinish va natija callbacki; 8 darsning desktop joylashuvi uch o‘lchamda. Aniqlangan 7 px overflow ixcham padding bilan tuzatildi va tegishli slaydlar qayta tekshirildi. Mobil namunada gorizontal overflow yo‘q, navigatsiya ko‘rinadi.
