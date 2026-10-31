# INTRO — dars etaloni va JSX rejasi

**Dars:** English for Logistics: The Why (`INTRO.learn.jsx`)
**Muhim shart:** kursda **ovoz umuman yo'q**: audio, ovozli sharh (ozvucka), TTS, tovush effektlari ishlatilmaydi. Hamma narsa matn, tasvir va harakat orqali beriladi. To'g'ri/xato holati faqat vizual.

Bu hujjat ikki qismdan iborat: **A.** dars etaloni (mazmun va ekranlar), **B.** shu darsning JSX rejasi.

---

# A. DARS ETALONI

## A1. Etalon qoidalari (keyingi barcha darslar shunga mos bo'ladi)

Intro darsi mazmuni bo'yicha alohida, lekin **ekran tuzilishi va qoidalari** bo'yicha etalon. 32 darsning Learn fayllari quyidagi qoidalarga amal qiladi.

| № | Qoida | Ma'nosi |
|---:|---|---|
| 1 | **Ovoz yo'q** | Audio, TTS, tovush effekti yo'q. Fayl audio API'larini chaqirmaydi |
| 2 | **Bir ekran = bitta fikr** | Sarlavhadan tashqari matn 40 so'zdan oshmaydi |
| 3 | **Har 1–2 ekranda bitta harakat** | Bosish, tanlash, juftlash. Faqat o'qib o'tib ketish yo'q |
| 4 | **Ingliz matn ajralib turadi** | Ingliz iboralar yirik va ajratilgan (chat pufagi, kartochka). O'zbekcha tushuntirish kichikroq va jimroq rangda |
| 5 | **Tarjima yashirin** | "Tarjima" tugmasi bilan ochiladi, o'quvchi avval o'zi o'ylaydi |
| 6 | **Feedback sababi bilan** | Har javobdan keyin nima uchun to'g'ri/xato ekani 1–2 gapda yoziladi, javobni shunchaki aytib qo'yilmaydi |
| 7 | **Orqaga qaytish doim mumkin** | Oldingi ekranga qaytish tugmasi har doim bor |
| 8 | **Gate faqat kerakli joyda** | "Davom etish" faqat o'quvchi ekrandagi vazifani bajargach faol bo'ladi; sof axborot ekranlarida darhol faol |
| 9 | **Mobil birinchi** | 360×640 ekranda skrollsiz; bosiladigan joy kamida 44 px |
| 10 | **Til** | `lang`: `uz` (standart), `en`, ixtiyoriy `ru`. Ingliz kontenti til almashganda o'zgarmaydi |
| 11 | **Xotira** | Brauzer saqlash (localStorage va h.k.) ishlatilmaydi, holat faqat xotirada |
| 12 | **Qulaylik** | Rang yolg'iz belgi emas (ikonka/belgi ham bor), `prefers-reduced-motion` hurmat qilinadi, klaviatura bilan ishlaydi |

## A2. Dars pasporti

| Maydon | Qiymat |
|---|---|
| Kod | `INTRO` |
| Tur | Learn (practice yo'q) |
| Davomiyligi | 6–8 daqiqa |
| Ekranlar | 9 |
| Ball | Yo'q (ballsiz). Tugaganda `passed: true` |
| Kirish | **Login qilgan barcha o'quvchilarga ochiq**: admin kurs dostupi bermagan bo'lsa ham Intro ko'rinadi. Login/PIN/parol qoidasi o'zgarmaydi; progress o'quvchida saqlanadi |
| Tillar | `uz` (asosiy), `ru`, `en` (tasdiqlangan: Intro uchun `ru` majburiy) |
| Maqsad | O'quvchi (1) ingliz tili nima uchun kerakligini, (2) kim bilan gaplashishini, (3) qaysi vaziyatlarda ishlatilishini, (4) kurs yo'lini tushunadi va (5) o'z maqsadini tanlaydi |
| Natija | O'quvchi "Birinchi darsni boshlash"ga tayyor; admin esa o'quvchining maqsad va qiyinchiliklarini ko'ra oladi |

## A3. Ekranlar bo'yicha ssenariy

Formati: **Maqsad → Ekranda → Harakat → Feedback → Davom etish sharti**. Ingliz matnlar `inglizcha`, tushuntirishlar o'zbekcha.

### 1-ekran. Mission: "Telefon jiringlayapti"

**Maqsad:** o'quvchini hissiy ravishda vaziyatga tushirish.

**Ekranda:**
- Kichik belgi: `02:00`
- Sarlavha: **Telefon jiringlayapti**
- Chat pufagi (broker Mike, FastLoad):
  > *Hi, this is Mike from FastLoad. Where is my truck? The receiver closes at 4 AM!*
- "Tarjima" tugmasi: *Salom, men FastLoad'dan Mayk. Mening yukim qayerda? Qabul qiluvchi ertalab soat 4 da yopiladi!*
- Savol: **Siz nima qilasiz?**

**Harakat:** 3 variantdan birini tanlash (ballsiz).

| Variant | Feedback |
|---|---|
| A. Qo'ng'iroqni ko'tarmayman | Yuk kechikadi, broker sizga ishonmay qo'yadi. Bu eng qimmat tanlov. |
| B. Tushunmay turib "Yes, yes…" deyman | Mayk sizni tushundi deb o'ylaydi. Aytilmagan vaqt va'dasi yangi muammoga aylanadi. |
| C. *I'm 40 minutes out. I'll be there by 3:30.* | Aynan shu kurs sizni shunday javob berishga tayyorlaydi. (*Tarjima:* Men 40 daqiqa narida. Soat 3:30 gacha yetib boraman.) |

**Davom etish sharti:** istalgan variant tanlangan. Tanlov `firstReaction` ga yoziladi.

### 2-ekran. Real vaziyatlar: "Ingliz tili har kuni kerak"

**Maqsad:** ingliz tilining aynan qayerda ishlatilishini ko'rsatish.

**Ekranda:** 3 ta kartochka (bosilsa aylanadi va tarjimasi ochiladi). Sarlavha ostida ko'rsatma: *Har kartani bosing.*

| Kartochka (old tomoni) | Ingliz matn | Orqa tomoni (tarjima) |
|---|---|---|
| Chat · Dispatcher va Driver | *What's your ETA?* / *I'm 30 minutes out.* | ETA qancha? / 30 daqiqa qoldi. |
| Qo'ng'iroq · Broker | *Is the load still available? What's your MC number?* | Yuk hali bormi? MC raqamingiz qancha? |
| Email · Shipper | *Please find attached the BOL. Could you confirm the pickup time?* | BOL ilova qilindi. Pickup vaqtini tasdiqlay olasizmi? |

**Harakat:** 3 kartani ochish.
**Feedback:** to'liq ochilganda: *Bular ixtiro emas, real iboralar. Kurs davomida ularni o'zingiz ishlatasiz.*
**Davom etish sharti:** 3 ta karta ochilgan.

### 3-ekran. Who: "Siz kim bilan gaplashasiz?"

**Maqsad:** 5 ta asosiy rol bilan tanishtirish.

**Ekranda:** chap ustunda 5 ta ingliz ibora, o'ng ustunda 5 ta rol (qisqa o'zbekcha izoh bilan).

| Rol | Izoh | To'g'ri ibora |
|---|---|---|
| Broker | yuk va tashuvchi o'rtasidagi vositachi | *What's your MC number?* |
| Driver | haydovchi | *I'm 30 minutes out.* |
| Shipper | yukni jo'natuvchi | *Pickup is at door 5.* |
| Receiver | yukni qabul qiluvchi | *We close at 4 PM.* |
| Dispatcher | haydovchini yo'naltiruvchi | *Check in when you arrive.* |

**Harakat:** ibora ni, so'ng rolni bosib juftlash (juftlar bir xil rang va belgi oladi, xato juftni qayta tanlash mumkin).

**Feedback (har juftlik uchun, sababi bilan):**
- Broker: *MC raqami tashuvchining litsenziyasi. Uni vositachi broker tekshiradi.*
- Driver: *"out" masofani bildiradi. Faqat haydovchi o'z joyini biladi.*
- Shipper: *Yuk ortiladigan eshikni jo'natuvchi ko'rsatadi.*
- Receiver: *Ish vaqtini qabul qiluvchi ombor belgilaydi.*
- Dispatcher: *Haydovchiga ko'rsatma beradigan odam dispatcher.*

**Davom etish sharti:** 5 ta juftlik to'g'ri. Birinchi urinishdagi to'g'ri soni `matchFirstTry` ga yoziladi (ballga ta'sir qilmaydi).

### 4-ekran. Situations: "6 ta vaziyat"

**Maqsad:** kurs qamrovini ko'rsatish va o'quvchining ehtiyojini bilish.

**Ekranda:** 6 ta kartochka, har birida nom va bitta ingliz misol.

| № | Vaziyat | Misol |
|---:|---|---|
| 1 | Load olish | *I can cover that load.* |
| 2 | Pickup va delivery | *I'll be at the dock by 8 AM.* |
| 3 | Kechikish | *We're running late due to traffic.* |
| 4 | Rate | *The best I can do is $2,600.* |
| 5 | Hujjatlar | *Please send the rate confirmation.* |
| 6 | Muammo | *We have a situation. The truck broke down.* |

**Savol:** *Qaysi vaziyatlarda qiyinroq?* (1 tadan 3 tagacha tanlang)

**Feedback:** tanlangan kartochka ostida kursning qaysi qismi buni o'rgatishi chiqadi:

| Vaziyat | Kursda qayerda |
|---|---|
| Load olish | Module 4 · Load Booking Conversations |
| Pickup va delivery | Module 3 va 4 · Pickup and Delivery |
| Kechikish | Module 3 va 4 · Delays |
| Rate | Module 1 va 4 · Negotiation |
| Hujjatlar | Module 2 va 3 · Forms, Rate Confirmations |
| Muammo | Module 4 · Emergencies, Disputes |

**Davom etish sharti:** kamida 1 ta tanlov. `struggles` ga yoziladi.

### 5-ekran. Cost: "Bitta so'z qimmatga tushadi"

**Maqsad:** til xatosi real pulga aylanishini ko'rsatish.

**Ekranda:**
- Belgi: *O'quv misoli*
- Chat pufagi (broker): *Rate: $2,150 all-in.*
- Matn: *Haydovchi "all-in" ni bilmadi va yoqilg'i uchun alohida to'lov kutdi.*
- Savol: **"All-in" nimani anglatadi?**

| Variant | Feedback |
|---|---|
| A. Hamma xarajat narxga kiritilgan ✓ | *To'g'ri. All-in narxga yoqilg'i va boshqa to'lovlar kiradi. Alohida talab qilib bo'lmaydi.* |
| B. Faqat yo'l haqi | *Yo'q. Bu line haul. All-in undan kengroq.* |
| C. Yoqilg'i alohida to'lanadi | *Aksincha. Aynan shu yerda xato qilingan.* |

**Yakun matni:** *Haydovchi kutgan qo'shimcha to'lovni olmaydi. Bitta so'z, haqiqiy pul.*
**Davom etish sharti:** to'g'ri variant tanlangan (qayta urinish cheklanmagan).

### 6-ekran. Path: "Kurs yo'li"

**Maqsad:** o'quvchiga 4 bosqichli yo'lni ko'rsatish.

**Ekranda:** yuqoridan pastga yo'l xaritasi: `Intro (siz shu yerdasiz)` → 4 modul. Har modul bosilsa ochiladi.

| Modul | Nimani qila olasiz | Ingliz misol |
|---|---|---|
| 1 · English Foundations | Gap va savolni tez tuzasiz | *Has the driver arrived yet?* |
| 2 · Everyday Communication | Tanishish, telefon, forma, qisqa email | *Could you spell your name, please?* |
| 3 · Workplace Communication | Load va hujjatlarni o'qib, vaziyatni tushuntirasiz | *We were held up at the shipper.* |
| 4 · Professional Logistics English | Broker bilan professional muloqot | *If you can do $2,700, I can book it.* |

**Davom etish sharti:** 4 ta modul ochilgan.

### 7-ekran. Goals: "Maqsadingiz nima?"

**Maqsad:** o'quvchi o'z maqsadini belgilaydi (motivatsiya va keyingi moslashtirish uchun).

**Ekranda:** *Kurs oxirida men… qila olishni xohlayman.* 5 ta "I can" kartochkasi:

| Ingliz | Tarjima |
|---|---|
| *I can understand load details.* | Load ma'lumotlarini tushunaman. |
| *I can talk to brokers confidently.* | Brokerlar bilan ishonchli gaplashaman. |
| *I can write professional emails.* | Professional email yozaman. |
| *I can negotiate a rate.* | Rate bo'yicha muzokara qilaman. |
| *I can solve problems on the phone.* | Telefonda muammolarni hal qilaman. |

**Harakat:** 1 tadan 3 tagacha tanlash. **Davom etish sharti:** kamida 1 ta. `goals` ga yoziladi.

### 8-ekran. How: "Dars qanday ishlaydi"

**Maqsad:** o'quvchi platformani qanday ishlatishni biladi.

**Ekranda:** 3 qadamli oqim va 3 ta eslatma.

| Qadam | Mazmun |
|---|---|
| 1. Learn | Yangi mavzuni o'rganasiz (o'qiysiz va harakat qilasiz) |
| 2. Practice | 10 ta qisqa topshiriq. Har biri alohida, "Tekshirish" tugmasi bilan |
| 3. Keyingi dars | Admin ochgan keyingi darsga o'tasiz |

Eslatmalar:
- *Xato qilish normal. Izohni o'qing, qayta urinib ko'ring.*
- *Kursda ovoz yo'q. Iboralarni o'zingiz ovoz chiqarib o'qing.*
- *Darslar admin tomonidan ochiladi. Ochilmagan dars ko'rinmaydi.*

**Davom etish sharti:** yo'q (axborot ekrani).

### 9-ekran. Finish: "Siz tayyorsiz"

**Maqsad:** yakunlash va harakatga chaqirish.

**Ekranda:**
- Sarlavha: **Boshlaymiz**
- Xulosa: *Siz tanlagan maqsadlar:* [goals ro'yxati]; *Eng qiyin vaziyatlar:* [struggles ro'yxati]
- Bitta "I can" jumla: *In 32 lessons, I'll be able to handle real logistics calls.* (*32 darsdan keyin real logistika qo'ng'iroqlarini uddalay olaman.*)
- Asosiy tugma: **Birinchi darsni boshlash**

**Harakat:** tugma bosilganda `onFinished(payload)` bir marta chaqiriladi.

## A4. `onFinished` payload (Intro uchun)

```js
{
  lessonId: "INTRO",
  lessonTitle: "English for Logistics: The Why",
  durationSec: 395,
  totalQuestions: 0,
  correctAnswers: 0,
  scorePercent: 100,        // Intro ballsiz, doim 100
  passed: true,
  firstTryStats: { total: 6, firstTryCorrect: 4 },   // 5 ta juftlik + 1 ta "all-in" savol
  skillTags: ["course_orientation"],
  answers: [],
  profile: {
    firstReaction: "C",                  // A | B | C
    struggles: ["rate", "documents"],    // 1–3 ta
    goals: ["negotiate_rate", "talk_to_brokers"]
  }
}
```

`profile` platformada `learn_payload` ichida saqlanadi. Admin o'quvchi kartasida ko'ra oladi. Bu ma'lumot sezgir emas, lekin o'quvchi ko'rsatmagan narsa saqlanmaydi.

## A5. Vizual yo'nalish (saytdan olingan haqiqiy tokenlar)

Qiymatlar `coliseumlogistics-seven.vercel.app` saytidan brauzerda o'qib olindi (sayt CSS o'zgaruvchilari va computed style).

| Token | HEX / qiymat | Qo'llanishi |
|---|---|---|
| `--background` | `#0d1114` | Asosiy fon |
| `--surface` | `#171b1e` | Kartochka, pufak fon |
| `--surface-elevated` | `#1d2226` | Ko'tarilgan qatlam |
| `--bronze` | `#c19a63` | Aksent, asosiy tugma fon |
| `--bronze-light` | `#e0c28c` | Yengil aksent, hover |
| `--ivory` | `#f3efe7` | Och sirt/matn |
| `--foreground` | `#f5f3ee` | Asosiy matn va sarlavha |
| `--text-secondary` | `#a7aaad` | Ikkinchi darajali matn |
| `--text-muted` | `#73777a` | Eng jimroq matn |
| `--line` | `#ffffff14` | Chiziq/chegara (~8% oq) |
| Shrift | **Geist** (sans), Geist Mono (kod) | Hamma matn |
| h1 / h2 | 600 vazn, ~45 px / ~38 px (katta ekranda), h1 `letter-spacing` −0.02em | Sarlavhalar |
| Asosiy matn | 16 px; paragraf ~18 px, qator balandligi ~1.6 | |
| Tugma | fon `#c19a63`, matn `#0d1114`, radius 12 px, vazn 600 | "Apply for Training" |
| Karta | fon ~`#171b1e`, radius 12 px, chegara `0.8px solid rgba(255,255,255,.08)`, soyasiz | |

Qo'llash qoidalari:
- Ingliz matn: `--foreground`, qalin (600). O'zbekcha/ruscha tushuntirish: `--text-secondary`.
- Asosiy tugma bronza, ikkinchi darajali tugma chegarali (`--line`).
- To'g'ri/xato holati uchun alohida `--success` va `--warn` (saytda yo'q, dars uchun qo'shiladi) va har doim belgi (✓ / !) bilan.
- Glow va neon yo'q, soyalar yo'q, chegara bilan ajratiladi (saytdagi kabi).
- Animatsiya kam; hammasi `prefers-reduced-motion` da o'chadi.
- Kontrast: `#f5f3ee` `#0d1114` ustida juda yuqori; `--text-muted` (`#73777a`) faqat ikkinchi darajali yozuvlarda (kichik matnda kontrast pastroq bo'lishi mumkin, shuning uchun asosiy ma'noni tashimaydi).

**Shrift haqida:** sandbox iframe'da tashqi manbaga chiqib bo'lmaydi, shuning uchun **Geist shriftini iframe runtime o'zi** platforma domenidan (`font-src` platforma origin) yuklaydi. Dars fayllari faqat `font-family: var(--font-sans)` ishlatadi (zaxira: `system-ui`).

---

## A6. Ruscha matnlar (ru)

Ingliz iboralar o'zgarmaydi, faqat tushuntirish va tarjimalar. O'zbekcha va inglizcha tushuntirishlar shu tuzilishdagi `uz`/`en` kalitlari bo'yicha yoziladi.

**Interfeys:** Назад · Далее · Перевод · Начать · Проверить

| Ekran | Ruscha matn |
|---|---|
| 1 | Title: **Звонит телефон**. Tarjima: *Привет, это Майк из FastLoad. Где мой трак? Получатель закрывается в 4 утра!* Savol: **Что вы сделаете?** |
| 1 · A | Не отвечу на звонок. → *Груз опоздает, а брокер перестанет вам доверять. Это самый дорогой выбор.* |
| 1 · B | Скажу «Yes, yes…», не поняв. → *Майк решит, что вы всё поняли. Невысказанное время приезда превратится в новую проблему.* |
| 1 · C | *I'm 40 minutes out. I'll be there by 3:30.* → *Именно к такому ответу вас готовит курс.* (Перевод: Я в 40 минутах. Буду на месте к 3:30.) |
| 2 | Title: **Английский нужен каждый день**. Ko'rsatma: *Нажмите на каждую карточку.* Kartalar: *Чат · Диспетчер и водитель* («Какое у вас ETA?» / «Я в 30 минутах.»); *Звонок · Брокер* («Груз ещё свободен? Какой у вас MC-номер?»); *Email · Отправитель* («BOL во вложении. Подтвердите время погрузки?»). Yakun: *Это не выдумка, а реальные фразы. В курсе вы будете использовать их сами.* |
| 3 | Title: **С кем вы разговариваете?** Rollar: Брокер (посредник между грузом и перевозчиком), Водитель, Отправитель (shipper, отправляет груз), Получатель (принимает груз), Диспетчер (направляет водителя). |
| 3 · feedback | Брокер: *MC-номер — лицензия перевозчика. Его проверяет брокер-посредник.* · Водитель: *«out» — расстояние до места. Своё положение знает только водитель.* · Отправитель: *Ворота погрузки указывает отправитель.* · Получатель: *Часы работы определяет склад получателя.* · Диспетчер: *Указания водителю даёт диспетчер.* |
| 4 | Title: **6 ситуаций**. Savol: **В каких ситуациях вам сложнее всего?** (от 1 до 3). Nomlar: Взять груз · Погрузка и доставка · Опоздание · Ставка (rate) · Документы · Проблема |
| 4 · feedback | Взять груз: Module 4 · Load Booking · Погрузка и доставка: Module 3 и 4 · Опоздание: Module 3 и 4 · Ставка: Module 1 и 4 · Документы: Module 2 и 3 · Проблема: Module 4 |
| 5 | Belgi: *Учебный пример*. Matn: *Водитель не знал слова «all-in» и ждал отдельной оплаты топлива.* Savol: **Что значит «all-in»?** A. Все расходы включены в ставку ✓ — *Верно. В all-in входят топливо и другие платежи. Отдельно требовать их нельзя.* B. Только плата за рейс — *Нет. Это line haul. All-in шире.* C. Топливо оплачивается отдельно — *Наоборот. Именно здесь и ошиблись.* Yakun: *Водитель не получит ожидаемую доплату. Одно слово — реальные деньги.* |
| 6 | Title: **Путь курса**. Intro (вы здесь) → 1 · English Foundations: *Быстро строите фразы и вопросы* · 2 · Everyday Communication: *Знакомство, телефон, формы, короткие письма* · 3 · Workplace Communication: *Читаете документы и объясняете ситуацию* · 4 · Professional Logistics English: *Профессиональный разговор с брокером* |
| 7 | **Что вы хотите уметь к концу курса?** Понимаю данные по грузу · Уверенно говорю с брокерами · Пишу профессиональные письма · Веду переговоры о ставке · Решаю проблемы по телефону |
| 8 | **Как проходит урок.** 1. Learn — изучаете тему. 2. Practice — 10 коротких заданий с кнопкой «Проверить». 3. Следующий урок — открывает админ. Заметки: *Ошибаться нормально. Прочитайте пояснение и попробуйте снова.* · *В курсе нет звука. Произносите фразы вслух сами.* · *Уроки открывает администратор. Закрытый урок не виден.* |
| 9 | **Начинаем.** *Ваши цели:* … *Самые трудные ситуации:* … *In 32 lessons, I'll be able to handle real logistics calls.* (*Через 32 урока я смогу вести реальные логистические звонки.*) Tugma: **Начать первый урок** |

Ruscha va inglizcha tushuntirishlarning to'liq `CONTENT` yozuvi 1-qadamda (B11) amalga oshiriladi; so'zlar soni (40 gacha) uch tilda ham tekshiriladi.

---

# B. INTRO JSX REJASI

## B1. Fayl

| Maydon | Qiymat |
|---|---|
| Nom | `INTRO.learn.jsx` |
| Tur | Learn |
| Eksport | `export default function Lesson(props)` |
| Props | `lang` (`uz`/`ru`/`en`), `studentName`, `onFinished` (audio propslari yo'q) |
| Importlar | `react` (va tavsiya etilgan `@coliseum/kit`). `react-dom` kerak emas |
| Hajm maqsadi | Kit bilan ≤ 25 KB, standalone ≤ 60 KB |
| Metadata | `export const meta = { type: "learn", lessonCode: "INTRO", seq: 0 }` |

## B2. Fayl ichidagi tartib

```
INTRO.learn.jsx
 1. meta
 2. TOKENS + STYLES            // CSS o'zgaruvchilar, komponent stillari, media so'rovlar
 3. CONTENT                    // barcha matnlar: { uz, en, ru? }, inglizcha iboralar oddiy string
 4. helpers                    // tx(text, lang), normalizeLang, canContinue(gate), clamp
 5. atom komponentlar          // Bubble, TranslateToggle, Feedback, ProgressDots, NavBar
 6. mexanikalar                // FlipCards, MatchPairs, SingleChoice, MultiPick, Accordion
 7. ekranlar                   // Screen1Mission ... Screen9Finish
 8. SCREENS massivi            // ekranlar ro'yxati, tartib shu yerda
 9. default export Lesson      // holat, navigatsiya, payload, onFinished
```

## B3. Komponent daraxti

```
Lesson
 ├─ <style>{STYLES}</style>
 ├─ LangSwitch               (faqat `lang` berilmaganda, preview rejimi)
 ├─ ProgressDots             (1/9 ... 9/9)
 ├─ ScreenHost               (key = current ekran)
 │    └─ ScreenN             (har ekran o'z gate'ini `onGate(boolean)` bilan bildiradi)
 └─ NavBar                   [Orqaga]  [Davom etish]  (Davom etish gate bo'yicha faol)

Mexanikalar (ekranlar ichida):
  S1  SingleChoice + Bubble + TranslateToggle + Feedback
  S2  FlipCards (3 ta)
  S3  MatchPairs (5 juftlik, rang va belgi bilan)
  S4  MultiPick (max 3) + Feedback (kursdagi o'rni)
  S5  Bubble + SingleChoice + Feedback
  S6  Accordion (4 modul)
  S7  MultiPick (max 3)
  S8  Steps (statik)
  S9  Summary + CTA
```

## B4. Holat va navigatsiya

```
state:
  current        : 0..8
  gates          : boolean[9]         // har ekran uchun "davom etish mumkinmi"
  profile        : { firstReaction, struggles[], goals[] }
  matchFirstTry  : number             // 0..5
  costFirstTry   : boolean            // 5-ekran birinchi urinishda to'g'rimi
  startedAt      : ref(Date.now())
  finishedRef    : ref(false)         // onFinished faqat bir marta

navigatsiya:
  next()     : gates[current] true bo'lsa current+1
  prev()     : current-1 (har doim mumkin; oldingi javoblar saqlanib qoladi)
  finish()   : finishedRef true bo'lmasa payload yig'ib onFinished(payload)
```

Qoida: ekran almashganda oldingi ekranning javoblari yo'qolmasligi uchun javoblar `Lesson` darajasida saqlanadi, ekran ichida emas. Namunadagi `canUseGrade4TheoryContinue(gatePassed)` kabi bitta toza gate funksiyasi ishlatiladi.

## B5. `CONTENT` tuzilmasi (qoida)

```js
const CONTENT = {
  s1: {
    time: "02:00",
    title: { uz: "Telefon jiringlayapti", en: "The phone is ringing" },
    bubble: { from: "Mike · FastLoad",
              en: "Hi, this is Mike from FastLoad. Where is my truck? The receiver closes at 4 AM!",
              uz: "Salom, men FastLoad'dan Mayk. ..." },
    question: { uz: "Siz nima qilasiz?", en: "What do you do?" },
    options: [
      { id: "A", text: { uz: "Qo'ng'iroqni ko'tarmayman", en: "..." },
        feedback: { uz: "Yuk kechikadi, ...", en: "..." } },
      ...
    ],
  },
  ...
};
```

Qoidalar:
- Ingliz iboralar `en` (yoki oddiy string) sifatida, **tarjima** esa `uz`. Tushuntirish matnlari uchun `uz/en/ru` kalitlari.
- Matn kodda emas, `CONTENT` da turadi. Ekran komponenti faqat chizadi.
- Hamma matn 40 so'z qoidasi uchun tekshiriladi (A1, 2-qoida). Intro uchun **`uz`, `ru`, `en` uchalasi majburiy** (A6).

## B6. Stil va moslashuv

- **CSS o'zgaruvchilar** `:root` o'rniga `.intro-root` ichida e'lon qilinadi (iframe ichida ham, platformada ham toza ishlaydi): `--background:#0d1114`, `--surface:#171b1e`, `--surface-elevated:#1d2226`, `--bronze:#c19a63`, `--bronze-light:#e0c28c`, `--ivory:#f3efe7`, `--foreground:#f5f3ee`, `--text-secondary:#a7aaad`, `--text-muted:#73777a`, `--line:#ffffff14`, `--success`, `--warn`, `--radius:12px`, `--font-sans` (A5).
- Skrollsiz maket: `100dvh` ichida flex ustun; ekran balandligi kichik bo'lsa (`max-height: 760px`, `700px`) faqat bo'sh joy qisqaradi, bosiladigan joy 44 px dan kichraymaydi (namunadagi NOSCROLL usuli).
- `document.documentElement` va `window.resize` ishlatilmaydi (namunadagi mobil zoom hiylasi o'rniga `clamp()` va media so'rovlar).
- Chat pufagi va kartochkalar uchun yagona stil; rang bilan birga belgi (●■◆★▲) ishlatiladi.
- `prefers-reduced-motion`: animatsiya va aylanish o'chadi.

## B7. Qulaylik (a11y)

- Hamma interaktiv narsa `<button>`, fokus belgisi ko'rinadi.
- Feedback bloki `aria-live="polite"`.
- Karta aylanishida ikkala yuz ham DOM'da, yashirin yuz `aria-hidden`.
- Kontrast kamida 4.5:1 (matn) va 3:1 (katta matn va belgilar).
- Klaviatura: Tab, Enter/Space; match juftlashda ham klaviatura bilan ishlaydi.

## B8. Ovozsiz kafolat

- Fayl `Audio`, `new Audio`, `speechSynthesis`, `AudioContext`, `<audio>`, `<video>` ni **chaqirmaydi**.
- Platforma ovozsiz dars siyosati bilan bunday fayllarni 3-darajada rad etadi (`JSX_CONTRACT.md`, 6.1).
- `playCorrect`/`playWrong` kabi hodisalar Learn uchun yo'q.

## B9. Platforma bilan aloqasi

- Platforma `props` ni iframe runtime orqali beradi, `onFinished` `postMessage` ko'prigi orqali qaytadi (`JSX_CONTRACT.md`, 6.3).
- Intro uchun platforma Learn hostini ishlatadi, practice hosti yo'q.
- Demo faqat login qilgan o'quvchiga ochiladi. Kursga enrollment bo'lishi shart emas; `studentName` va `onFinished` odatdagidek ishlaydi, Intro progressi saqlanadi. Kirmagan foydalanuvchi login sahifasiga yo'naltiriladi.

## B10. Qabul qilish ro'yxati (Definition of Done)

| № | Tekshiruv |
|---:|---|
| 1 | Fayl yuklashning 4 darajasidan o'tadi (nom, sintaksis, xavfsizlik, smoke render), audio API yo'q |
| 2 | Barcha 9 ekran ketma-ket ochiladi, gate to'g'ri ishlaydi |
| 3 | 360×640 va 1280×720 da hech bir ekran skrollga ketmaydi |
| 4 | Orqaga qaytilganda javoblar saqlanib qoladi |
| 5 | `onFinished` aniq bir marta, to'g'ri `payload` bilan chaqiriladi |
| 6 | `uz`, `ru`, `en` tillarida matnlar to'liq, `lang` bermasa preview almashtirgich ko'rinadi |
| 7 | `prefers-reduced-motion` yoqilganda animatsiya yo'q |
| 8 | Faqat klaviatura bilan boshidan oxirigacha o'tish mumkin |
| 9 | Matn kontrasti me'yorda, rang yolg'iz belgi emas |
| 10 | Sandbox iframe ichida (allow-same-origin yo'q) to'liq ishlaydi |
| 11 | Hajm: kit bilan ≤ 25 KB, standalone ≤ 60 KB |
| 12 | Hech bir ekranda 40 so'zdan ortiq matn yo'q |

## B11. Ish tartibi (Claude Code bilan)

1. `CONTENT` ni to'liq yozish (uz va en), keyin so'zlar sonini tekshirish.
2. Atom komponentlar va stil (tokenlar, NOSCROLL qoidalari).
3. Mexanikalar: SingleChoice, FlipCards, MatchPairs, MultiPick, Accordion.
4. 9 ekranni yig'ish va gate'larni ulash.
5. Payload va `onFinished`.
6. Sandbox'da sinash (360×640 va 1280×720), klaviatura va a11y tekshiruvi.
7. Natija: `INTRO.learn.jsx`, undan keyin shu mexanikalar kitga ko'chiriladi va M1L01 uchun ishlatiladi.

---

## Qabul qilingan qarorlar

| № | Savol | Qaror |
|---:|---|---|
| 1 | Intro hamma uchun ochiqmi? | Faqat login qilgan barcha o'quvchilarga; kurs dostupi talab qilinmaydi |
| 2 | 5-ekran misoli | Hozircha o'zgarmaydi ("all-in", o'quv misoli) |
| 3 | Intro uchun `ru` | Ha, kerak: `uz`, `ru`, `en` |
| 4 | Bronza va ivory HEX | Saytdan olindi (A5): bronza `#c19a63`, ivory `#f3efe7` |

Qolgan texnik masala: Geist shriftini iframe runtime platforma domenidan yuklaydi (A5, "Shrift haqida").
