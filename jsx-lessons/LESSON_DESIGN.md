# Learn va Practice ekranlari dizayn etaloni

Bu ko'rinish `INTRO.learn.jsx`, `M1L01.learn.jsx` va barcha `@coliseum/kit` asosidagi Practice fayllari uchun umumiy qoida. Keyingi darslar ham shu palitradan foydalanadi. Dizayn o'zgarishlari dars mazmuni, tekshirish mexanikasi, ekran va asosiy karta o'lchami hamda animatsiya ketma-ketligini o'zgartirmaydi.

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
