# Module 2 — Practice

**80 ta yuklashga tayyor JSX:** M2L01–M2L08 uchun har birida p01–p10. Inglizcha material, o‘zbekcha yo‘riqnoma; ovoz va tashqi media yo‘q. Kontent `new docs/COURSE.md` Module 2 rejasi va shu darslarning Learn fayllariga mos.

| Papka / mavzu | p01 → p10 mexanikalari |
|---|---|
| [M2L01](M2L01) — Introducing Yourself Professionally | MC, MATCH, READ-MC, GAP, ORDER, TYPE, FIX, REPLY, READ-TYPE, SCENE |
| [M2L02](M2L02) — Asking for Information | MC, MATCH, READ-MC, GAP, ORDER, TYPE, FIX, REPLY, READ-TYPE, SCENE |
| [M2L03](M2L03) — Numbers, Dates and Times | MC, MATCH, READ-MC, GAP, TYPE, ORDER, FIX, SORT, READ-TYPE, SCENE |
| [M2L04](M2L04) — Spelling and Confirming Details | MATCH, MC, READ-MC, READ-TYPE, GAP, TYPE, FIX, ORDER, REPLY, SCENE |
| [M2L05](M2L05) — Making and Answering Phone Calls | MC, MATCH, READ-MC, GAP, ORDER, FIX, REPLY, SORT, READ-TYPE, SCENE |
| [M2L06](M2L06) — Filling Out Forms | MATCH, MC, READ-MC, FORM, GAP, TYPE, FIX, SORT, READ-TYPE, SCENE |
| [M2L07](M2L07) — Writing Simple Work Emails | MC, ORDER, MATCH, GAP, TYPE, FIX, READ-TYPE, REPLY, READ-MC, SCENE |
| [M2L08](M2L08) — Confirming Information in Writing | MC, MATCH, READ-MC, READ-TYPE, GAP, ORDER, FIX, TYPE, FORM, SCENE |

## Ishlash qoidalari

- Har faylda bitta topshiriq. Har darsda kamida 5 xil mexanika, 2 ta READ-MC/READ-TYPE, FIX va p10 da 3 bosqichli SCENE bor.
- `@coliseum/kit` dagi etalon `PracticeTask` tekshirish, tayyorlik, xato/to‘g‘ri feedback, mobil bo‘lish va animatsiyalarni beradi. Tekshirish tugmasi platformadan keladi.
- Variantlar va ORDER bo‘laklari fayl ochilganda bir marta aralashtiriladi. To‘g‘ri javob joylashuv indeksiga qayta bog‘lanadi; input yozish yoki javob tanlash tartibni o‘zgartirmaydi.
- Faqat `.m2-practice` ichidagi ranglar almashtirilgan: to‘q ko‘k fon, firuza aksent, shampan sarlavha. Asosiy karta o‘lchami, kirishdagi 3D perspektiva, 2D feedback va reduced-motion qoidalari etalondan saqlanadi. Module 1 va umumiy runtime o‘zgarmagan.
- FORM metadata orqali alohida aniqlanadi. Fayldagi adapter mavjud TYPE ko‘p maydonli rendererini ishlatadi, `onSubmit.meta.kind` ni FORM sifatida qaytaradi. Ikkala FORM ham 6 maydonli; yangi runtime deploy talab qilmaydi.
- TYPE savollari erkin insho emas: rol kartasi yoki aniq jumla qolipi berilgan. Ism/kompaniya uchun foydalanuvchining shaxsiy ma’lumoti tekshirilmaydi. Raqam, telefon, vaqt va ayrim jumlalarning muqobil to‘g‘ri shakllari qabul qilinadi; bu AI baholash emas.
- NATO mashqlari nazariyadagi K/T/D/B/M/I harflariga asoslanadi. KIM rol ismi uchun kod so‘zlari manbada ham berilgan.
- M2L07 butunlay yozma email mashqlari. M2L08 Practice alohida checkpoint qo‘shmaydi; nazariyadagi checkpoint o‘z joyida.

## Tahrirlash

- `scripts/module2-practice-content.mjs` — 80 topshiriq, javoblar va izohlar.
- `scripts/module2-practice-theme.css` — faqat Module 2 Practice palitrasi.
- `scripts/generate-module2-practice.mjs` — mustaqil yuklanadigan JSX fayllari.

```powershell
node scripts/generate-module2-practice.mjs
node_modules\.bin\tsx.cmd scripts/check-module2-practice.ts
```

Tekshiruv barcha 80 faylni haqiqiy upload kompilyatori va mexanika detektori bilan tekshiradi; 8 darsning fayl to‘liqligini baholaydi. Brauzer sinovi har mexanikadan namuna, ikkala FORM, noto‘g‘ri javobdan qaytish, SCENE va mobil MATCH/SORT/FORM ni qamrab oladi. DB yoki Next dev server kerak emas.

## Yuklash

Admin panel → kerakli M2L0x darsi → **Fayl yuklash** → **Practice** → shu papkadagi 10 ta `.jsx` → **Saqlash va nashr qilish**. Mexanika fayldan avtomatik aniqlanadi. Generator, CSS, README yoki boshqa dars fayllarini tanlamang.

2026-11-05: **80 ta Practice production platformaga yuklandi va nashr qilindi.** M2L01–M2L08 ning har birida 10 ta Practice joriy nashr sifatida saqlandi; avvalgi Learn bilan barcha 8 dars `published` holatiga o‘tdi. Fayllarning SHA-256 qiymatlari lokal nusxalar bilan mos; production admin API orqali kod, modul, slot va nashr holati tekshirildi. Preview tasdig‘i mavjud `bulk_approval_without_opening` usulida qayd qilindi. Keyingi lokal/Git o‘zgarishlari bazadagi versiyani o‘zi almashtirmaydi.
