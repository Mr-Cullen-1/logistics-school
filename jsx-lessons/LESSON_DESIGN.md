# Learn va Practice ekranlari dizayn etaloni

## Module 4 Learn

Module 4 uchun alohida operatsion panel uslubi: to‘q zumrad `#0b1714`, karta `#233b32` → `#13251f`, platina matn `#eef4ef`, amber `#eab873`. Manba: `scripts/module4-theme.css`. CSS 3D konsol, 2D bosqichlar va signal, ketma-ket matn, dalil kartalari, Y o‘qida flip va yumshoq slayd o‘tishi ishlatiladi. Pause/replay va reduced-motion saqlanadi. Yuqorida takroriy kicker yo‘q; past desktopda bo‘shliqlar ixchamlashadi, mobil mazmun kesilmaydi. Batafsil: [module-04/README.md](module-04/README.md). Bu uslub boshqa modullarni yoki umumiy Practice runtime'ni o‘zgartirmaydi.

Bu ko'rinish `INTRO.learn.jsx`, Module 1 va `@coliseum/kit` asosidagi Practice fayllari uchun umumiy qoida. Module 2 va Module 3 Learn/Practice uchun quyidagi alohida uslublar qo'llanadi. Mavjud darslarda dizayn o'zgarishlari dars mazmuni, tekshirish mexanikasi, ekran va asosiy karta o'lchami hamda animatsiya ketma-ketligini o'zgartirmaydi.

## Module 3 — ish hujjatlari va vaziyatlar

- Fon `#14121c`, karta `#302a3b` → `#1d1a27` → `#28232e`; mis aksent `#edbd91`, och binafsha `#c5addf`, matn `#f5f1f7`, yordamchi matn `#c3bccc`.
- Hook va Mission: qatlamli CSS 3D hujjat, 2D tekshirish chizig‘i va uchta ketma-ket holat. Pauza va reduced-motion majburiy.
- Slaydlar perspektivada kiradi; hujjatlar almashadi; nazariya yozilishi va sxemasi ketma-ket ochiladi. Tuzatish kartasi Y o‘qi bo‘ylab aylanadi.
- Hook → 6–7 ta nazariya → hujjat/suhbat va ichki mashqlar → test → Summary; jami 21–22 slayd. M3L02 va M3L08 da 7 nazariya mavjud.
- Learn sarlavhasi ustidagi takroriy tur/kod qatori ko‘rsatilmaydi. Past desktop ekranlarda ichki bo‘shliqlar ixchamlashadi; uzun hujjatlar ikki ustunda, nom va qiymati birga beriladi. Animatsiyalar va asosiy karta geometriyasi saqlanadi.
- Mobil ekran: ichki vertikal scroll, o‘qiladigan karta va inputlar, doim ko‘rinadigan navigatsiya. To‘g‘ri/xato holat rang bilan birga yozma izoh oladi.
- Barcha stil va animatsiyalar shu modul JSX fayllarida; umumiy runtime hamda oldingi modullar o‘zgartirilmaydi.

Module 3 Practice shu palitrani `.m3-practice` doirasidagi CSS orqali oladi; `PracticeTask` karta hajmi, mexanika va animatsiyalari saqlanadi. Manbalar: `scripts/module3-theme.css`, `scripts/module3-scenes.jsx.txt`, `scripts/module3-practice-theme.css`; [Learn](module-03/README.md) va [Practice](practice/MODULE3_PRACTICE.md) qo‘llanmalari.

## Module 2 — alohida uslub

Foydalanuvchi talabiga ko'ra `M2L01`–`M2L08` nazariy darslari Module 1 dan farqlanadi:

- Fon `#081322`, karta `#1a3045` → `#101d30` → `#182640`.
- Asosiy aksent firuza `#79e0d2`, ikkinchi aksent och ko'k `#73b9ef`, sarlavha shampan `#e7d3ad`.
- Matn `#f0f6fa`, yordamchi matn `#bacbd8`; to'g'ri/xato javob yashil/qizil va yozma feedback bilan ajratiladi.
- Marshrutdagi yuk mashinasi o'rnida xabar oqimi va CSS 3D muloqot kartasi. Nazariyadagi ketma-ket yozilish, 2D sxema, flip kartalar, pauza va reduced-motion qo'llanadi.
- Har dars: Hook → 5 nazariya → etalon asosidagi ichki mashqlar → test → Summary; jami 20 slayd.
- Learn sarlavhasi ustida tur/kodni takrorlamang: progress va mashq ichidagi belgi yetarli. Past desktop ekranlarda bo‘shliq va ichki joylashuv ixchamlashadi; animatsiya, asosiy karta va navigatsiya saqlanadi. Mobil ekranda mazmunni kesish yoki scrollni yashirish mumkin emas.
- Learn uslubi o‘z JSX fayliga joylanadi. Module 2 Practice shu palitrani faqat `.m2-practice` bilan chegaralangan CSS orqali oladi. Umumiy runtime va Module 1 ranglari o‘zgarmaydi; Practice karta hajmi, mexanika va animatsiyalar etalondan saqlanadi.

Manbalar: `scripts/module2-theme.css` va `scripts/module2-practice-theme.css`; qayta yaratish tartibi: [Learn](module-02/README.md) va [Practice](practice/MODULE2_PRACTICE.md).

## Palitra

| Vazifa | Rang |
|---|---|
| Ekran foni | `#0d1114`, chetlarda xira bronza radial nur |
| Asosiy karta | `#30343b` → `#1b1f23` → `#24282d` shaffof to'q gradient |
| Karta va input foni | `#ffffff0b` yoki `#1a1f23e8` |
| Tilla aksent | `#e0c28c`; chiziq `#d8b678`, ingichka ajratgich `#c19a6359` |
| Asosiy matn | `#f5f3ee`; ikkinchi darajali matn `#b8bbbd` |
| To'g'ri javob | chegara `#68ab7e`, matn `#9cddb5`, xira yashil fon |
| Xato javob | chegara `#d77a79`, matn `#ffaaa7`, xira qizil fon |
| Asosiy tugma | `#f0d39a` → `#c5985f` gradient, to'q matn |

## Komponentlar

- Yuqori navigatsiya va pastki boshqaruv qatori to'q oynasimon fonda bo'ladi. Chiqish va ikkilamchi tugmalar konturli; asosiy harakat tilla gradientli.
- Learn va Practice ning asosiy kartasi to'q oynasimon gradient va ingichka tilla chegara oladi. Mavjud `width`, `height`, `max-width`, `padding`, grid va mobil o'lchamlarni o'zgartirmang.
- Sarlavha tilla, topshiriq matni oq, yordamchi tushuntirish xira oq. Input, select va variantlar to'q fonda ochiq matn bilan ko'rinadi; `select` menyusi ham to'q rangda bo'ladi.
- Tanlangan variant tilla chegara va xira tilla fon oladi. Tekshirilgach to'g'ri javob yashil, xato javob qizil ko'rinadi; mavjud belgi va tushuntirishlar saqlanadi. Rangning o'zi yagona signal bo'lmasin.
- Nazariy qoida, 2D sxema, 3D sahna, dialog va natija kartalari shu palitradan foydalanadi. Rasmli panellarda matnni o'qish uchun to'q overlay qo'llanadi.
- Tashqi Practice ko'rinishini `runtime/practice-task.tsx` dagi `PracticeTask` belgilaydi. Har bir p01–p10 faylga stilni nusxalamang. Learn ichki CSS'ida shu palitrani ishlating.

## Saqlanadigan xatti-harakatlar

Mavjud slayd soni va tartibi, javoblarni tekshirish, `onReady`/`registerCheck`/`onSubmit`/`onFinished`, tugma holatlari, Rive sahnasi, CSS keyframe va transitionlar, 2D/3D harakatlar, `prefers-reduced-motion` qoidalari hamda mobil joylashuv o'zgarishsiz qoladi. Yangi dars yaratilganda ham shu chegaraga amal qiling.

Lokal `.jsx` fayl o'zgarishi bazadagi nashr qilingan nusxani avtomatik almashtirmaydi. Learn yangilanganda admin draft sifatida qayta yuklaydi, iframe Preview'da ko'radi va keyin nashr qiladi. Umumiy `PracticeTask` stili esa platforma runtime'i yangilanganda kit asosidagi Practice fayllariga tatbiq etiladi.
