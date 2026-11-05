# Learn va Practice ekranlari dizayn etaloni

Bu ko'rinish `INTRO.learn.jsx`, Module 1 va `@coliseum/kit` asosidagi Practice fayllari uchun umumiy qoida. Module 2 Learn va Practice uchun quyidagi alohida palitra qo'llanadi; boshqa darslar umumiy palitradan foydalanadi. Mavjud darslarda dizayn o'zgarishlari dars mazmuni, tekshirish mexanikasi, ekran va asosiy karta o'lchami hamda animatsiya ketma-ketligini o'zgartirmaydi.

## Module 2 — alohida uslub

Foydalanuvchi talabiga ko'ra `M2L01`–`M2L08` nazariy darslari Module 1 dan farqlanadi:

- Fon `#081322`, karta `#1a3045` → `#101d30` → `#182640`.
- Asosiy aksent firuza `#79e0d2`, ikkinchi aksent och ko'k `#73b9ef`, sarlavha shampan `#e7d3ad`.
- Matn `#f0f6fa`, yordamchi matn `#bacbd8`; to'g'ri/xato javob yashil/qizil va yozma feedback bilan ajratiladi.
- Marshrutdagi yuk mashinasi o'rnida xabar oqimi va CSS 3D muloqot kartasi. Nazariyadagi ketma-ket yozilish, 2D sxema, flip kartalar, pauza va reduced-motion qo'llanadi.
- Har dars: Hook → 5 nazariya → etalon asosidagi ichki mashqlar → test → Summary; jami 20 slayd.
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
