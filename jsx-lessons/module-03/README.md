# Module 3 — Workplace Communication

8 ta mustaqil, yuklashga tayyor **Learn JSX**. Kontent manbasi: `new docs/COURSE.md` dagi Module 3. Inglizcha misollar, o‘zbekcha tushuntirishlar; interfeysning `ru/en` tarjimasi kiritilmagan.

| Fayl | Mavzu | Nazariya | Jami slayd |
|---|---|---:|---:|
| [M3L01.learn.jsx](M3L01.learn.jsx) | Understanding Load Information | 6 | 21 |
| [M3L02.learn.jsx](M3L02.learn.jsx) | Reading Rate Confirmations | 7 | 22 |
| [M3L03.learn.jsx](M3L03.learn.jsx) | Pickup and Delivery Details | 6 | 21 |
| [M3L04.learn.jsx](M3L04.learn.jsx) | Asking for Updates | 6 | 21 |
| [M3L05.learn.jsx](M3L05.learn.jsx) | Explaining Delays and Problems | 6 | 21 |
| [M3L06.learn.jsx](M3L06.learn.jsx) | Writing Professional Updates | 6 | 21 |
| [M3L07.learn.jsx](M3L07.learn.jsx) | Clarifying Instructions | 6 | 21 |
| [M3L08.learn.jsx](M3L08.learn.jsx) | Handling Workplace Scenarios | 7 | 22 |

## O‘quv oqimi va qiyinlik

**Hook → 6–7 nazariya → Mission → hujjat/suhbat → Notice → Pattern → Vocabulary → Guided check → Build → yangi manba → Read check → Fix it → Apply → Role-play → test → Summary.**

- Nazariya ichki mashqlardan oldin keladi: har qoidada tushuntirish, 3 bosqichli sxema, 2 izoh, misol/tarjima va xato-to‘g‘ri karta bor.
- Module 2 dagi oddiy ma’lumot so‘rashdan keyingi qadam: ikkita shartni solishtirish, hujjatdan dalil topish, fakt/taxmin/tasdiqni ajratish, loaded/total RPM va yangi ETA ni hisoblash.
- M3L01 uchta load e’lonini, M3L02 shartli rate confirmationni, M3L06 uchta yozma updateni, M3L08 uchta ish holatini ko‘rib chiqadi. Hujjatlar o‘qilgani belgilanganidan keyin davom etiladi.
- Har darsda 8 ta lug‘at kartasi, 3 ta gap tuzish, 3 ta yo‘naltirilgan savol, 2 ta xato tuzatish, yozma Apply, 3 bosqichli qaror va 6 iborali phrase bank bor.
- Oddiy yakuniy test 4 savol: kamida 3 to‘g‘ri. M3L08 Checkpoint 3 — 8 savol: kamida 6 to‘g‘ri. O‘tolmasa qayta urinish kerak; yakuniy ball shu testdan olinadi.
- Yuklar, narxlar, hujjatlar va to‘lov shartlari o‘quv misollari. Qo‘shimcha to‘lovlar avtomatik kafolatlanmaydi; shart va tasdiq aynan berilgan hujjatdan o‘qiladi.

## Module 3 uslubi

- Grafit/binafsha fon, mis aksent, och binafsha yordamchi aksent. Module 1/2 uslublari o‘zgarmaydi.
- Hook va Mission: qatlamli CSS 3D hujjat kartasi, 2D tekshirish chizig‘i, ketma-ket jarayon belgilari va pauza tugmasi.
- Nazariya: matn yozilishi → sxema → izoh → misol → Y o‘qi bo‘ylab 3D tuzatish kartasi. **Qayta** va **Hammasi** saqlangan.
- Slayd va hujjat almashishi alohida animatsiyali; variantlar va gap bo‘laklari bir marta aralashtiriladi.
- `prefers-reduced-motion` animatsiyani o‘chirib, mazmunni darhol ko‘rsatadi. Mobil ekranda ichki vertikal scroll va ko‘rinadigan navigatsiya mavjud.
- Tashqi media, CDN, audio, Rive yoki API talab qilinmaydi. Barcha CSS, SVG va kontent JSX ichida; faqat React import qilinadi.
- `onProgress` va bir martalik `onFinished` platforma shartnomasiga mos. `answers` slaydlar bo‘yicha mashq natijalarini uzatadi.

## Manbalar va tekshiruv

- `scripts/module3-content.mjs` — M3L01–04 kontenti.
- `scripts/module3-content-scenarios.mjs` — M3L05–08 kontenti.
- `scripts/module3-scenes.jsx.txt` — 2D/3D sahna, hujjat o‘qish va yozma mashq.
- `scripts/module3-theme.css` — modul uslubi.
- `scripts/generate-module3-learn.mjs` — Module 1 shablonidan mustaqil JSX yaratadi; oldingi modul fayllarini o‘zgartirmaydi.

```powershell
node scripts/generate-module3-learn.mjs
node_modules\.bin\tsx.cmd scripts/check-module3-lessons.ts
```

Tekshiruv lokal sandbox iframe’da ishlaydi; DB yoki Next dev server talab qilmaydi. Tanlangan darslar uchun `M3_LESSON=M3L01,M3L02,M3L06,M3L08` filtridan foydalanish mumkin.

2026-11-05 tekshiruv: 8/8 JSX platforma validatori bilan kompilyatsiya qilindi. M3L01, M3L02, M3L06 va M3L08 to‘liq sandbox oqimidan o‘tdi; yakuniy ball/callback, hujjatlarni o‘qish, 2D/3D harakat va pauza, mobil yozma mashq hamda checkpointning muvaffaqiyatsiz urinishdan keyingi qayta ishlashi tekshirildi. Qolgan to‘rtta dars uchun alohida brauzer oqimi bajarilmadi.

## Yuklash

Tegishli `M3L0x` darsi → **Fayl yuklash** → **Learn** → shu koddagi `.learn.jsx`. Generator manbalari yuklanmaydi. Dars ichidagi mashqlar Learn tarkibida. Alohida [80 ta Practice JSX](../practice/MODULE3_PRACTICE.md) ham har darsga 10 tadan lokalda tayyor. Lokal fayllar yaratilishi platformadagi nashrni avtomatik o‘zgartirmaydi.

2026-11-05: M3L01–M3L08 productiondagi **Workplace Communication** modulida yaratildi. Har bir Learn v1 sifatida yuklandi, Preview OK va joriy fayl nashri saqlandi; production API holati va baza xeshlari lokal JSX bilan tekshirildi. Keyin har darsga 10 tadan Practice yuklanib nashr qilindi. Barcha 8 dars `published`: 1 Learn + 10 Practice. Practice xeshlari, mexanikalari va production nashr holati tekshirildi.
