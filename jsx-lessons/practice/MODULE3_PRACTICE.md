# Module 3 — Practice

M3L01–M3L08 uchun **10 tadan, jami 80 ta JSX**. Har fayl o‘z darsining nazariyasidagi atamalar, qoidalar va vaziyatlarga mos. Manba: `new docs/COURSE.md` va `module-03/*.learn.jsx`. Inglizcha manba/javoblar, o‘zbekcha topshiriq va feedback.

## Darslar

| Papka | Mavzu | Asosiy amaliy natija |
|---|---|---|
| [M3L01](M3L01/) | Understanding Load Information | Equipment/vaqt mosligi, loaded RPM va total miles |
| [M3L02](M3L02/) | Reading Rate Confirmations | Asosiy summa, shartli haq, approval, Net 30 trigger |
| [M3L03](M3L03/) | Pickup and Delivery Details | Appointment/FCFS, check-in, dock, PU/seal |
| [M3L04](M3L04/) | Asking for Updates | Location, status, ETA, next update |
| [M3L05](M3L05/) | Explaining Delays and Problems | Because/due to/so, revised ETA, pending appointment |
| [M3L06](M3L06/) | Writing Professional Updates | Fakt, sabab, ETA va keyingi qadamni aniq yozish |
| [M3L07](M3L07/) | Clarifying Instructions | Repeat/clarify/read-back, revised instruction va approval |
| [M3L08](M3L08/) | Handling Workplace Scenarios | Missing BOL, manzil ziddiyati, lumper va kechikishni birga hal qilish |

## Har darsning 10 topshirig‘i

| Slot | Mexanika | Vazifa |
|---|---|---|
| p01 | MC | Nazariy qoida yoki ish qarori |
| p02 | MATCH | 6 atama/ibora va ma’nosini juftlash |
| p03 | READ-MC | Qisqa hujjat/update dagi bir nechta detalni tahlil qilish |
| p04 | GAP | Mavzuga mos grammatik tuzilish |
| p05 | ORDER | Aralashtirilgan bo‘laklardan aniq gap tuzish |
| p06 | FORM | Manba va hisobdan 3–4 maydonli karta |
| p07 | FIX | Grammatik yoki dalilga zid xulosani tuzatish |
| p08 | SORT | Ma’lumotlarni mazmuniga ko‘ra guruhlash |
| p09 | READ-TYPE | Yangi manbadan qisqa yozma javoblar |
| p10 | SCENE | Uch bosqichli ish vaziyati |

Module 2 dan biroz murakkabroq: ikki shartni solishtirish, qisqa hisob, eski va yangi ko‘rsatmani ajratish, tasdiqlangan faktni taxmin/so‘rovdan farqlash. Hamma topshiriq berilgan manba yoki oldingi nazariyaga tayangan; shaxsiy ma’lumot kiritish talab qilinmaydi. Raqamli javoblarda odatiy format variantlari qabul qilinadi.

Yuklar, narxlar va hujjatlardagi shartlar o‘quv namunalari. Qo‘shimcha to‘lovlar faqat aynan berilgan yozma tasdiq va shartlar bo‘yicha talqin qilinadi.

## Stil va mexanika

- Module 3 Learn bilan bir xil grafit/binafsha–mis palitra; ochiq matn, yashil/qizil feedback.
- `@coliseum/kit` dagi `PracticeTask` ishlatiladi. Asosiy karta o‘lchami, 2D/3D kirish va javob animatsiyalari, mobil joylashuv hamda reduced-motion saqlanadi.
- CSS `.m3-practice` bilan chegaralangan; Module 1/2 yoki runtime o‘zgartirilmaydi.
- Variantlar va ORDER bo‘laklari fayl ochilganda bir marta aralashtiriladi. Javob identifikatori joylashuvdan mustaqil.
- `FORM` tashqi metadata’da FORM bo‘lib qoladi; kitning sinalgan TYPE maydonlari orqali ko‘rsatiladi.
- Tekshirish platformaning `registerCheck`/`onReady` boshqaruvi orqali ishlaydi; fayl alohida Tekshirish yoki Keyingi tugmasini qo‘shmaydi.
- Har bir natija `questionText`, `correct` va `meta.taskId/kind/attempts` bilan uzatiladi. Ovoz, tashqi media yoki API ishlatilmaydi.

## Manbalar

- `scripts/module3-practice-content.mjs` — yordamchilar va M3L01–04 kontenti.
- `scripts/module3-practice-scenarios.mjs` — M3L05–08 kontenti.
- `scripts/module3-practice-theme.css` — modulga tegishli ranglar.
- `scripts/generate-module3-practice.mjs` — 80 ta mustaqil yuklanadigan JSX yaratadi.
- `scripts/check-module3-practice.ts` — kompilyatsiya, mexanika, nashrga tayyorlik va sandbox sinovi.

```powershell
node scripts/generate-module3-practice.mjs
node_modules\.bin\tsx.cmd scripts/check-module3-practice.ts
```

2026-11-05: 80/80 fayl kompilyatsiya, avtomatik mexanika aniqlash va 8 darsning nashrga tayyorlik tekshiruvidan o‘tdi. Brauzer sandboxida 10 xil mexanikaning bittadan namunasi va M3L08.p09 bajarildi. `correct` payloadi, mobil MATCH/FORM/SORT, noto‘g‘ri javobdan keyin tuzatish va etalon `pt-enter` animatsiyasi tekshirildi; barcha 80 topshiriq uchun alohida brauzer oqimi bajarilmadi.

## Yuklash holati

2026-11-05: **80 ta Practice productionga yuklandi va nashr qilindi**. M3L01–M3L08 darslarining barchasi `published`: har birida 1 Learn + 10 Practice. Production API holati, fayl xeshlari va mexanikalari lokal nusxalar bilan tekshirildi.

Keyingi yangilash uchun admin panelda tegishli `M3L0x` darsi → **Fayl yuklash** → **Practice** → shu papkadagi `p01–p10` ni tanlang. Mexanika avtomatik aniqlanadi. Generator/CSS manbalari yuklanmaydi. O‘quvchining ko‘rish huquqi mavjud kurs/modul ruxsatlariga bog‘liq.
