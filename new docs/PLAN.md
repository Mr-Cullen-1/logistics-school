# Coliseum English Platform — To'liq reja

Maqsad: Coliseum Logistics School o'quvchilari uchun ingliz tili kursi platformasi.
Landing sayt (coliseumlogistics-seven.vercel.app) alohida qoladi, platforma **alohida loyiha va alohida domen**da quriladi.

---

## 1. Qat'iy qarorlar

| Mavzu | Qaror |
|---|---|
| Loyiha | Alohida repo/papka, saytdan mustaqil |
| Kirish | Telefon raqam + parol |
| Birinchi kirish | Admin bergan **PIN** bilan; keyin parolni almashtirish **majburiy** |
| Keyingi kirishlar | Telefon + o'zi qo'ygan parol |
| Ro'yxatdan o'tish | Yo'q. Akkauntni faqat admin yaratadi |
| Dars formati | Faqat `.jsx` |
| Dars yuklash | Faqat **super admin** |
| Dostup | O'quvchiga kurs bo'yicha admin beradi |
| Dizayn | Landing saytdan olinadi (ranglar, shrift, komponent uslubi) |
| Til | Interfeys o'zbek tilida (keyin kengaytirish mumkin) |

---

## 2. Rollar

| Rol | Nima qila oladi |
|---|---|
| `super_admin` | Hamma narsa: dars (JSX) yuklash/tahrirlash/o'chirish, kurs/modul, adminlar, o'quvchilar, dostup |
| `admin` | O'quvchi qo'shish, PIN berish/tiklash, bloklash, dostup berish, progressni ko'rish. **Dars yuklay olmaydi** |
| `student` | Faqat o'ziga ochilgan kurs va darslarni ko'radi, progress belgilaydi, parolni almashtiradi |

---

## 3. Asosiy oqimlar (grafik)

### 3.1. Kirish va parol almashtirish

```
Admin: o'quvchi yaratadi (ism + telefon)
        │
        ▼
Tizim: 6 xonali PIN generatsiya qiladi
       (bir marta ko'rsatiladi, bazada faqat hash)
       must_change_password = true
        │
        ▼
O'quvchi: /login → telefon + PIN
        │
        ▼
   must_change_password ?
     ├─ ha ──► /change-password (boshqa sahifaga o'tib bo'lmaydi)
     │           yangi parol (min 8 belgi, PINga teng emas)
     │              │
     │              ▼
     │        must_change_password = false
     │              │
     └─ yo'q ───────┴──► /learn

Keyingi safar: telefon + parol → /learn
Parol unutilsa: admin "PIN tiklash" bosadi → yangi PIN → oqim boshidan
```

### 3.2. Dostup va dars ko'rish

```
Super admin: Kurs → Modul → Dars (.jsx yuklaydi) → "Nashr"
Admin:       O'quvchi ↔ Kurs dostupini ochadi (muddat ixtiyoriy)
                         │
O'quvchi: /learn ────────┘ faqat ochilgan kurslar
   └► Kurs sahifasi (modullar, progress %)
        └► Dars sahifasi
             └► Sandbox iframe ichida JSX dars ishlaydi
                  └► "Tugatdim" → progress saqlanadi
```

**Intro istisnosi:** super admin `/admin/intro` da `INTRO.learn.jsx` ni yaratadi va nashr qiladi. Nashr qilingan Intro login qilgan barcha o'quvchilarga `/learn` da kurslardan oldin ko'rinadi; enrollment, kurs dostupi va kursning nashr holati talab qilinmaydi. Login, admin bergan PIN va majburiy parol almashtirish qoidalari o'zgarmaydi. Oddiy kurs va darslar yuqoridagi dostup qoidasida qoladi.

### 3.3. JSX yuklash pipeline (super admin)

Ikki tur fayl: **Learn** (`M1L01.learn.jsx`) va **Practice** (`M1L01.p01.jsx` ... `p10`). To'liq shartnoma: `JSX_CONTRACT.md`.

```
.jsx fayl(lar) tanlanadi (ommaviy drag & drop)
   │
   ▼ 1) Nom va tur: qolipga mos, dars kodi mavjud
   ▼ 2) Sintaksis: Sucrase (JSX → JS, imports → CommonJS); default export; importlar ⊆ {react, react-dom, @coliseum/kit}
   ▼ 3) Xavfsizlik siyosati: fetch, XHR, WebSocket, eval, new Function, import(), storage, cookie, window.parent/top taqiqlangan
   ▼ Bazaga: source + compiled_js + hash + version (draft)
   ▼
   4) Browser smoke: har draft sandbox iframe'da chiziladi; render xatosi bo'lsa tasdiq bo'lmaydi
   ▼
Preview tasdiqlangach va dars to'liq bo'lsa (1 Learn + kamida 10 Practice) → "Nashr"
```

JSX Next server jarayonida `vm` bilan bajarilmaydi. Preview tasdig'i super admin brauzeridagi smoke tekshiruvini bildiradi; darsning to'liq funksional sinovi alohida o'tkaziladi.

---

## 4. Texnologiyalar

| Qatlam | Tanlov | Sabab |
|---|---|---|
| Framework | Next.js (App Router) + TypeScript | Vercel'ga mos, server actions, middleware |
| Stil | Tailwind CSS + saytdan olingan design tokenlar | Saytga bir xil ko'rinish |
| DB | PostgreSQL (Neon yoki Supabase, faqat DB sifatida) | Bepul tarif yetadi |
| ORM | Drizzle ORM | Yengil, TypeScript'ga yaxshi |
| Parol/PIN hash | `argon2` (bo'lmasa `bcryptjs`) | Xavfsiz |
| Sessiya | `jose` bilan JWT, `httpOnly` + `Secure` + `SameSite=Lax` cookie | Oddiy, o'zimiz nazorat qilamiz |
| JSX kompilyator | `sucrase` | Sof JS, Vercel serverless'da muammosiz |
| Validatsiya | `zod` | Forma va API uchun |
| Rate limit | Postgres'da `login_attempts` jadvali (yoki Upstash) | Brute-force'dan himoya |
| Deploy | Vercel + alohida domen/subdomen | Saytga o'xshash |

---

## 5. Ma'lumotlar bazasi

```
users
  id, role (super_admin|admin|student), phone (unique, +998XXXXXXXXX),
  full_name, password_hash, must_change_password (bool),
  is_active (bool), last_login_at, created_at

courses
  id, title, description, level (A1…C1), cover_url?, is_published, order

modules
  id, course_id → courses, title, order

lessons
  id, module_id → modules, code (M1L01), title, order, status (draft|published)

lesson_files                                  -- Learn va Practice JSX fayllari
  id, lesson_id → lessons, kind (learn|practice), seq (learn=0, practice=1..N),
  mechanic?, source (text), compiled_js (text), size_bytes, sha256,
  version (int), status (draft|published), uploaded_by → users, uploaded_at
  UNIQUE(lesson_id, kind, seq)

enrollments               -- dostup
  id, student_id → users, course_id → courses,
  starts_at, expires_at?, granted_by → users, is_active

lesson_progress
  student_id, lesson_id, learn_done_at, learn_payload (jsonb), practice_done_at
  (PK: student_id + lesson_id)

practice_attempts
  student_id, lesson_id, seq, attempts, correct, first_try_correct, duration_ms, updated_at
  (PK: student_id + lesson_id + seq)

login_attempts
  id, phone, ip, success (bool), created_at

audit_log
  id, actor_id, action, target_type, target_id, meta (jsonb), created_at
  (PIN tiklash, dostup berish, dars yuklash, bloklash va h.k.)
```

**Eslatma:** PIN ham parol kabi faqat hash ko'rinishida saqlanadi. Admin PINni yaratilgan zahoti bir marta ko'radi, keyin qayta ko'ra olmaydi (faqat yangisini yaratadi).

---

## 6. Sahifalar va yo'nalishlar

### Umumiy
- `/login` — telefon + PIN/parol
- `/change-password` — majburiy almashtirish (PIN bilan kirganlar uchun)

### O'quvchi (`/learn`)
- `/learn` — mening kurslarim
- `/learn/[courseId]` — modullar va darslar, progress
- `/learn/[courseId]/[lessonId]` — dars (sandbox iframe), "Tugatdim", oldingi/keyingi
- `/learn/profile` — ism, parolni almashtirish

### Admin (`/admin`)
- `/admin` — qisqa statistika (o'quvchilar, faol dostuplar, bugungi kirishlar)
- `/admin/students` — ro'yxat, qidiruv, yaratish, bloklash, PIN tiklash
- `/admin/students/[id]` — dostuplar, progress, kirish tarixi
- `/admin/enrollments` — dostup berish/olish (ommaviy ham)
- `/admin/courses` — ko'rish (super admin tahrirlaydi)
- `/admin/intro` — Intro yaratish, ko'rish va fayllarini boshqarishga o'tish (tahrir faqat super admin)

### Faqat super admin
- `/admin/courses/new`, `/admin/courses/[id]` — kurs/modul boshqaruvi, tartib (drag & drop)
- `/admin/lessons/new` — `.jsx` yuklash, preview, nashr
- `/admin/lessons/[id]` — yangi versiya yuklash, draft/publish
- `/admin/staff` — adminlar qo'shish/o'chirish
- `/admin/audit` — audit log

Himoya: `middleware.ts` rol va `must_change_password` ni tekshiradi; server tomonda har bir action/route yana tekshiradi (faqat middlewarega ishonmaymiz).

---

## 7. JSX darslarni xavfsiz ishlatish (yangilangan)

Batafsil: `JSX_CONTRACT.md`. Qisqacha:

1. **Sandbox iframe**: `sandbox="allow-scripts"`, `allow-same-origin` **yo'q**. Dars kodi cookie, token va platforma DOM'iga kira olmaydi.
2. Iframe ichida bizning **runtime**: React, react-dom, `@coliseum/kit` va fayl funksiyalarini (`onReady`, `registerCheck`, `onSubmit`, `onFinished`) `postMessage` ko'prigi orqali platformaga ulaydi.
3. **Ikki tur fayl**:
   - **Learn**: `export default function Lesson({lang, studentName, onFinished})`; tugaganda `onFinished(payload)`.
   - **Practice** (bitta topshiriq): `export default function Practice({lang, mode, onReady, registerCheck, onSubmit, playCorrect, playWrong})`; **"Tekshirish" tugmasini platforma beradi**.
4. CSP: `connect-src 'none'`, `media-src 'none'`, `img-src` platforma va `data:`.
5. **Ovoz yo'q**: audio API lari (`Audio`, `speechSynthesis`, `AudioContext`) ingliz platformasida taqiqlangan.
6. Hajm chegarasi: Learn 1.5 MB, Practice 300 KB (namunalar 385 KB va 60 KB).
7. Faqat super admin yuklaydi, har yuklash `audit_log` ga yoziladi.

### `@coliseum/kit` (tavsiya, qaror kutilmoqda)
Mexanikalar (MC, GAP, TYPE, MATCH, ORDER, READ, REPLY, SORT, FIX, FORM, SCENE), stil tokenlari, xato izohi komponenti. Kit bo'lsa fayllar 10 baravar kichik bo'ladi; standalone (hammasi ichida) fayllar ham qabul qilinadi.

---

## 8. Dizayn (saytdan olinadi)

1-bosqichda saytdan (yoki uning repo'sidan) quyidagilarni chiqarib olamiz va `tailwind.config` + CSS variables'ga qo'yamiz:

- Ranglar (saytdan olingan): fon `#0d1114`, sirt `#171b1e` / `#1d2226`, bronza `#c19a63` (`#e0c28c`), ivory `#f3efe7`, matn `#f5f3ee`, ikkinchi matn `#a7aaad`, jimroq `#73777a`, chiziq `#ffffff14`
- Shrift: Geist (sans) va Geist Mono; tugma radiusi 12 px, kartalar chegara bilan, soyasiz (to'liq jadval: INTRO_ETALON.md A5)
- Shrift oilasi, o'lchamlar, og'irliklar
- Tugma, karta, input, spacing, border-radius, soya uslublari
- Logotip va favicon

Platforma sahifalari: qoramtir fon, bronza aksentli tugmalar, ortiqcha glow va neon yo'q, o'qish uchun qulay katta matn. Dars ichida o'qish qulayligi uchun matn kontrasti yuqori bo'ladi.

---

## 9. Xavfsizlik

- Telefon normalizatsiyasi: `+998XXXXXXXXX` formatiga keltiriladi, takroriy bo'lmaydi
- PIN: 6 xonali, kriptografik tasodifiy (`crypto.randomInt`)
- Parol: min 8 belgi, PINga yoki telefonga teng bo'lmasligi
- Login rate limit: 5 ta xato urinishdan keyin 15 daqiqa blok (telefon + IP bo'yicha)
- Xato xabari bir xil: "Telefon yoki parol noto'g'ri" (akkaunt borligini oshkor qilmaydi)
- Sessiya muddati 7 kun; parol/PIN o'zgarganda eski sessiyalar bekor qilinadi (`session_version`)
- Bloklangan o'quvchi darhol chiqib ketadi
- Har bir so'rovda rol va dostup serverda tekshiriladi (o'quvchi boshqa o'quvchi yoki ochilmagan kurs ma'lumotini ola olmaydi)
- Secrets faqat `.env` (git'ga qo'shilmaydi)
- Oddiy darslar API'si faqat kurs dostupi bor o'quvchiga `compiled_js` beradi; nashrdagi Intro faqat login qilgan o'quvchilarga dostupsiz beriladi

---

## 10. Papka tuzilmasi

```
coliseum-platform/
├─ CLAUDE.md
├─ PLAN.md
├─ .env.example
├─ drizzle/                 # migratsiyalar
├─ scripts/
│  ├─ seed-super-admin.ts
│  └─ build-runtime.ts      # lesson-runtime.js ni yig'adi
├─ src/
│  ├─ app/
│  │  ├─ (auth)/login, change-password
│  │  ├─ learn/...
│  │  ├─ admin/...
│  │  ├─ lesson-frame/[id]/ # iframe uchun sahifa
│  │  └─ api/...
│  ├─ db/ (schema.ts, index.ts)
│  ├─ lib/
│  │  ├─ auth/ (session, password, pin, rbac)
│  │  ├─ jsx/ (validate.ts, compile.ts)
│  │  └─ phone.ts
│  ├─ components/ (ui/, admin/, learn/)
│  └─ middleware.ts
├─ runtime/                 # iframe ichidagi React runtime + bloklar
│  ├─ blocks/
│  └─ entry.tsx
└─ public/
```

---

## 11. Bosqichlar (Claude Code bilan ishlash tartibi)

Har bosqich alohida sessiya/commit. Har birining oxirida tekshiruv bor.

### 0-bosqich. Loyiha asosi
- Next.js + TS + Tailwind, Drizzle, ESLint, `.env.example`, `CLAUDE.md`
- Neon/Supabase DB ulash, birinchi migratsiya
- **Tekshiruv:** `npm run dev` ishlaydi, DB'ga ulanadi

### 1-bosqich. Dizayn tizimi
- Saytdan tokenlarni chiqarish, Tailwind config, asosiy UI komponentlar (Button, Input, Card, Table, Modal, Toast)
- **Tekshiruv:** namuna sahifada hamma komponent saytga o'xshash ko'rinadi

### 2-bosqich. Autentifikatsiya
- Jadvallar: `users`, `login_attempts`
- `seed-super-admin` skripti
- Login, sessiya, middleware, majburiy parol almashtirish, rate limit
- **Tekshiruv:** PIN bilan kirish → almashtirishga majburlash → yangi parol bilan kirish; noto'g'ri parolda blok

### 3-bosqich. Admin: o'quvchilar
- Ro'yxat, qidiruv, yaratish (PIN bir marta ko'rsatiladi), bloklash, PIN tiklash, audit log
- **Tekshiruv:** admin o'quvchi yaratadi, PIN bilan o'quvchi kiradi

### 4-bosqich. Kurs, modul, dostup
- Super admin: kurs/modul CRUD, tartiblash
- Admin: dostup berish/olish, muddat
- **Tekshiruv:** dostupsiz o'quvchi kursni ko'rmaydi, URL orqali ham ocha olmaydi

### 5-bosqich. JSX pipeline (Learn + Practice)
- Ommaviy yuklash, 4 darajali tekshiruv (nom, sintaksis, xavfsizlik, smoke render), versiyalash, draft/publish
- Iframe runtime (`runtime/`): require shim, postMessage ko'prigi, avto balandlik
- Learn host (onFinished → progress), Practice host (progress p/10, "Tekshirish", "Keyingisi", natija)
- `@coliseum/kit` minimal versiyasi (kamida MC, GAP, ORDER)
- Nashr sharti: 1 Learn + kamida 10 Practice
- **Tekshiruv:** `Dars01.jsx` (Learn) va `D01_01.jsx` (Practice) namunalari o'tadi; `fetch` yoki noma'lum import bor fayl aniq xabar bilan rad etiladi; iframe ichidan cookie/parent'ga kirib bo'lmaydi

### 6-bosqich. O'quvchi tajribasi
- `/learn`, kurs sahifasi, dars sahifasi, progress, oldingi/keyingi, profil
- **Tekshiruv:** progress to'g'ri hisoblanadi, "Tugatdim" saqlanadi

### 7-bosqich. Bloklar kutubxonasi
- Vocabulary, Dialogue (matnli), Quiz, FillBlank, Match, Tip, CompleteButton (audio yo'q)
- Super admin uchun "blok namunalari" sahifasi (dars yozishga qo'llanma)
- **Tekshiruv:** barcha bloklar mobil va desktop'da ishlaydi

### 8-bosqich. Sayqal va QA
- Mobil moslashuv, bo'sh holatlar, xato sahifalari, yuklanish holatlari
- Xavfsizlik tekshiruvi (rol/dostup testlari, XSS, rate limit)
- Asosiy oqimlar uchun avtomatik testlar (login, dostup, yuklash)

### 9-bosqich. Deploy
- Vercel loyihasi, env o'zgaruvchilari, production DB, migratsiya
- Domen (masalan `learn.` subdomen), saytdagi "Student login" havolasi
- Super admin akkauntini yaratish, birinchi haqiqiy o'quvchi bilan sinov

---

## 12. Keyin (ixtiyoriy, hozir kerak emas)

- O'quvchi progressi bo'yicha sertifikat
- Dars izohlari/savollar
- Test natijalarini saqlash (ball)
- Telegram bot orqali eslatma
- Bir nechta guruh va o'qituvchi hisobotlari

---

## 13. `CLAUDE.md` (loyiha papkasiga qo'yiladi)

```md
# Coliseum English Platform

Alohida ta'lim platformasi (landing saytdan mustaqil). Reja: PLAN.md

## Qoidalar
- Stack: Next.js App Router, TypeScript, Tailwind, Drizzle, PostgreSQL, jose, argon2, sucrase, zod
- Interfeys tili: o'zbek
- Ro'yxatdan o'tish yo'q. Akkauntni faqat admin yaratadi
- Kirish: telefon (+998XXXXXXXXX) + parol. Birinchi marta admin bergan PIN bilan, keyin parolni almashtirish MAJBURIY
- PIN va parol faqat hash ko'rinishida saqlanadi, hech qachon logga yozilmaydi
- Rollar: super_admin, admin, student. Dars yuklash faqat super_admin
- Darslar faqat .jsx, ikki tur: Learn (`M1L01.learn.jsx`) va Practice (`M1L01.p01.jsx`..`p10`, har biri 1 topshiriq). Shartnoma: JSX_CONTRACT.md. Kurs: COURSE.md
- JSX FAQAT sandbox iframe (allow-scripts, allow-same-origin YO'Q) ichida ishlaydi
- Rol va dostup tekshiruvi har doim serverda, middlewarega yolg'iz ishonma
- Dizayn: landing saytdagi tokenlar (qoramtir #0D1114 fon, bronza aksent, ivory matn), ortiqcha glow yo'q
- Har bosqichdan keyin: lint, typecheck, test; keyin commit
- Secrets .env da, git'ga qo'shilmaydi

## Buyruqlar
- npm run dev / build / lint / typecheck / test
- npm run db:generate / db:migrate
- npm run seed:super-admin
- npm run build:runtime
```

---

## 14. Boshlash uchun amaliy qadamlar

1. Papka oching, `PLAN.md` va `CLAUDE.md` ni ichiga qo'ying.
2. VS Code'da shu papkada Claude Code'ni ishga tushiring.
3. Birinchi so'rov: *"PLAN.md ni o'qi va 0-bosqichni bajar."*
4. Saytning kodi (repo) bo'lsa, 1-bosqich oldidan uni shu papka yoniga qo'ying yoki yo'lini ayting, shunda tokenlar aniq olinadi.
5. Neon/Supabase'da bepul DB oching va `DATABASE_URL` ni `.env` ga yozing.
6. Har bosqichdan keyin tekshiruv bandini birga sinab, keyingisiga o'ting.
