# Coliseum English for Logistics — Kurs rejasi (v1)

B1 darajadagi o'quvchilar uchun **logistika speaking kursi**: 1 ta Intro + 4 modul × 8 dars = **32 asosiy dars**.
Har dars = **1 ta Learn fayl** (nazariya) + **kamida 10 ta Practice fayl** (amaliyot).
JSX fayl qoidalari alohida hujjatda: `JSX_CONTRACT.md`.

---

## 0. Qabul qilingan qarorlar

| Mavzu | Qaror | Holat |
|---|---|---|
| Daraja | B1 (kirish testi + Module 1 ni "tez takrorlash + speaking" ruhida) | Tasdiqlangan |
| Module 1 | Present Perfect va First Conditional qo'shilgan, Present Simple/Continuous bitta darsda | Tasdiqlangan |
| Reading | Faqat Module 3 da, amaliy vazifaga bog'langan holda | Tasdiqlangan |
| Ovoz | **Kursda ovoz umuman yo'q**: audio, ovozli sharh (ozvucka), TTS va tovush effektlari ishlatilmaydi. Tinglab tushunish o'rniga matnli dialog (chat, SMS, qo'ng'iroq transkripti, email) | Tasdiqlangan |
| Intro | 1 ta qisqa dars (5–7 daqiqa), login qilgan barcha o'quvchilar kurs dostupsiz ko'ra oladi (demo) | Tasdiqlangan |
| Checkpoint | Har modulning 8-darsi oxirida | Tasdiqlangan |
| Speaking mashqi | **A varianti**: matnli tanlovli role-play (branching) + "Say it aloud" (matn ko'rsatiladi, o'quvchi ovoz chiqarib o'qiydi va o'zini baholaydi; ovoz yozilmaydi). Mikrofon yozuvi (B) keyingi versiyada | Standart qilib olindi, o'zgartirish mumkin |
| Interfeys tili | `lang`: `uz` (standart), `ru`, `en`. Ingliz kontenti o'zgarmaydi, tushuntirish tili almashadi | Taklif |
| Practice soni | Har darsda **10 ta** (Intro: practice yo'q) | Tasdiqlangan |

Jami fayllar: 33 Learn + 320 Practice = **353 JSX fayl**.

---

## 1. Kurs strukturasi

| Bosqich | Nom | Yo'nalish | Darslar |
|---|---|---|---:|
| Intro | English for Logistics: The Why | Nima uchun logistikada ingliz tili kerak | 1 |
| Module 1 | English Foundations | Vocabulary + Speaking Grammar | 8 |
| Module 2 | Everyday Communication | Speaking + Writing + Vocabulary | 8 |
| Module 3 | Workplace Communication | Speaking + Reading + Writing + Vocabulary | 8 |
| Module 4 | Professional Logistics English | Professional Speaking | 8 |

Dars kodi: `M1L01`, `M2L05`, ... Intro: `INTRO`.

---

## 2. Har bir Learn faylning standart oqimi (11 ekran)

Barcha darslar bir xil skeletda quriladi, o'quvchi har safar nima kutishni biladi.

| № | Ekran | Mazmun |
|---:|---|---|
| 1 | **Mission** | Real logistika vaziyati (masalan, broker qo'ng'irog'i). "Bugun nimani uddalaymiz?" |
| 2 | **Read** | Qisqa matnli dialog (chat/SMS yoki qo'ng'iroq transkripti). O'zbekcha tarjima yashirin (o'quvchi ochadi) |
| 3 | **Notice** | Dialogdagi maqsadli iboralar belgilanadi, o'quvchi o'zi topadi |
| 4 | **Pattern** | Qoida/qolip qisqa animatsiya bilan. Tushuntirish `lang` tilida, misollar ingliz tilida |
| 5 | **Vocabulary** | 6–8 so'z kartochkasi: ma'nosi, misol gap, rasm/ikonka |
| 6 | **Guided check** | 2–3 yengil savol, har xato variantning o'z izohi bor |
| 7 | **Build** | So'z/jumla tuzish (order mexanikasi) |
| 8 | **Say it aloud** | Matn ko'rsatiladi, o'quvchi ovoz chiqarib o'qiydi, o'zini baholaydi (ballsiz, ovoz yozilmaydi) |
| 9 | **Role-play** | Branching dialog: o'quvchi javob variantini tanlaydi, suhbat davom etadi |
| 10 | **Rapid test** | 4 ta tezkor savol, natija `onFinished` payloadiga tushadi (o'tish chegarasi 60%) |
| 11 | **Summary** | Phrase bank (darsning 5–8 ta eng kerakli ibora) + mukofot |

Learn faylda **ball beriladigan** qismi faqat Rapid test. Qolganlari o'rgatuvchi.

---

## 3. Practice qoidalari

Har dars uchun **10 ta alohida fayl** (`M1L01.p01.jsx` ... `p10`). Har fayl = **1 ta topshiriq**.

### 3.1. Mexanikalar

| Kod | Mexanika | Izoh |
|---|---|---|
| MC | Variant tanlash | Har noto'g'ri variantning o'z izohi |
| GAP | Bo'shliqni to'ldirish | So'z-tugmalar orasidan tanlash |
| TYPE | Yozib javob | Qabul qilinadigan variantlar ro'yxati (katta-kichik harf, bo'shliq va tinish normalizatsiyasi) |
| MATCH | Juftlashtirish | Rangli juftlar, xatoni tuzatish yo'li bor |
| ORDER | So'z/jumla tartiblash | So'zlarni bosib gap tuzish |
| READ-MC | Matn o'qib tanlash | Qisqa chat/SMS/voicemail transkripti yoki hujjat parchasi, so'ng variantlar |
| READ-TYPE | Matndan topib yozish | Matndan raqam, ism, manzil, ID, vaqtni topib yozish (shartga qarab tanlab olish) |
| REPLY | Eng mos javobni tanlash | Dialogdagi keyingi gap |
| SORT | Guruhlarga ajratish | Masalan, hujjatlar / pul atamalari |
| FIX | Xatoni topish | Gapdagi xatoni tanlab tuzatish |
| FORM | Forma to'ldirish | Berilgan ma'lumotdan maydonlarni to'ldirish |
| SCENE | Mini-vaziyat (3 qadam) | Branching, o'rganganini ko'chirish (transfer) |

### 3.2. Har 10 talik to'plam uchun majburiy talablar

1. Kamida **5 xil mexanika**.
2. Kamida **2 ta o'qib-tushunish** topshiriq (READ-MC yoki READ-TYPE).
3. Kamida **1 ta FIX** (xatoni tahlil qilish).
4. **P10 doim SCENE**: darsning butun materiali bitta vaziyatda.
5. Qiyinlik zinapoyasi: P1–P3 tanish (recognition), P4–P6 boshqariladigan (controlled), P7–P9 erkinroq, P10 transfer.
6. Darsning Learn faylidagi gaplar so'zma-so'z takrorlanmaydi, yangi misollar ishlatiladi.
7. Har xato javobga javobni aytmaydigan, nimani tekshirishni ko'rsatadigan izoh yoziladi.
8. **Ovoz yo'q**: hech qanday audio, ovozli sharh yoki tovush effekti ishlatilmaydi (to'g'ri/xato signali ham faqat vizual).

---

## 4. INTRO — English for Logistics: The Why

**Format:** 1 Learn fayl, practice yo'q (oxirida ballsiz 3 savollik "Siz kim bilan gaplashasiz?" so'rovi).
**Maqsad:** o'quvchi nima uchun va qayerda ingliz tili kerakligini tushunadi, kurs yo'lini ko'radi.

| Ekran | Mazmun |
|---|---|
| Mission | Tungi 2:00, yuk kechikdi, broker qo'ng'iroq qilmoqda. Ingliz tilini bilmasangiz nima bo'ladi? |
| Read | 3 ta qisqa matn: dispatcher–driver chati, broker qo'ng'irog'i transkripti, email. "Bular real vaziyatlar" |
| Who | Siz kim bilan gaplashasiz: broker, driver, shipper, receiver, dispatcher (kartochkalar) |
| What | 6 ta vaziyat: load olish, pickup/delivery, kechikish, rate, hujjat, muammo |
| Path | Kurs xaritasi: 4 modul va har birining natijasi |
| Promise | Kurs oxirida nimani qila olasiz (3 ta aniq "I can…" jumla) |
| CTA | "Birinchi darsni boshlash" |

---

## 5. MODULE 1 — English Foundations

Maqsad: B1 o'quvchining mavjud grammatikasini speaking uchun **tez, aniq va ishlaydigan** holatga keltirish.

### M1L01 — Sentence Building and Questions
**Maqsad:** gap va savol tuzishni avtomatlashtirish.
**Til:** S + V + O; to be / have / need; wh-savollar (What, Where, When, Who, How much).
**Lug'at:** load, pickup, delivery, driver, broker, dispatcher, address, weight.
**Dialog:** dispatcher haydovchidan yuk haqida oddiy ma'lumot so'raydi.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | Kim kim? "Who arranges the truck for a load?" (broker/dispatcher/receiver rollari) |
| 2 | MATCH | 6 ta lug'at ↔ inglizcha ta'rif |
| 3 | READ-MC | Dispatcher nima so'rayapti: address, time yoki weight? |
| 4 | GAP | "The driver ___ the load at the dock." (picks / pick / picking) |
| 5 | ORDER | So'zlardan darak gap: "needs / The / address / driver / the" |
| 6 | ORDER | So'zlardan savol: "Where / the / is / pickup / ?" |
| 7 | FIX | "Where the delivery is?" → to'g'ri savol tartibini tanlab tuzatish |
| 8 | SORT | 8 ta gap: Darak / Savol (tinish belgisi va tartib bo'yicha) |
| 9 | READ-TYPE | Xabar matnidan yuk og'irligi va manzil raqamini topib yozing |
| 10 | SCENE | Broker bilan 3 qadam: kerakli 3 ta savolni to'g'ri tuzib, load ma'lumotini to'liq oling |

### M1L02 — Present Simple and Continuous
**Maqsad:** doimiy ish tartibi va hozirgi jarayonni farqlash.
**Til:** Present Simple (do/does, -s), Present Continuous, always/usually/now/at the moment.
**Lug'at:** load, unload, check in, wait, park, scale, dock, appointment.
**Dialog:** dispatcher driver bilan "hozir nima qilyapsiz?" haqida gaplashadi.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | "He ___ at the dock now." Simple yoki Continuous? |
| 2 | MATCH | Vaqt belgisi ↔ zamon (usually, now, every day, at the moment) |
| 3 | READ-MC | Haydovchi odatiy ishni aytayaptimi yoki hozirgi holatnimi? |
| 4 | GAP | do/does: "___ the receiver open on Sundays?" |
| 5 | GAP | -s qo'shish: "The dispatcher ___ (check) every truck." |
| 6 | ORDER | "is / The / driver / unloading / right now" |
| 7 | FIX | "She is usually works at night." to'g'rilash |
| 8 | SORT | 8 gap: Odat / Hozir |
| 9 | READ-TYPE | Xabar matnidan holatni topib yozing: "The driver is ___ ." (loading/waiting/parking) |
| 10 | SCENE | Brokerga "bugun odatda va hozir nima qilayotganingiz"ni 3 qadamda tushuntiring |

### M1L03 — Past Simple for Updates
**Maqsad:** bo'lib o'tgan voqeani qisqa va aniq xabar qilish.
**Til:** regular/irregular o'tgan zamon, was/were, did/didn't, vaqt belgilari.
**Lug'at:** picked up, delivered, arrived, left, on time, late, detention, POD, BOL.
**Dialog:** haydovchi dispatcherga yetkazib berish tugaganini xabar qiladi.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | "The truck ___ at 7 AM." (arrive/arrived/arriving) |
| 2 | MATCH | Noto'g'ri fe'l 3-shakli: go/went, get/got, send/sent, leave/left, take/took, bring/brought |
| 3 | READ-MC | Yuk qachon topshirildi? Vaqtni tanlang |
| 4 | GAP | did/didn't: "He ___ pick up the load yesterday." |
| 5 | ORDER | "delivered / We / the / load / at / 3 PM" |
| 6 | TYPE | Fe'lni o'tgan zamonga o'tkazib yozing: leave, send, get, take |
| 7 | FIX | "The driver didn't arrived on time." |
| 8 | REPLY | "Did you get the POD?" ga eng mos javob |
| 9 | READ-TYPE | Xabar matnidan vaqt va yetkazish joyini topib yozing |
| 10 | SCENE | Dispatcherga bugungi kun hisoboti: 3 ta voqeani o'tgan zamonda aytish |

### M1L04 — Present Perfect for Status Updates
**Maqsad:** hozirgi holatga bog'liq natijani aytish.
**Til:** have/has + V3; already, yet, just, still; Present Perfect va Past Simple farqi.
**Lug'at:** confirm, send, receive, assign, load status, empty, loaded, in transit.
**Dialog:** broker "Has the driver arrived yet?" deb so'raydi.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | "I ___ the BOL." (have sent / sent / sending) |
| 2 | MATCH | yet / already / just / still ↔ ma'nosi va o'rni |
| 3 | READ-MC | Broker nimani so'rayapti? Yuk yetib keldimi yoki hujjat yuborildimi? |
| 4 | GAP | have/has: "The driver ___ not arrived yet." |
| 5 | GAP | already/yet: "Have you confirmed the rate ___ ?" |
| 6 | ORDER | "just / has / The / left / driver" |
| 7 | FIX | "I have sent it yesterday." (Present Perfect + aniq vaqt xatosi) |
| 8 | SORT | 8 gap: Present Perfect / Past Simple (tanlov sababi bilan) |
| 9 | READ-TYPE | "Has the truck ___ ?" Yo'qolgan so'zni yozing |
| 10 | SCENE | Broker 3 ta holat savolini beradi, siz hozirgi holatni to'g'ri zamon bilan aytasiz |

### M1L05 — Future: will, going to, arrangements
**Maqsad:** reja, va'da va kelishuvni to'g'ri ifodalash.
**Til:** will (qaror/va'da), going to (reja/bashorat), Present Continuous (kelishilgan reja).
**Lug'at:** ETA, schedule, reschedule, confirm, window, appointment time, tomorrow, next.
**Dialog:** pickup vaqti haqida kelishuv.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | "I ___ call you back in 10 minutes." (will / am going to / call) |
| 2 | MATCH | Vaziyat ↔ shakl (va'da, reja, kelishuv) |
| 3 | READ-MC | Haydovchi qachon yetib boradi? ETA ni tanlang |
| 4 | GAP | "He ___ be late because of traffic." |
| 5 | GAP | "We ___ delivering at 9 tomorrow." (are) |
| 6 | ORDER | "will / I / send / the / rate confirmation / now" |
| 7 | FIX | "I will to call you later." |
| 8 | REPLY | "Can you pick up at 6 AM?" ga mos javob (will/going to) |
| 9 | READ-TYPE | Xabar matnidan sana va vaqtni topib yozing |
| 10 | SCENE | Pickupni qayta rejalashtiring: so'rang, kelishing, tasdiqlang |

### M1L06 — Modals and Polite Requests
**Maqsad:** talabni muloyim va aniq bildirish.
**Til:** can, could, would, should, have to, need to, must; "Could you…?", "Can I…?"
**Lug'at:** hold, send, resend, check, repeat, spell, wait, forward.
**Dialog:** telefonda muloyim so'rov va rad etish.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | Eng muloyim variantni tanlang: "Send me the rate!" / "Could you send me the rate, please?" |
| 2 | MATCH | Modal ↔ ma'nosi (majburiyat, ruxsat, maslahat, imkoniyat) |
| 3 | READ-MC | Gap muloyimmi yoki qo'polmi? |
| 4 | GAP | "You ___ send the BOL before delivery." (have to / can / could) |
| 5 | GAP | "___ you repeat that, please?" |
| 6 | ORDER | "Could / you / the / spell / name / please / ?" |
| 7 | FIX | "You must to arrive at 8." |
| 8 | REPLY | "Can you hold for a minute?" ga mos javob |
| 9 | READ-TYPE | Xabar matnidan muloyim so'rovdagi yo'qolgan so'zni topib yozing: "___ you send it again?" |
| 10 | SCENE | Qo'ng'iroqda 3 ta muloyim so'rov bilan kerakli ma'lumotni oling |

### M1L07 — First Conditional for Negotiation
**Maqsad:** shart va natija qolipi bilan muzokaraga tayyorlanish.
**Til:** If + Present, will/can; unless; "If you can…, I can…".
**Lug'at:** rate, per mile, flat rate, deadhead, fuel surcharge, lumper, accessorial.
**Dialog:** rate bo'yicha oddiy savdolashuv.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | "If you ___ $2,400, I can book it." (offer / will offer / offered) |
| 2 | MATCH | Atama ↔ ta'rif (deadhead, flat rate, lumper, accessorial) |
| 3 | READ-MC | Broker qanday shart qo'ydi? |
| 4 | GAP | "If it ___, we will reschedule." (rains) |
| 5 | GAP | "I can't book it ___ the rate goes up." (unless) |
| 6 | ORDER | "If / you / can / pay / I / will / take / it" |
| 7 | FIX | "If you will pay more, I take it." |
| 8 | REPLY | "That's too low." ga shartli javob |
| 9 | READ-TYPE | Xabar matnidan summa va shartni topib yozing |
| 10 | SCENE | Rate bo'yicha 3 raund: taklif, shart, kelishuv |

### M1L08 — Core Logistics Vocabulary + Checkpoint 1
**Maqsad:** 40 ta asosiy atamani mustahkamlash va Module 1 ni yopish.
**Guruhlar:** equipment (dry van, reefer, flatbed), documents (BOL, RC, POD, invoice), people (shipper, receiver, carrier, broker, dispatcher), money (rate, detention, TONU, lumper), places (dock, yard, warehouse, terminal).
**Checkpoint:** L1–L7 materiali bo'yicha umumiy mini test (Learn faylning Rapid test bo'limi 8 ta savol, o'tish 70%).

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MATCH | 6 ta atama ↔ ta'rif (equipment) |
| 2 | MATCH | 6 ta hujjat ↔ vazifasi |
| 3 | READ-MC | Ta'rifdan atamani aniqlash: "dry van" / "reefer" / "flatbed" |
| 4 | SORT | 12 atama: Equipment / Documents / Money / People |
| 5 | GAP | Atama bilan gapni to'ldirish (carrier, shipper, receiver) |
| 6 | MC | "Which document proves delivery?" (POD / RC / invoice) |
| 7 | FIX | Atama noto'g'ri ishlatilgan gapni topish |
| 8 | TYPE | Rasm/ta'rifdan atamani yozing (spelling ham tekshiriladi) |
| 9 | READ-TYPE | Xabar matnidan atamani to'g'ri topib yozing (5 ta) |
| 10 | SCENE | Atamalar bilan 3 qadamli yuk tavsifi (kim, nima, qayerga) |

---

## 6. MODULE 2 — Everyday Communication

Maqsad: sodda kundalik ish muloqoti: tanishish, so'rash, raqamlarni tushunish, telefon, forma va qisqa email.

### M2L01 — Introducing Yourself Professionally
**Maqsad:** o'zini, lavozimini va kompaniyasini ishonchli tanishtirish.
**Til:** "My name is… / I work as… / I've been in logistics for…", "Nice to meet you", qo'ng'iroqni ochish "This is … from …".
**Lug'at:** company, position, experience, team, department, MC number, authority.
**Dialog:** yangi broker bilan birinchi tanishuv.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | Qo'ng'iroqni boshlash uchun eng professional gap |
| 2 | MATCH | Lavozim ↔ vazifa (dispatcher, broker, carrier rep, safety officer) |
| 3 | READ-MC | Gapiruvchi kim va qaysi kompaniyadan? |
| 4 | GAP | "I ___ as a dispatcher for Coliseum Logistics." |
| 5 | ORDER | "been / I've / in / logistics / for / two years" |
| 6 | TYPE | O'zingizni tanishtiring: 3 ta bo'sh joyni (ism, lavozim, kompaniya) yozing |
| 7 | FIX | "I am working dispatcher since 2 years." |
| 8 | REPLY | "Nice to meet you. What do you do?" ga mos javob |
| 9 | READ-TYPE | Xabar matnidan ism va kompaniyani topib yozing |
| 10 | SCENE | Yangi brokerga o'zingizni 3 qadamda tanishtiring va kelishuvga olib keling |

### M2L02 — Asking for Information
**Maqsad:** kerakli ma'lumotni aniq va muloyim so'rash.
**Til:** "Could you tell me…?", "Do you know when…?" (bilvosita savol), aniqlashtirish: "Could you repeat that?"
**Lug'at:** commodity, dimensions, appointment, requirements, contact, reference number.
**Dialog:** shipperdan pickup talablarini so'rash.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | Qaysi savol bilvosita va muloyim? |
| 2 | MATCH | To'g'ridan-to'g'ri savol ↔ muloyim shakli |
| 3 | READ-MC | Shipper nimani so'rayapti? |
| 4 | GAP | "Could you tell me what time the receiver ___ ?" (opens) |
| 5 | ORDER | "Do / you / when / know / delivery / the / is / ?" |
| 6 | TYPE | "Where is the dock?" ni muloyim shaklga o'tkazing |
| 7 | FIX | "Could you tell me where is the pickup?" (so'z tartibi) |
| 8 | REPLY | Tushunmadingiz: eng mos aniqlashtiruvchi gap |
| 9 | READ-TYPE | Xabar matnidan manzildagi ko'cha raqamini topib yozing |
| 10 | SCENE | Shipper bilan 3 ta bilvosita savol berib, talablarni yig'ing |

### M2L03 — Numbers, Dates and Times
**Maqsad:** raqam, pul, og'irlik, sana va vaqtni o'qib va aytib to'g'ri ishlatish.
**Til:** 13/30, 15/50 farqi; $2,350; 42,000 lbs; sana (October 29th); vaqt (8 AM, quarter past, between 8 and 10).
**Lug'at:** miles, pounds, per mile, window, noon, midnight, a.m./p.m.
**Dialog:** miles, rate va vaqt oynasi muhokamasi.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | Qaysi raqam aytildi: thirteen yoki thirty? (matnli) |
| 2 | MATCH | Yozilgan raqam ↔ o'qilishi ($2,350 ↔ two thousand three hundred fifty dollars) |
| 3 | READ-MC | Xabardan vaqtni tanlang: 8:15 / 8:50 / 8:30 |
| 4 | GAP | "The window is ___ 8 and 10." |
| 5 | TYPE | Raqamni so'z bilan yozing: 1,450 |
| 6 | ORDER | "the / is / October / delivery / 29th / on" |
| 7 | FIX | "We deliver at the 3 PM in October 5." |
| 8 | SORT | 8 ta ifoda: Pul / Og'irlik / Vaqt / Sana |
| 9 | READ-TYPE | 3 ta raqamni yozing (rate, miles, weight) |
| 10 | SCENE | Rate, miles va vaqt oynasini aniqlab, to'g'ri raqamlarni qaytarib tasdiqlang |

### M2L04 — Spelling and Confirming Details
**Maqsad:** ism, manzil va ID larni harflab aytish va tasdiqlash.
**Til:** NATO alifbosi, "Is that B as in Bravo?", "Let me confirm…", "So that's…, right?"
**Lug'at:** spell, digit, letter, capital, confirm, correct, repeat.
**Dialog:** referens raqamni telefonda harflab tasdiqlash.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MATCH | Harf ↔ NATO so'zi (A–Alpha, B–Bravo, C–Charlie, D–Delta, ...) |
| 2 | MC | "Is that B as in ___ ?" |
| 3 | READ-MC | Xabardagi NATO so'zlari qaysi harflar? |
| 4 | READ-TYPE | Harflab yozilgan (NATO) referens raqamini yozing (masalan, KT-4821) |
| 5 | GAP | "Let me ___ that: your MC number is…" |
| 6 | TYPE | O'z ismingizni NATO alifbosi bilan yozing (kamida 3 harf) |
| 7 | FIX | "That is M like Mike?" → "as in" |
| 8 | ORDER | "Is / that / as / in / Delta / D / ?" |
| 9 | REPLY | Noto'g'ri tushunilgan harfga mos tuzatish gapi |
| 10 | SCENE | Ism, ID va telefon raqamini 3 qadamda tasdiqlash |

### M2L05 — Making and Answering Phone Calls
**Maqsad:** telefon suhbatini ochish, davom ettirish va yopish.
**Til:** "Hold on", "I'll transfer you", "Can I take a message?", "Could you speak a little slower?", "I didn't catch that".
**Lug'at:** hold, transfer, extension, voicemail, call back, reach, available.
**Dialog:** kerakli odamga ulanish.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | Qo'ng'iroqni yopish uchun eng mos gap |
| 2 | MATCH | Vaziyat ↔ ibora (kutdirish, ulash, xabar qoldirish) |
| 3 | READ-MC | Qo'ng'iroq natijasi: ulandi, xabar qoldirildi yoki band? |
| 4 | GAP | "I'll ___ you to Mr. Brown." (transfer) |
| 5 | ORDER | "Could / speak / slower / you / a / little / ?" |
| 6 | FIX | "I am not catch your name." |
| 7 | REPLY | "He's not available. Can I take a message?" ga javob |
| 8 | SORT | 8 ibora: Ochish / O'rtada / Yopish |
| 9 | READ-TYPE | Voicemail transkriptidan telefon raqami va ismni yozing |
| 10 | SCENE | Noto'g'ri odamga tushdingiz: kerakli odamga ulaning va xabar qoldiring |

### M2L06 — Filling Out Forms
**Maqsad:** BOL, rate con va haydovchi anketasi maydonlarini to'g'ri to'ldirish.
**Til:** qisqartmalar (Qty, Wt, ETA, PU, DEL, FCFS, TBD, N/A), maydon nomlari.
**Lug'at:** shipper, consignee, PO number, commodity, pieces, signature, date, seal.
**Dialog:** forma maydonlari bo'yicha savol-javob.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MATCH | Qisqartma ↔ to'liq shakli (PU, DEL, FCFS, TBD, ETA, N/A) |
| 2 | MC | "Consignee" kim? |
| 3 | READ-MC | Haydovchi qaysi maydon uchun ma'lumot aytayapti? |
| 4 | FORM | Berilgan 6 ta ma'lumotdan BOL maydonlarini to'ldiring |
| 5 | GAP | Anketadagi bo'shliqlar: "Date of ___ : 10/29" |
| 6 | TYPE | Gap ichidagi yo'qolgan atamani yozing (Qty, Wt) |
| 7 | FIX | Formadagi xato maydonni topish (noto'g'ri sana yoki raqam) |
| 8 | SORT | 10 ma'lumot qaysi maydonga tegishli: Shipper / Consignee / Commodity |
| 9 | READ-TYPE | Xabar matnidan ma'lumotni formaga topib yozing (PO raqami) |
| 10 | SCENE | Haydovchi anketasini 3 qadamda to'ldirish va xatosini tuzatish |

### M2L07 — Writing Simple Work Emails
**Maqsad:** qisqa va aniq ish email'ini yozish.
**Til:** mavzu, salom, maqsad, so'rov, yakun. "Please find attached", "Could you please…", "Thank you for your help", "Best regards".
**Lug'at:** subject, attachment, regards, request, deadline, follow up, reply.
**Dialog:** yo'q (yozma dars), o'rniga namunaviy 3 email.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | Eng yaxshi email mavzusi (subject) qaysi? |
| 2 | ORDER | Email qismlarini tartiblash: Greeting → Purpose → Request → Closing |
| 3 | MATCH | Maqsad ↔ ibora (so'rov, rahmat, ilova, eslatma) |
| 4 | GAP | "___ find attached the BOL." (Please) |
| 5 | TYPE | Muloyim so'rov gapini yozing: "send / rate confirmation" |
| 6 | FIX | Email'dagi qo'pol/noto'g'ri gapni tuzatish |
| 7 | READ-TYPE | Xabar matnidan qisqa xabardan email mavzusini (subject) topib yozing |
| 8 | REPLY | Brokerning savoliga email javobi qismini tanlash |
| 9 | READ-MC | Xabar matnini o'qib, unga mos email mavzusini tanlash |
| 10 | SCENE | Email'ni 3 qadamda yig'ing: mavzu, asosiy matn, yakun |

### M2L08 — Confirming Information in Writing + Checkpoint 2
**Maqsad:** kelishilgan ma'lumotni yozma tasdiqlash.
**Til:** "Just to confirm…", "As discussed…", "Per our call…", ro'yxat (pickup, delivery, rate).
**Lug'at:** confirm, as discussed, details, per, agreed, summary.
**Checkpoint:** M2L01–L07 bo'yicha 8 savol, o'tish 70%.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | "As discussed" qachon ishlatiladi? |
| 2 | MATCH | Qo'ng'iroq ma'lumotlari ↔ email satrlari |
| 3 | READ-MC | Qo'ng'iroqdagi kelishuvni to'g'ri aks ettirgan xulosani tanlang |
| 4 | READ-TYPE | Xabar matnidan pickup vaqti va rate ni topib yozing |
| 5 | GAP | "Just to ___ , pickup is Friday at 8." |
| 6 | ORDER | Tasdiqlash email'i satrlarini tartiblash |
| 7 | FIX | Email'dagi noto'g'ri raqam yoki sanani topish |
| 8 | TYPE | Berilgan ma'lumotdan bitta tasdiqlovchi gap yozing |
| 9 | FORM | Kelishuv ma'lumotlaridan tasdiqlash shablonini to'ldiring |
| 10 | SCENE | Qo'ng'iroq, so'ng tasdiqlovchi email: 3 qadamli to'liq jarayon |

---

## 7. MODULE 3 — Workplace Communication

Maqsad: ishga oid hujjat va vaziyatlarni **o'qish, tushunish, savol berish va yozma xabar** qilish.

### M3L01 — Understanding Load Information
**Maqsad:** load board e'lonidan kerakli ma'lumotni topish.
**Til:** qisqartmalar (DH, PU, DEL, RPM, FTL, LTL), raqamlar va shartlar.
**Lug'at:** origin, destination, equipment, miles, deadhead, commodity, weight, posted.
**Matn:** 3 ta load e'loni (Reading).

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MATCH | Qisqartma ↔ ma'nosi |
| 2 | MC | E'londan: yuk qayerdan qayerga? |
| 3 | MC | E'londan: qanday equipment kerak? |
| 4 | READ-MC | Broker e'loni matni: qaysi load haqida? |
| 5 | SORT | Ma'lumotlarni guruhlash: Joy / Pul / Yuk / Vaqt |
| 6 | TYPE | E'londan rate per mile ni hisoblab yozing |
| 7 | FIX | Load haqidagi xulosadagi xatoni topish |
| 8 | GAP | E'lon matnidagi bo'sh joylarni to'ldirish |
| 9 | READ-TYPE | Xabar matnidan load raqami va masofani topib yozing |
| 10 | SCENE | 3 ta e'londan eng mosini tanlang va brokerga 2 ta aniqlashtiruvchi savol bering |

### M3L02 — Reading Rate Confirmations
**Maqsad:** rate confirmation tarkibini tushunish va muhim shartlarni topish.
**Til:** line haul, fuel surcharge, accessorials, detention policy, TONU, payment terms, Net 30, check call talabi.
**Lug'at:** rate con, terms, penalty, signature, payment, policy, approval.
**Matn:** qisqartirilgan rate con (Reading).

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MATCH | Atama ↔ ma'nosi (TONU, Net 30, accessorial, line haul) |
| 2 | MC | Detention qachon boshlanadi? (hujjatdan) |
| 3 | MC | To'lov muddati qancha? |
| 4 | READ-MC | Brokerning rate con haqidagi izohini o'qib, mos bandni tanlang |
| 5 | SORT | Bandlar: Pul / Majburiyat / Vaqt / Hujjat |
| 6 | TYPE | Hujjatdan umumiy summani (line haul + fuel) hisoblab yozing |
| 7 | FIX | Hujjat bilan mos kelmaydigan gapni topish |
| 8 | GAP | Rate con gapidagi yo'qolgan atamani to'ldirish |
| 9 | READ-TYPE | Xabar matnidan check call vaqtini topib yozing |
| 10 | SCENE | Rate con'da noaniq band bor: brokerdan 2 ta savol bilan aniqlashtiring |

### M3L03 — Pickup and Delivery Details
**Maqsad:** pickup/delivery ko'rsatmalarini to'g'ri tushunish.
**Til:** appointment vs FCFS, window, dock number, PU#, seal number, check-in/out.
**Lug'at:** appointment, FCFS, dock, seal, receiver hours, lumper, check-in.
**Matn:** pickup/delivery instruktsiyasi (Reading).

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MATCH | Atama ↔ ma'nosi (FCFS, appointment, seal, lumper) |
| 2 | MC | Instruktsiyadan: qachon yetib kelish kerak? |
| 3 | READ-MC | Receiver ish vaqti qachon? |
| 4 | ORDER | Check-in qadamlarini tartiblash |
| 5 | GAP | "Report to door ___ and give the PU number." |
| 6 | SORT | Ma'lumotlar: Pickup / Delivery / Ikkalasi uchun |
| 7 | FIX | Instruktsiyani noto'g'ri tushungan xulosani topish |
| 8 | TYPE | Seal va PU raqamlarini matndan topib yozing |
| 9 | READ-TYPE | Xabar matnidan dock raqami va vaqtni topib yozing |
| 10 | SCENE | Yetib keldingiz, ish vaqti tugagan: 3 qadamda muammoni hal qiling |

### M3L04 — Asking for Updates
**Maqsad:** haydovchi va brokerdan holatni so'rash va javob berish.
**Til:** "Where are you now?", "What's your ETA?", "Have you been loaded yet?", "I'm 30 minutes out".
**Lug'at:** ETA, out, en route, loaded, empty, check call, update, status.
**Dialog:** check call.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | Holatni so'rash uchun eng mos savol |
| 2 | MATCH | So'rov ↔ mos javob |
| 3 | READ-MC | Haydovchining holati: yuklangan, yo'lda yoki kutmoqda? |
| 4 | GAP | "I'm 30 minutes ___ ." (out) |
| 5 | ORDER | "have / Have / loaded / you / been / yet / ?" |
| 6 | TYPE | Qisqa SMS yozing: "ETA 4 PM, no issues" (to'liq gap shaklida) |
| 7 | FIX | "Where you are now?" |
| 8 | REPLY | "What's your ETA?" ga eng aniq javob |
| 9 | READ-TYPE | Xabar matnidan ETA va joy nomini topib yozing |
| 10 | SCENE | Check call: 3 ta savol va aniq javoblar |

### M3L05 — Explaining Delays and Problems
**Maqsad:** kechikish sababini qisqa, aniq va muloyim tushuntirish.
**Til:** because / so / due to; "We were held up…", "I apologize for…", "I'll keep you posted".
**Lug'at:** traffic, weather, breakdown, detention, delay, held up, reason, solution.
**Dialog:** kechikish haqida xabar.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | "___ the snow, we're running late." (Due to / Because / So) |
| 2 | MATCH | Sabab ↔ mos ibora |
| 3 | READ-MC | Kechikish sababi va yangi ETA nima? |
| 4 | GAP | "We were ___ up at the shipper for two hours." |
| 5 | ORDER | "I / for / apologize / the / delay" |
| 6 | TYPE | Kechikish sababini bir gapda yozing (because bilan) |
| 7 | FIX | "Because of the truck broke down, we are late." |
| 8 | SORT | 8 gap: Sabab / Natija / Uzr / Va'da |
| 9 | READ-TYPE | Xabar matnidan sabab va yangi vaqtni topib yozing |
| 10 | SCENE | Brokerga kechikishni tushuntiring: sabab, yangi ETA, yechim |

### M3L06 — Writing Professional Updates
**Maqsad:** qisqa yozma holat xabari (SMS/email) yozish.
**Til:** tuzilma: Situation → Cause → New ETA → Action. Ton va qisqartmalar.
**Lug'at:** update, notify, ETA, reschedule, apologize, contact, confirm.
**Dialog:** yo'q (yozma), 3 ta namunaviy xabar.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | ORDER | Xabar qismlarini tartiblash: Situation → Cause → ETA → Action |
| 2 | MC | Eng professional xabar qaysi? |
| 3 | MATCH | Maqsad ↔ ibora |
| 4 | GAP | Xabardagi bo'shliqlarni to'ldirish |
| 5 | TYPE | Berilgan ma'lumotdan 2 gaplik update yozing |
| 6 | FIX | Xabardagi qo'pol yoki keraksiz gapni topib almashtirish |
| 7 | READ-TYPE | Xabar matnidan holatdan yangi ETA va sababni topib yozing |
| 8 | REPLY | Brokerning savoliga yozma javobni tanlash |
| 9 | READ-MC | Holat matnidan mos yozma xabarni tanlash |
| 10 | SCENE | Muammodan so'ng 3 qadamda xabarni yig'ish va yuborish |

### M3L07 — Clarifying Instructions
**Maqsad:** tushunmagan ko'rsatmani aniqlashtirish va qaytarib tasdiqlash.
**Til:** "Do you mean…?", "Just to make sure…", "So I need to…", "Could you say that again?"
**Lug'at:** clarify, mean, instruction, step, repeat, make sure, understand.
**Dialog:** murakkab ko'rsatma.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | Aniqlashtirish uchun eng mos gap |
| 2 | MATCH | Vaziyat ↔ ibora |
| 3 | READ-MC | Ko'rsatma: nima qilish kerak? |
| 4 | GAP | "Just to ___ sure, I need to call first?" |
| 5 | ORDER | "So / need / I / to / go / door / to / 5" |
| 6 | TYPE | Ko'rsatmani o'z so'zingiz bilan qaytaring (paraphrase) |
| 7 | FIX | Noto'g'ri tushungan xulosani topish |
| 8 | REPLY | Noaniq ko'rsatmadan keyingi eng yaxshi savol |
| 9 | READ-TYPE | Xabar matnidan ko'rsatmadagi raqam va vaqtni topib yozing |
| 10 | SCENE | Murakkab ko'rsatma: 3 qadamda aniqlashtirish va tasdiqlash |

### M3L08 — Handling Workplace Scenarios + Checkpoint 3
**Maqsad:** Reading + Writing + Speaking bitta vazifada.
**Stsenariylar:** BOL yo'q, manzil noto'g'ri, lumper to'lovi, kech yetib kelish.
**Checkpoint:** M3L01–L07 bo'yicha 8 savol, o'tish 70%.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | Stsenariy: BOL yo'q. Birinchi qadam? |
| 2 | MATCH | Muammo ↔ to'g'ri harakat |
| 3 | READ-MC | Muammo xabari: nima yuz berdi? |
| 4 | SORT | Harakatlar: Darhol / Keyinroq / Kerak emas |
| 5 | TYPE | Muammo haqida qisqa xabar yozing |
| 6 | FIX | Muammoni noto'g'ri hal qilgan javobni topish |
| 7 | GAP | Hujjatdan topilgan ma'lumot bilan gapni to'ldirish |
| 8 | REPLY | Brokerning javobiga mos keyingi gap |
| 9 | READ-TYPE | Xabar matnidan yangi manzilni topib yozing |
| 10 | SCENE | O'qish → so'rash → yozma tasdiqlash: to'liq 3 qadamli stsenariy |

---

## 8. MODULE 4 — Professional Logistics English

Maqsad: tez, aniq va professional logistika muloqoti. Yangi grammatika yo'q, mavjud bilimni real tezlikda ishlatish.

### M4L01 — Talking to Brokers
**Maqsad:** brokerga ishonchli murojaat qilish.
**Til:** "I'm calling about your load from X to Y", "Is it still available?", "What's the commodity and weight?", "My MC number is…"
**Lug'at:** available, covered, authority, MC number, commodity, dims, pickup window.
**Dialog:** tez gapiradigan amerikalik broker.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | Qo'ng'iroqni boshlash uchun eng professional gap |
| 2 | MATCH | Broker iborasi ↔ ma'nosi (covered, available, tendering) |
| 3 | READ-MC | Brokerning tez yozilgan xabari (qisqartmalar bilan): yuk hali bormi? |
| 4 | READ-MC | Broker nima talab qilmoqda: MC raqami, sug'urta yoki hujjat? |
| 5 | GAP | "I'm calling ___ your load from Dallas to Atlanta." |
| 6 | ORDER | "Is / still / it / available / the / load / ?" |
| 7 | FIX | Noto'g'ri yoki qo'pol so'rovni tuzatish |
| 8 | REPLY | "It's still open, what's your MC?" ga javob |
| 9 | READ-TYPE | Xabar matnidan lane (shahar–shahar) va rate ni topib yozing |
| 10 | SCENE | Brokerga qo'ng'iroq: 3 qadamda load haqida to'liq ma'lumot oling |

### M4L02 — Load Booking Conversations
**Maqsad:** yukni band qilish jarayonini to'liq boshqarish.
**Til:** "I can cover that", "Can you send the rate con?", "Please send it to…", "I'll get a truck assigned".
**Lug'at:** cover, book, assign, rate con, tender, dispatch email, driver info.
**Dialog:** yuk band qilish.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | Yukni olishga rozilik bildirish gapi |
| 2 | MATCH | Bosqich ↔ gap (taklif, rozilik, tasdiq, hujjat) |
| 3 | READ-MC | Broker nimani tasdiqladi? |
| 4 | ORDER | Booking bosqichlarini tartiblash |
| 5 | GAP | "I ___ cover that load." |
| 6 | TYPE | Rate con yuborishni so'rang (muloyim gap) |
| 7 | FIX | Muloyim emas yoki noto'g'ri band qilish gapini tuzatish |
| 8 | REPLY | "Can you send driver info?" ga javob |
| 9 | READ-TYPE | Xabar matnidan email va PU vaqtini topib yozing |
| 10 | SCENE | Yukni to'liq band qiling: taklif, shartlar, hujjatlar |

### M4L03 — Rate Negotiation
**Maqsad:** narxni professional tarzda muzokara qilish.
**Til:** "The best I can do is…", "That's too low for the miles", "Can you meet me at…?", "Deal.", dalil: fuel, deadhead.
**Lug'at:** counteroffer, meet, split the difference, firm, flexible, bonus.
**Dialog:** 3 raundli muzokara.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | Eng professional qarshi taklif qaysi? |
| 2 | MATCH | Taktika ↔ ibora (taklif, dalil, murosa, yakun) |
| 3 | READ-MC | Broker taklifi: summa va shart nima? |
| 4 | GAP | "The best I can ___ is $2,600." |
| 5 | ORDER | "meet / you / Can / me / at / $2,700 / ?" |
| 6 | TYPE | Dalil bilan rad etish gapini yozing (deadhead/fuel) |
| 7 | FIX | Qo'pol yoki keraksiz kuchli gapni professional shaklga o'tkazish |
| 8 | REPLY | "That's all I have." ga javob |
| 9 | READ-TYPE | Xabar matnidan oxirgi summani topib yozing |
| 10 | SCENE | 3 raundli muzokara: boshlang'ich, qarshi taklif, kelishuv |

### M4L04 — Communicating with Drivers
**Maqsad:** haydovchiga aniq va qisqa ko'rsatma berish.
**Til:** buyruq/modal: "Call me when you get there", "Don't forget the POD", HOS, parking, qisqa ko'rsatma.
**Lug'at:** HOS, parking, POD, check in, call me, hours, break, reefer temp.
**Dialog:** dispatcher–driver.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | Eng aniq ko'rsatma qaysi? |
| 2 | MATCH | Ko'rsatma ↔ maqsad |
| 3 | READ-MC | Haydovchi nima haqida xabar bermoqda? |
| 4 | GAP | "___ forget to get the POD." (Don't) |
| 5 | ORDER | "me / Call / you / when / get / there" |
| 6 | TYPE | Haydovchiga 2 ta qisqa ko'rsatma yozing |
| 7 | FIX | Noaniq yoki uzun ko'rsatmani aniqlashtirish |
| 8 | REPLY | Haydovchi: "I'm out of hours." ga javob |
| 9 | READ-TYPE | Xabar matnidan joy va qolgan soatlarni topib yozing |
| 10 | SCENE | Yo'lda muammo: ko'rsatma, tasdiq, keyingi qadam |

### M4L05 — Pickup and Delivery Coordination
**Maqsad:** shipper va receiver bilan uchrashuvlarni kelishish.
**Til:** "Can we move the appointment?", "He's at door 12", "Please confirm the time", "We'll be there by…".
**Lug'at:** reschedule, appointment, door, dock, receiver, shipper, window, hold.
**Dialog:** appointment o'zgartirish.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | Appointment ni o'zgartirish uchun mos so'rov |
| 2 | MATCH | Vaziyat ↔ ibora |
| 3 | READ-MC | Shipper yangi vaqtni nima dedi? |
| 4 | GAP | "Can we ___ the appointment to 10 AM?" |
| 5 | ORDER | "Please / the / time / confirm / new" |
| 6 | TYPE | Yangi vaqtni tasdiqlovchi gap yozing |
| 7 | FIX | Noto'g'ri vaqt/sana bilan tasdiqni tuzatish |
| 8 | REPLY | "We can only take him at 2 PM." ga javob |
| 9 | READ-TYPE | Xabar matnidan eshik raqami va vaqtni topib yozing |
| 10 | SCENE | Shipper va receiver bilan ikki appointment ni kelishish |

### M4L06 — Handling Delays and Emergencies
**Maqsad:** favqulodda vaziyatda xotirjam va tuzilgan xabar berish.
**Til:** "We have a situation", "Here's what happened", "Here's what we're doing", "I'll update you in 30 minutes".
**Lug'at:** breakdown, accident, tow, TONU, emergency, safe, escalate, update.
**Dialog:** breakdown haqida xabar.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | Favqulodda xabarni boshlash uchun eng mos gap |
| 2 | MATCH | Vaziyat ↔ birinchi qadam |
| 3 | READ-MC | Haydovchi: nima yuz berdi va u xavfsizmi? |
| 4 | ORDER | Xabar tuzilmasini tartiblash: situation → action → update |
| 5 | GAP | "Here's what we're ___ ." (doing) |
| 6 | TYPE | 2 gaplik favqulodda xabar yozing |
| 7 | FIX | Vahimali yoki noaniq xabarni professional shaklga o'tkazish |
| 8 | REPLY | Broker: "Can you still make it?" ga javob |
| 9 | READ-TYPE | Xabar matnidan joy va tow vaqtini topib yozing |
| 10 | SCENE | Breakdown: brokerga, haydovchiga va receiverga 3 xil xabar |

### M4L07 — Resolving Disputes Professionally
**Maqsad:** kelishmovchilikni xotirjam va professional hal qilish.
**Til:** "I understand your concern", "Here's what I can do", "Let's find a solution", "According to the rate con…".
**Lug'at:** dispute, detention, claim, damage, invoice, proof, resolve, compromise.
**Dialog:** detention to'lovi bo'yicha bahs.

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | MC | Bahsda eng professional boshlanish |
| 2 | MATCH | Ibora ↔ vazifa (tushunish, dalil, taklif, yakun) |
| 3 | READ-MC | Broker nimaga e'tiroz bildirmoqda? |
| 4 | GAP | "According ___ the rate con, detention starts after 2 hours." |
| 5 | ORDER | "Let's / a / find / solution" |
| 6 | TYPE | Dalil bilan javob yozing: hujjatga tayanib |
| 7 | FIX | Hujumkor gapni professional shaklga o'tkazish |
| 8 | REPLY | "We don't pay detention." ga javob |
| 9 | READ-TYPE | Xabar matnidan summa va vaqtni topib yozing |
| 10 | SCENE | Detention bahsi: tushuntirish, dalil, murosa |

### M4L08 — Full Logistics Communication Simulation + Final Assessment
**Maqsad:** butun kursni bitta uzluksiz stsenariyda sinash.
**Stsenariy:** broker bilan load → rate muzokarasi → haydovchiga ko'rsatma → kechikish → bahs → tasdiqlovchi email.
**Final:** M1–M4 bo'yicha kumulyativ baholash (o'tish 70%).

| № | Mex. | Topshiriq |
|---:|---|---|
| 1 | SCENE | 1-qism: brokerga qo'ng'iroq, load ma'lumotini oling |
| 2 | SCENE | 2-qism: rate muzokarasi |
| 3 | SCENE | 3-qism: haydovchiga ko'rsatma |
| 4 | SCENE | 4-qism: kechikish haqida xabar |
| 5 | SCENE | 5-qism: bahs va murosa |
| 6 | TYPE | Yakuniy tasdiqlovchi email yozing |
| 7 | READ-MC | Aralash xabarlar: 3 ta vaziyatni aniqlash |
| 8 | READ-TYPE | Aralash xabarlar: raqam, ism va vaqt topib yozishi |
| 9 | FIX | 5 ta mintaqaviy xatoni topish va tuzatish |
| 10 | SCENE | Yakuniy: to'liq muloqot zanjiri (boshidan oxirigacha) |

---

## 9. Keyingi qadamlar (kontent ishlab chiqarish)

1. Har dars uchun matnli dialog skriptlari (Intro + 32 dars, jami taxminan 40–60 ta, audiosiz).
2. Phrase bank (har darsning 5–8 ta iborasi) va lug'at ro'yxati (jami ~250 atama).
3. Birinchi namunaviy dars (tavsiya: `M1L01`) to'liq tayyorlanadi: 1 Learn + 10 Practice.
4. Kirish testi (placement) va 3 ta checkpoint testining savol banki.
