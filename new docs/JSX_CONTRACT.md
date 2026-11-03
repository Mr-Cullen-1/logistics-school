# JSX shartnomasi: Learn va Practice fayllar + platforma talablari

Bu hujjat yuklangan ikki namunaga (`Dars01.jsx` va `D01_01.jsx`) asoslangan. Ular boshqa loyihadan (4-sinf matematika LMS), lekin **ishlaydigan va sinalgan shartnoma** shu. Biz uni ingliz kursi uchun moslaymiz.

---

## 1. Namunalardan nimani aniqladim

| | `Dars01.jsx` (Learn) | `D01_01.jsx` (Practice) |
|---|---|---|
| Hajm | ~385 KB, ~10 400 qator | ~60 KB, ~1 120 qator |
| Tur | Nazariy dars: ~15 ekranli animatsion oqim | **Bitta** topshiriq (1-dars, 1-topshiriq) |
| Eksport | `export { Grade4Dars01 as default }` | `export default function D01_01` |
| Importlar | faqat `react`, `react-dom` (`createPortal`) | faqat `react` |
| Stil | ichkarida (`<style>{STYLES}</style>`) | ichkarida |
| Mexanikalar | Ichida (rapid test, rule builder va h.k.) | mc, gap, numpad, match |
| Kirish propslari | `studentName, lang, ttsApiBase, voiceGender, correctSoundUrl, wrongSoundUrl, onFinished` | `lang, mode, onReady, registerCheck, onSubmit, playCorrect, playWrong` |
| Natija | `onFinished(payload)`: `lessonId, durationSec, totalQuestions, correctAnswers, scorePercent, passed, firstTryStats, skillTags, answers` | `onSubmit({questionText, correct, meta:{taskId, kind, attempts}})` |
| Tekshirish tugmasi | O'zida | **Platforma beradi** (`registerCheck` + `onReady`) |
| Brauzer API | `Audio`, `speechSynthesis`, `document.documentElement` | yo'q |

Muhim xulosa: **bir dars = 1 Learn fayl + N ta Practice fayl (har biri 1 topshiriq)**. Bizning rejamizdagi "10 ta practice" shunga mos: 10 ta alohida fayl.

Sandbox uchun e'tibor: matematikadan olingan Learn namunasi `document.documentElement`, `new Audio` va `speechSynthesis` dan foydalanadi. Ingliz kursi ovozsiz: audio bilan bog'liq kod ko'chirilmaydi, validator bunday API'larni rad etadi va iframe CSP `media-src 'none'` qo'yadi.

---

## 2. Qaror kerak: "Standalone" yoki "Kit"

Namunalardagi qoida: **lokal import yo'q, hamma narsa faylning ichida** (README: "lms-grade6-standalone"). Natija: har fayl o'z mexanikalari va stilini takrorlaydi. Shuning uchun Learn 385 KB, Practice 60 KB. Biz 353 ta fayl yozamiz, shuning uchun bu muhim.

| | A. Standalone (hozirgidek) | B. Kit (tavsiya) |
|---|---|---|
| Fayl | Hammasi ichida, `react` va `react-dom` dan boshqa import yo'q | `@coliseum/kit` dan import qilinadi (mexanikalar, stil, UI) |
| Hajm | Learn 300–400 KB, Practice ~60 KB | Learn ~20–40 KB, Practice ~3–8 KB |
| Platforma | Soddaroq | Kitni iframe runtime ichiga o'zi joylaydi |
| Xato tuzatish | Bitta xato 353 faylda takrorlanadi (namunada "MATCH-FIX har darsda takrorlanadi ATAYLAB" deyilgan) | Kitni bir marta tuzatamiz, hamma fayl yangilanadi |
| Dizayn o'zgarishi | Har faylni qayta yig'ish | Kit yangilanadi |
| Yuklash tezligi | Sekin (350 KB × 11 fayl) | Tez |

**Tavsiya: B (Kit) asosiy, A ham qabul qilinadi.** Platforma ikkalasini ham kompilyatsiya qiladi: importlar ro'yxati (`react`, `react-dom`, `@coliseum/kit`) ruxsat etilgan. Mavjud generator skriptlaringiz (`build-grade4-*.mjs`) standalone chiqaradi, ularni o'zgartirmasdan ham yuklash mumkin bo'ladi.

---

> **Ingliz kursida ovoz yo'q.** Quyidagi shartnomada audio va tovush bilan bog'liq propslar (`audioBase`, `ttsApiBase`, `voiceGender`, `correctSoundUrl`, `wrongSoundUrl`) olib tashlangan.

## 3. Fayl nomlari va turlari

Tur nom orqali aniqlanadi, admin yuklaganda ham tanlanadi (ikkalasi mos kelishi shart).

| Tur | Nom | Misol |
|---|---|---|
| Intro | `INTRO.learn.jsx` | |
| Learn | `{LessonCode}.learn.jsx` | `M1L01.learn.jsx` |
| Practice | `{LessonCode}.p{NN}.jsx` | `M1L01.p01.jsx` ... `M1L01.p10.jsx` |

Practice soni **kamida 10** (rejada aynan 10). Admin ommaviy yuklashda (drag & drop) nomdan dars, tur va tartib avtomatik o'qiladi.

Fayl ichida ixtiyoriy metadata (bo'lsa, tekshiriladi, nom bilan mos kelishi shart):

```js
export const meta = {
  type: "learn",            // "learn" | "practice"
  lessonCode: "M1L01",
  seq: 0,                   // learn=0, practice=1..10
  mechanic: "ORDER",        // faqat practice: MC | GAP | TYPE | MATCH | ORDER | READ-MC | ...
  skillTags: ["sentence_order", "wh_questions"],
};
```

Namunalardagi fayllarda `meta` yo'q, shuning uchun u **majburiy emas**, lekin yangi fayllarda tavsiya etiladi (statistika va mexanikalar sonini tekshirish uchun).

---

## 4. LEARN fayl shartnomasi

### 4.1. Komponent

```jsx
export default function Lesson({
  lang,              // 'uz' | 'ru' | 'en'. Berilmasa preview rejimi (tilni almashtirgich ko'rinadi)
  studentName,       // salomlashish uchun
  onFinished,        // (payload) => void
}) { ... }
```

### 4.2. `onFinished(payload)`

```js
{
  lessonId: "M1L01-learn",
  lessonTitle: "Sentence Building and Questions",
  durationSec: 412,
  totalQuestions: 4,          // Rapid test savollari
  correctAnswers: 3,
  scorePercent: 75,
  passed: true,               // >= 60% (checkpoint darslarida 70%)
  firstTryStats: { total: 4, firstTryCorrect: 2 },
  skillTags: ["wh_questions", "word_order"],
  answers: [ /* har ekran bo'yicha ixtiyoriy tafsilot */ ]
}
```

Platforma shuni `lesson_progress.learn_payload` ga saqlaydi. **Faqat `onFinished` chaqirilgandan keyin** Learn tugagan hisoblanadi (ekranlarni ko'rib chiqish yetarli emas).

### 4.3. Ichida nima bo'lishi kerak (ingliz kursi)

Standart oqim `COURSE.md` 2-bo'limda (11 ekran): Mission, Read, Notice, Pattern, Vocabulary, Guided check, Build, Say it aloud, Role-play, Rapid test, Summary.

Namunadan olinadigan yaxshi yechimlar:
- Har noto'g'ri variantning **o'z izohi** bor (javobni aytmaydi, nimani tekshirishni ko'rsatadi).
- `prefers-reduced-motion` e'tiborga olinadi.
- Mobil: kichik ekranda (`max-height: 820px` va `760px`) skrollsiz sig'adigan kompakt tartib, tugmalar kamida 44 px.
- Bir fayl uch tilni (`ru`, `uz`, `en`) saqlaydi: `CONTENT.s0.title = {ru, uz, en}`.

Bizda o'zgaradi:
- **Ingliz kontenti til almashmaydi**; faqat tushuntirishlar `lang` bo'yicha. Struktura: `{ en: "...", uz: "...", ru: "..." }` (kerakli tillar bilan cheklanadi).
- **Ovoz yo'q**: audio, TTS, ovozli sharh va tovush effektlari ishlatilmaydi. Namunadagi `Audio`/`speechSynthesis` kodi bizning fayllarga ko'chirilmaydi.
- Mikrofon yo'q (A varianti). "Say it aloud": matnni ovoz chiqarib o'qish, o'zini baholash, ballsiz.

---

## 5. PRACTICE fayl shartnomasi

### 5.1. Komponent (bitta topshiriq)

```jsx
export default function Practice({
  lang = 'uz',
  mode,            // undefined (yechish) | 'review' (natijani ko'rib chiqish: tekshirish tugmasi o'chiq)
  onReady,         // (boolean) => void: "Tekshirish" tugmasi faol bo'lishi mumkinmi?
  registerCheck,   // (fn) => void: platforma tugmasi bosilganda chaqiriladigan funksiyani ro'yxatdan o'tkazish
  onSubmit,        // ({questionText, correct, meta}) => void: har tekshiruv natijasi
  playCorrect, playWrong,   // ingliz kursida chaqirilmaydi/bo'sh funksiya (ovoz yo'q); moslik uchun qoladi
}) { ... }
```

### 5.2. Platforma bilan muloqot tartibi

```
Practice fayl yuklanadi
   │
   ├─ foydalanuvchi javobni tanlaydi/yozadi
   │        └─► onReady(true)        → platforma "Tekshirish" ni faollashtiradi
   │
   ├─ platforma tugmasi bosiladi
   │        └─► registerCheck(fn) da berilgan fn() ishlaydi
   │
   ├─ Practice ichida tekshiruv
   │        ├─ (ovozli signal yo'q: faqat vizual holat)
   │        └─► onSubmit({ questionText, correct, meta })
   │
   └─ to'g'ri bo'lsa → platforma "Keyingisi"; noto'g'ri bo'lsa → izoh ko'rinadi, qayta urinish
```

Qoidalar:
- **"Tekshirish" tugmasini fayl chizmaydi**, platforma beradi.
- `onSubmit` har urinishda **bir marta** chaqiriladi (namunada `reportedRef` bilan himoyalangan).
- `SCENE` ning ichki to'g'ri qadamlari sahnaning o'zida davom etadi; xato urinish va oxirgi to'g'ri qadam natijasi `onSubmit` ga yuboriladi.
- Xato javobdan keyin variantlar qayta aralashadi (taxmin qilib ketishning oldini oladi).
- `mode === 'review'` bo'lsa `onReady(false)` va javob qulflanadi.
- `meta.taskId` shakli: `M1L01-p04`; `meta.kind`: mexanika kodi; `meta.attempts`: urinish soni.

### 5.3. Ichida nima bo'lishi kerak

Bitta topshiriq uchun: sarlavha (`M1L01 · Task 4`), shart, mexanika, xato variantlar uchun izohlar, to'g'ri javobdan keyingi qisqa tushuntirish. Mexanikalar ro'yxati va talablar `COURSE.md` 3-bo'limda.

---

## 6. Platforma bu fayllarni qanday qabul qilishi kerak

### 6.1. Yuklash va kompilyatsiya (4 daraja)

```
.jsx yuklandi (Learn: bitta fayl; Practice: bir darsga tegishli 1–10 ta fayl birdan)
   │
   ▼  1-daraja: Nom va tur
   │   nom qolipiga mos; tur formada tanlangan tur bilan mos; dars kodi mavjud
   ▼  2-daraja: Sintaksis va tuzilma
   │   Sucrase bilan JSX → JS (imports → CommonJS)
   │   default export bor; import ro'yxati ruxsat etilgan
   ▼  3-daraja: Xavfsizlik siyosati (statik)
   │   taqiqlar: fetch, XMLHttpRequest, WebSocket, eval, new Function, import(),
   │   localStorage/sessionStorage, document.cookie, window.parent/top/open,
   │   <script> yaratish, tashqi domen URL lari; **audio/ovoz API lari** (`Audio`, `speechSynthesis`, `AudioContext`, `<audio>`, `<video>`) ingliz platformasida taqiqlanadi
   ▼
Bazaga: source + compiled_js + size + hash + version, status = draft
   ▼  4-daraja: Browser smoke
   │   super admin real sandbox iframe'da har faylni ochadi
   │   render muvaffaqiyatli bo'lsa preview tasdiqlanadi; xato/timeout bo'lsa nashr bloklanadi
   ▼
Super admin: preview + dars oqimini ko'rib chiqish → "Nashr"
```

JSX server jarayonida bajarilmaydi. Browser smoke boshlang'ich renderni tekshiradi; barcha tugma va javoblarning to'g'riligini real dars QA tekshiruvi tasdiqlaydi.

Har darajada xato aniq aytiladi: fayl nomi, qator, sababi ("5-qator: `fetch` taqiqlangan").

### 6.2. Cheklovlar

| Parametr | Learn | Practice |
|---|---|---|
| Maksimal hajm | 1.5 MB (namuna 385 KB) | 300 KB (namuna 60 KB) |
| Ruxsat etilgan importlar | `react`, `react-dom`, `@coliseum/kit` | `react`, `@coliseum/kit` |
| Default export | majburiy | majburiy |
| Practice soni | | kamida 10 (nashr sharti) |

Namunadagi `Dars01.jsx` 385 KB, shuning uchun eski 200 KB chegarasi **ishlamaydi**; yuqoridagi qiymatlar yangilangan.

### 6.3. Iframe runtime (Learn va Practice uchun)

Funksiyalarni (`onReady`, `registerCheck`, `onSubmit`) `iframe` chegarasidan to'g'ridan-to'g'ri o'tkazib bo'lmaydi. Shuning uchun iframe ichida **bizning runtime** bor:

```
[Platforma sahifasi]                       [iframe: sandbox="allow-scripts"]
  Practice host UI                            runtime.js
  (progress 3/10, "Tekshirish")  ◄─postMessage─►  React + react-dom + @coliseum/kit
                                              compiled_js ni `require` shim bilan ishga tushiradi
  yuboradi: {type:'init', props}              default export ni mount qiladi
  yuboradi: {type:'check'}                    registerCheck(fn) → saqlaydi, 'check' da fn() chaqiradi
  qabul qiladi: {type:'ready', value}         onReady → postMessage
  qabul qiladi: {type:'submit', payload}      onSubmit → postMessage
  qabul qiladi: {type:'finished', payload}    onFinished → postMessage (Learn)
  qabul qiladi: {type:'height', value}        avto balandlik
```

- `require('react')`, `require('react-dom')`, `require('@coliseum/kit')` runtime ichidagi nusxalarni qaytaradi; boshqa modul so'ralsa xato.
- `allow-same-origin` **yo'q**: dars kodi platforma cookie va tokeniga yetmaydi.
- CSP: `default-src 'none'`; `script-src` platforma domeni va `blob:`; `media-src 'none'`; `font-src` faqat platforma domeni (Geist shrifti); `connect-src 'none'`; `img-src` platforma va `data:`.
- Audio fayllari yo'q: kursda ovoz ishlatilmaydi.

### 6.4. Practice o'tkazish interfeysi (platforma)

```
Dars sahifasi
 ├─ 1) Learn (iframe)  → onFinished → belgilanadi
 └─ 2) Practice ketma-ketligi (p01 → p10)
        ├─ yuqorida progress: 3 / 10
        ├─ markazda: iframe (1 topshiriq)
        ├─ pastda: [Tekshirish]  (onReady(true) bo'lganda faol)
        ├─ to'g'ri bo'lsa: [Keyingisi]
        └─ oxirida natija: nechta birinchi urinishda to'g'ri, vaqt, kuchsiz mavzular
```

- Tartib qat'iy: p01 → p10. Keyingisi oldingisi **to'g'ri yechilgandan** keyin ochiladi (qayta urinish cheksiz).
- Dars "tugagan" = Learn `passed` yoki tugagan + 10 practice yechilgan.
- Natijalar ko'rib chiqish uchun saqlanadi (`mode: 'review'`).

### 6.5. Ma'lumotlar bazasi (PLAN.md dagi `lessons` o'rniga)

```
lessons(id, module_id, code, title, order, status)

lesson_files                                   -- har JSX fayl
  id, lesson_id, kind (learn|practice), seq (learn=0, practice=1..N),
  mechanic?, source, compiled_js, size_bytes, sha256,
  version, status (draft|published), uploaded_by, uploaded_at
  UNIQUE(lesson_id, kind, seq)

lesson_progress
  student_id, lesson_id, learn_done_at, learn_payload (jsonb), practice_done_at

practice_attempts
  student_id, lesson_id, seq, attempts, correct (bool), first_try_correct (bool),
  duration_ms, updated_at
  PK(student_id, lesson_id, seq)
```

**Nashr sharti:** darsni "published" qilish uchun 1 ta Learn + kamida 10 ta Practice (p01..p10 uzluksiz) bo'lishi kerak. Qolgan holatda tugma o'chiq va nima yetishmasligi ko'rsatiladi.

### 6.6. Admin yuklash ekrani (faqat super admin)

- Ommaviy yuklash: dars sahifasidagi aniq ajratilgan fayl tanlash maydonida bir nechta `.jsx` fayl tanlanadi; nomdan dars/tur/tartib aniqlanadi va tanlangan fayllar ko'rsatiladi.
- Har fayl uchun holat: ✓ o'tdi / ✗ xato (4 darajadan qaysi birida va nima uchun).
- Darsning "yig'ilish holati": Learn ✓, Practice 1–10 qaysilari bor/yo'q.
- Preview: sandbox iframe da, Learn va har Practice alohida ochiladi.
- Versiyalash: yangi fayl yuklansa `version+1`, eskisini qaytarish mumkin.
- Faqat bitta tugma: **Nashr** (hamma shart bajarilganda).

---

## 7. Sinov (birinchi tekshiruv)

Yuklagan ikkala namuna platformaning birinchi **sinov to'plami** bo'ladi:

| Fayl | Kutiladigan natija |
|---|---|
| `Dars01.jsx` | Matematika namunasi `Audio`/`speechSynthesis` ishlatadi, shuning uchun ingliz platformasida **3-darajada rad etilishi kutiladi** (385 KB < 1.5 MB) |
| `D01_01.jsx` | O'tadi. `onReady`, `registerCheck`, `onSubmit` postMessage orqali ishlaydi, "Tekshirish" platformada |
| Sintetik yomon fayllar | `fetch(...)` bor, tashqi import bor, default export yo'q, juda katta: har biri aniq xabar bilan rad etiladi |

Bu to'plam 5-bosqichda (JSX pipeline) avtomatik testlarga aylantiriladi.

---

## 8. Ochiq savollar

1. **Standalone yoki Kit** (2-bo'lim)? Tavsiyam: Kit asosiy, standalone ham qabul qilinadi.
2. **Learn uchun `onFinished` natijasi**: `passed` bo'lmasa (60% dan past) keyingi bosqich (practice) ochilsinmi yoki Learn ni qayta ko'rish majburiymi?
3. **Practice xato chegarasi**: cheksiz urinishmi yoki 3 xatodan keyin "yechimni ko'rsatish" izohi chiqsinmi?
4. **Til**: o'quvchi interfeys tilini o'zi tanlaydimi (profilda) yoki admin belgilaydimi?
5. **Namunalar**: ularning dizayni (`#F5F5F0` och fon, `#FF5B35` accent) bizga mosmi yoki Coliseum uslubiga (qoramtir, bronza) o'tkazamizmi? PLAN.md da dizayn saytdan olinadi deb kelishilgan.
