# Module 1 — English Foundations: Learn dars kontenti (slaydlar)

8 ta dars, har biri **14–15 slayd**. Bu hujjat **Learn fayllar** uchun kontent (nima yoziladi). Practice (10 tadan) `COURSE.md` da rejalashtirilgan.

---

## 0. Umumiy qoidalar va format

**Ovoz yo'q.** Audio, TTS, tovush effekti yo'q. Hamma narsa matn, tanlash, bosish va tartiblash orqali.

**Slayd oqimi (standart, 14–15 slayd).** `COURSE.md` dagi 11 ekranli oqim kengaytirildi: Pattern 3–4 slaydga bo'lindi, "Say it aloud" Summary bilan birlashtirildi.

| № | Slayd | Vazifasi |
|---:|---|---|
| 1 | Mission | Vaziyat + qisqa tanlov (ballsiz) |
| 2 | Read | Matnli dialog (chat/qo'ng'iroq), tarjima yashirin |
| 3 | Notice | Dialogdan maqsadli iboralarni topish |
| 4–7 | Pattern / Traps | Qoida 3–4 slaydda, so'ng "xatolar tuzog'i" |
| 8–9 | Vocabulary | 8 ta so'z kartochkasi |
| 9–10 | Guided check | 3 ta savol, har xato variantning izohi bor |
| 10–11 | Build | So'z/jumla tartiblash (3 ta) |
| 11–12 | Fix it | Xatoni topib tuzatish (3 ta) |
| 12–13 | Role-play | 3 qadamli branching dialog |
| 13–14 | Rapid test | 4 ta savol (L08 da 8 ta), natija `onFinished` ga |
| 14–15 | Summary + Say it aloud | Phrase bank, o'quvchi matnni ovoz chiqarib o'qiydi va o'zini baholaydi (ballsiz) |

**Matn qoidalari.** Slayd matni sarlavhadan tashqari 40 so'zdan oshmaydi; dialog (Read) 60 so'zgacha. Ingliz iboralar *kursivda*. Tarjima "Tarjima" tugmasi orqali ochiladi. Dars tili: tushuntirishlar o'zbekcha (`uz`); `ru` va `en` tushuntirishlar yig'ish bosqichida chiqariladi.

**Feedback qoidasi.** Har xato variant javobni aytmasdan, **nimani tekshirish kerakligini** ko'rsatadi.

**Takror qoidasi.** Learn dagi gaplar `COURSE.md` dagi Practice gaplarini so'zma-so'z takrorlamaydi.

**Belgilar.** ✓ to'g'ri javob. Interaktivlik turlari: *Ko'rish* (faqat o'qish), *Bosish* (kartani ochish), *Tanlash* (variant), *Tartiblash*, *Juftlash*.

**Natija (payload).** Rapid test natijasi `correctAnswers/totalQuestions`; o'tish chegarasi 60% (L08 checkpoint: 70%). Har darsning `skillTags` ro'yxati quyida.

---

## M1L01 — Sentence Building and Questions

**Maqsad:** gap va savol tuzishni avtomatlashtirish.
**skillTags:** `svo_order`, `be_have_need`, `wh_questions`
**Davomiyligi:** ~12 daqiqa

#### S1 · Mission — "Birinchi kun"
- **Ekranda:** belgi `07:30`. Haydovchi Tom yozmoqda: *Hi, it's Tom. I'm at the yard. Do you have a load for me?*
- **Tarjima:** Salom, men Tomman. Yardda turibman. Menga yuk bormi?
- **Savol:** Siz dispatchersiz. Qaysi javob to'g'ri?
- **Variantlar:** A *Yes, I have a load for you.* ✓ · B *Yes, a load I have for you.* · C *Yes, have I a load for you.*
- **Feedback:** A — to'g'ri, fe'l (*have*) kim (*I*) dan keyin keldi. B — fe'l oldingi so'z bilan ajralib, yuk oldinga chiqib ketgan. C — bu savol tartibi, bu yerda esa javob (darak gap) kerak.

#### S2 · Read — Dispatcher va Tom
- **Ekranda (chat):**
  - Tom: *Do you have a load for me?*
  - Dispatcher: *Yes. I have a load from Dallas to Atlanta.*
  - Tom: *What is the weight?*
  - Dispatcher: *The weight is 38,000 pounds.*
  - Tom: *Where is the shipper?*
  - Dispatcher: *The shipper is in Dallas. He opens at 7 AM.*
  - Tom: *Who is the broker?*
  - Dispatcher: *Mike from FastLoad. He sends the address now.*
- **Tarjima (yashirin):** Menga yuk bormi? / Ha. Dallasdan Atlantagacha yukim bor. / Og'irligi qancha? / Og'irligi 38 000 funt. / Shipper qayerda? / Shipper Dallasda. U ertalab 7 da ochiladi. / Broker kim? / FastLoad'dan Mayk. U manzilni hozir yuboradi.

#### S3 · Notice — "Uch xil gap"
- **Harakat:** dialogdan 3 gapni tegib, guruhga qo'yish (*Tanlash*).
  - *I have a load from Dallas to Atlanta.* → **Darak**
  - *Where is the shipper?* → **Wh-savol**
  - *Do you have a load for me?* → **Yes/No savol**
- **Feedback:** *Wh-savol so'z bilan boshlanadi. Yes/No savol yordamchi so'z (do, is) bilan boshlanadi. Darak gap esa so'z bilan emas, kim (egasi) bilan boshlanadi.*

#### S4 · Pattern 1 — Gapning tartibi
- **Ekranda:** rangli bloklar: **The dispatcher** (kim) + **calls** (nima qiladi) + **the driver** (kimni).
- **Matn:** *Ingliz gapida fe'l doim 2-o'rinda: Kim → Nima qiladi → Kimni/Nimani.* O'zbekchada fe'l oxirida: *Dispetcher haydovchiga qo'ng'iroq qiladi.* Inglizchada: *The dispatcher calls the driver.*
- **Harakat:** har blokni bosib nomini ko'rish (*Bosish*).

#### S5 · Pattern 2 — be, have, need
- **Ekranda:** 3 ustun:
  - **be** (am/is/are): *The load is heavy. We are ready. I am at the gate.*
  - **have**: *We have a new load.*
  - **need**: *They need a truck.*
- **Muhim:** o'zbekcha *"Yuk og'ir"* deyiladi, inglizchada esa **is** tushib qolmaydi: *The load **is** heavy.*
- **Harakat:** 2 ta bo'shliq: *We ___ the BOL.* (have ✓) · *The truck ___ ready.* (is ✓).

#### S6 · Pattern 3 — Savollar
- **Ekranda:** formula: **Wh-so'z + is/are/do + kim/nima**.
  - *What is the weight?* (nima) · *Where is the shipper?* (qayerda) · *Who is the broker?* (kim)
  - *When do you need the truck?* (qachon) · *How much is the rate?* (qancha) · *What do you need?*
  - Yes/No: *Do you have a load for me?* · *Is the load ready?*
- **Harakat:** 5 ta Wh-so'z kartasini bosib ma'nosini ochish (*Bosish*).

#### S7 · Traps — "O'zbekchadan o'tib ketadigan xatolar"
- **Ekranda:** 3 juftlik ✗ → ✓:
  - ✗ *The load heavy.* → ✓ *The load is heavy.* (is tushib qolmaydi)
  - ✗ *Where you need to go?* → ✓ *Where do you need to go?* (do kerak)
  - ✗ *Sends the broker the rate.* → ✓ *The broker sends the rate.* (kim birinchi)
- **Harakat:** ko'rish.

#### S8 · Vocabulary — 8 ta so'z
| So'z | Ma'nosi | Misol |
|---|---|---|
| load | yuk | *We have a new load today.* |
| pickup | yukni olish (joyi/vaqti) | *The pickup is at 8 AM.* |
| delivery | yetkazib berish | *The delivery is on Friday.* |
| driver | haydovchi | *The driver calls the broker.* |
| broker | vositachi | *The broker has the rate.* |
| dispatcher | dispatcher (haydovchini yo'naltiruvchi) | *The dispatcher sends the address.* |
| address | manzil | *What is the address?* |
| weight | og'irlik | *The weight is 20,000 pounds.* |

- **Harakat:** karta bosilsa ma'nosi va misoli ochiladi.

#### S9 · Guided check — 3 savol
1. **Qaysi gap to'g'ri?** A *The dispatcher calls the driver.* ✓ · B *Calls the dispatcher the driver.* · C *The dispatcher the driver calls.*
   - Izoh: B da fe'l oldinga chiqib ketgan; C da fe'l oxirida (o'zbekcha tartib).
2. ***___ is the delivery?*** Javob: *In Atlanta.* A Where ✓ · B Who · C How much
   - Izoh: javob joyni bildiradi, shuning uchun qayerda (Where) kerak.
3. ***The weight ___ 38,000 pounds.*** A is ✓ · B have · C needs
   - Izoh: o'lchamni bildirganda *be* ishlatiladi; *have/need* bu yerda ma'no bermaydi.

#### S10 · Build — gap tuzish (3 ta)
1. *sends / The / broker / the / rate* → **The broker sends the rate.**
2. *is / Who / dispatcher / the / ?* → **Who is the dispatcher?**
3. *you / What / do / need / ?* → **What do you need?**
- **Feedback:** noto'g'ri tartibda *"Kim birinchi, fe'l ikkinchi"* qoidasi eslatiladi.

#### S11 · Fix it — xatoni tuzating (3 ta)
1. *Where you need to go?* → A ✓ *Where do you need to go?* · B *Where you do need to go?* · C *Do where you need to go?*
2. *The load heavy.* → A ✓ *The load is heavy.* · B *The load are heavy.* · C *The load be heavy.*
3. *Sends the broker the rate.* → A ✓ *The broker sends the rate.* · B *The broker the rate sends.* · C *Broker the sends rate.*

#### S12 · Role-play — Broker Mike qo'ng'iroq qildi
- **Qadam 1.** Mike: *Hi, I need a truck from Dallas to Atlanta. Do you have one?*
  - A *Yes, I have a truck. What is the weight?* ✓ · B *Yes, a truck I have. Weight what?* · C *Yes. Is weight what?*
  - Izoh: B va C ni Mike tushunadi, lekin tartib buzilgan va u qayta so'raydi. A aniq va professional.
- **Qadam 2.** Mike: *The weight is 38,000 pounds.* Pickup joyini so'rang.
  - A *Where is the shipper?* ✓ · B *Where the shipper is?* · C *The shipper where?*
- **Qadam 3.** Mike: *The shipper is in Dallas.* Narxni so'rang.
  - A *How much is the rate?* ✓ · B *How much the rate is?* · C *The rate how much?*
- **Yakun:** *Siz 3 ta kerakli ma'lumotni oldingiz: weight, shipper, rate.*

#### S13 · Rapid test — 4 savol
1. **To'g'ri gap:** A *We need a new truck.* ✓ · B *We a new truck need.* · C *Need we a new truck.* — Izoh: kim → fe'l → nima.
2. **To'g'ri savol:** A *Where is the driver now?* ✓ · B *Where the driver is now?* · C *Is where the driver now?* — Izoh: Wh-so'zdan keyin *is*, keyin kim.
3. ***The truck ___ ready.*** A are · B is ✓ · C (hech narsa) — Izoh: *truck* birlikda, *is* tushmaydi.
4. **Og'irlikni so'rang:** A *What is the weight?* ✓ · B *Who is the weight?* · C *When is the weight?* — Izoh: nimani so'rayapsiz? Narsani, shuning uchun *What*.

#### S14 · Summary + Say it aloud
- **Phrase bank (6 ta):** *I have a load for you.* · *What is the weight?* · *Where is the shipper?* · *Who is the broker?* · *Do you need the address?* · *How much is the rate?*
- **Say it aloud:** har iborani ovoz chiqarib o'qing, so'ng o'zingizni baholang: *Qiyin / O'rtacha / Oson*. Ovoz yozilmaydi va eshitilmaydi.

---

## M1L02 — Present Simple and Continuous

**Maqsad:** doimiy ish tartibi va hozirgi jarayonni farqlash.
**skillTags:** `present_simple`, `present_continuous`, `do_does`, `stative_verbs`
**Davomiyligi:** ~12 daqiqa

#### S1 · Mission — "Tom hozir qayerda?"
- **Ekranda:** Broker Mike: *Is Tom at the dock?*
- **Savol:** Tom hozir darvoza oldida kutib turibdi. Qaysi javob?
- **Variantlar:** A *He is waiting at the gate now.* ✓ · B *He waits at the gate now.* · C *He waiting at the gate now.*
- **Feedback:** A — "hozir" uchun *is + -ing*. B — *waits* odatni bildiradi, *now* bilan mos emas. C — *-ing* oldida *is* kerak.

#### S2 · Read — Dispatcher va Anna
- **Ekranda (chat):**
  - Dispatcher: *Anna, where are you now?*
  - Anna: *I'm at the scale. I'm waiting for the weight ticket.*
  - Dispatcher: *Do you usually deliver in this area?*
  - Anna: *Yes, I deliver here every week. The receiver opens at 6 AM.*
  - Dispatcher: *Does he close early?*
  - Anna: *No, he closes at 5 PM.*
  - Dispatcher: *Great. Call me when you park.*
- **Tarjima (yashirin):** Anna, hozir qayerdasiz? / Tarozidaman. Tarozi chekini kutyapman. / Odatda shu hududga yetkazasizmi? / Ha, har hafta shu yerga yetkazaman. Qabul qiluvchi 6 da ochiladi. / U erta yopiladimi? / Yo'q, 5 da yopiladi. / Yaxshi. To'xtaganingizda menga qo'ng'iroq qiling.

#### S3 · Notice — "Odat yoki hozir?"
- **Harakat:** 4 gapni guruhlash (*Tanlash*):
  - *I'm waiting for the weight ticket.* → **Hozir**
  - *I deliver here every week.* → **Odat**
  - *He closes at 5 PM.* → **Jadval/fakt**
  - *Does he close early?* → **Savol**
- **Feedback:** *"every week, usually" odatni, "now" hozirgi jarayonni bildiradi.*

#### S4 · Pattern 1 — Present Simple
- **Matn:** *Odat, jadval va faktlar uchun.* I/you/we/they + fe'l; **he/she/it + fe'l-s**: *The receiver **opens** at 6 AM.*
- **Yozilish:** *watch → watches · go → goes · carry → carries* (s, sh, ch, x, o dan keyin *-es*; undosh + y → *-ies*).
- **Vaqt so'zlari:** every day · usually · always · never · on Fridays.
- **Harakat:** *She ___ (check) the gate every day.* → **checks** ✓ · check · is check (*Tanlash*).

#### S5 · Pattern 2 — do / does
- **Ekranda:** *Does he close early?* · *He doesn't close early.* · *Do you work on Sundays?* · *I don't work on Sundays.*
- **Qoida:** *does/doesn't dan keyin fe'l asl holda qoladi (-s yo'q).* ✗ *Does he closes?* ✓ *Does he close?*
- **Harakat:** *Does she ___ at night?* → **work** ✓ · works · working.

#### S6 · Pattern 3 — Present Continuous
- **Matn:** *Hozir bo'layotgan jarayon.* **am/is/are + fe'l-ing**: *I'm waiting. He is unloading. They aren't loading now.*
- **Imlo:** *park → parking · load → loading · stop → stopping (undosh ikkilanadi) · make → making (e tushadi).*
- **Vaqt so'zlari:** now · right now · at the moment · today.
- **Harakat:** *stop → ?* **stopping** ✓ · stoping · stopeing.

#### S7 · Contrast + Traps — Qaysi zamon?
- **Jadval:** Simple: *odat, jadval* (every day, usually). Continuous: *hozir, vaqtinchalik* (now, at the moment).
- **Maxsus fe'llar:** *need, want, know, have (egalik)* da *-ing* ishlatilmaydi: ✗ *I am needing the address.* ✓ *I need the address.*
- **Tuzoqlar:** ✗ *He park the truck every night.* → ✓ *He parks…* · ✗ *Does he works?* → ✓ *Does he work?* · ✗ *She waiting now.* → ✓ *She is waiting now.*

#### S8 · Vocabulary — 8 ta so'z
| So'z | Ma'nosi | Misol |
|---|---|---|
| unload | yukni tushirish | *They unload the trailer at the dock.* |
| check in | ro'yxatdan o'tish (yetib kelganini bildirish) | *Drivers check in at the gate.* |
| wait | kutish | *He is waiting for the receiver.* |
| park | to'xtatib qo'yish | *Please park near door 5.* |
| scale | tarozi | *The truck is on the scale.* |
| dock | yuk ortish/tushirish platformasi | *The trailer is at the dock.* |
| appointment | belgilangan vaqt (navbat) | *We have an appointment at 10 AM.* |
| gate | darvoza | *The guard opens the gate.* |

#### S9 · Guided check — 3 savol
1. ***The driver ___ at the gate right now.*** A waits · B is waiting ✓ · C does wait — Izoh: *right now* → *is + -ing*.
2. ***___ you usually deliver here?*** A Do ✓ · B Are · C Does — Izoh: *you* bilan *do*, odat so'rog'i.
3. ***I ___ the address. Can you send it?*** A need ✓ · B am needing · C needs — Izoh: *need* holat fe'li, *-ing* olmaydi; *I* bilan *-s* yo'q.

#### S10 · Build — gap tuzish (3 ta)
1. *Drivers / check in / at / the gate* → **Drivers check in at the gate.**
2. *Does / the / receiver / open / at / 6 AM / ?* → **Does the receiver open at 6 AM?**
3. *are / We / unloading / the trailer / now* → **We are unloading the trailer now.**

#### S11 · Fix it (3 ta)
1. *He park the truck every night.* → A ✓ *He parks the truck every night.* · B *He parking the truck every night.* · C *He is park the truck every night.*
2. *Does she checks in at 8?* → A ✓ *Does she check in at 8?* · B *Do she check in at 8?* · C *Does she is check in at 8?*
3. *They are wait at the gate.* → A ✓ *They are waiting at the gate.* · B *They wait are at the gate.* · C *They are waits at the gate.*

#### S12 · Role-play — Siz haydovchi Annasiz, dispatcher Mike so'raydi
- **Qadam 1.** Mike: *Where are you now, Anna?*
  - A *I'm at the dock. I'm unloading now.* ✓ · B *I at the dock. I unload now.* · C *I'm at the dock. I unload right now.*
  - Izoh: B da *am* tushib qolgan; C da "hozir" uchun *-ing* kerak.
- **Qadam 2.** Mike: *Do you usually work on Saturdays?*
  - A *No, I don't usually work on Saturdays.* ✓ · B *No, I doesn't usually work on Saturdays.* · C *No, I not usually work Saturdays.*
- **Qadam 3.** Mike: *What time does the receiver close?*
  - A *He closes at 5 PM.* ✓ · B *He close at 5 PM.* · C *He is close at 5 PM.*
  - Izoh: *he* bilan fe'lga *-s*; *is close* — "yaqin" ma'nosini beradi.

#### S13 · Rapid test — 4 savol
1. ***Tom ___ in Dallas every week.*** A delivers ✓ · B deliver · C is delivering — Izoh: *every week* odat, *Tom* = he.
2. ***Where is Anna?*** — *She ___ at the gate now.* A waits · B is waiting ✓ · C wait
3. ***___ he work at night?*** A Do · B Does ✓ · C Is
4. ***I ___ the address.*** A am needing · B needs · C need ✓

#### S14 · Summary + Say it aloud
- **Phrase bank:** *I'm waiting at the gate.* · *The receiver opens at 6 AM.* · *Does he close early?* · *I don't usually work on Saturdays.* · *We are unloading now.* · *I need the address.*
- **Say it aloud:** ovoz chiqarib o'qing, o'zingizni baholang.

---

## M1L03 — Past Simple for Updates

**Maqsad:** bo'lib o'tgan voqeani qisqa va aniq xabar qilish.
**skillTags:** `past_simple_regular`, `past_simple_irregular`, `did_didnt`, `was_were`, `update_structure`
**Davomiyligi:** ~13 daqiqa

#### S1 · Mission — "Yuk topshirildimi?"
- **Ekranda:** Broker Mike: *Did Tom deliver the load?*
- **Savol:** Tom yukni soat 3 da topshirgan. Qaysi javob to'g'ri?
- **Variantlar:** A *Yes, he delivered it at 3 PM.* ✓ · B *Yes, he deliver it at 3 PM.* · C *Yes, he did delivered it at 3 PM.*
- **Feedback:** A — o'tgan voqea uchun fe'lga *-ed*. B — fe'l o'tgan zamonga o'tmagan. C — *did* bilan birga *-ed* ishlatilgan, o'tgan zamon ikki marta belgilangan.

#### S2 · Read — Anna dispatcherga hisobot beradi
- **Ekranda (chat):**
  - Anna: *I delivered the load at 3 PM.*
  - Dispatcher: *Was the receiver ready?*
  - Anna: *No, he wasn't. I waited two hours.*
  - Dispatcher: *Did you get the POD?*
  - Anna: *Yes, I got it and I sent a photo to you.*
  - Dispatcher: *When did you leave?*
  - Anna: *I left at 5 PM. I didn't have any problems on the road.*
- **Tarjima (yashirin):** Yukni soat 3 da yetkazdim. / Qabul qiluvchi tayyor edimi? / Yo'q, tayyor emas edi. Ikki soat kutdim. / POD ni oldingizmi? / Ha, oldim va sizga rasmini yubordim. / Qachon jo'nadingiz? / 5 da jo'nadim. Yo'lda hech qanday muammo bo'lmadi.

#### S3 · Notice — "O'tgan zamon fe'llari"
- **Harakat:** dialogdan 4 ta o'tgan zamon fe'lini tegib toping (*Tanlash*): **delivered, waited** (muntazam, *-ed*) va **got, left** (tartibsiz).
- **Feedback:** *Ba'zi fe'llar -ed olmaydi. Ular alohida shaklga ega: get → got, leave → left.*

#### S4 · Pattern 1 — Muntazam fe'llar (-ed)
- **Qoida:** *fe'l + -ed*: *deliver → delivered · wait → waited.* *e* bilan tugasa *-d*: *arrive → arrived.* Undosh + *y* → *-ied*: *carry → carried.* Qisqa tovush: *stop → stopped.*
- **Harakat:** *arrive → ?* **arrived** ✓ · arriveed · arrivd.

#### S5 · Pattern 2 — Tartibsiz fe'llar
- **Ekranda:** 8 ta karta (bosilsa ochiladi):
  *go → went · get → got · send → sent · leave → left · take → took · have → had · give → gave · come → came*
- **Maslahat:** *Bu 8 ta fe'lni yod oling: logistikada eng ko'p ishlatiladi.*

#### S6 · Pattern 3 — Inkor va savol
- **Inkor:** *didn't + asl fe'l:* *I didn't have problems.* (✗ *didn't had*)
- **Savol:** *Did + kim + asl fe'l:* *Did you get the POD?* Javob: *Yes, I did. / No, I didn't.*
- **was / were:** *I was late. We were ready. He wasn't ready. Were you on time?* (*was/were* uchun *did* kerak emas)

#### S7 · Pattern 4 — Vaqt belgilari va hisobot tuzilmasi
- **Vaqt:** *yesterday · this morning · at 3 PM · two hours ago · last night · on Monday*
- **Hisobot formulasi (3 qadam):** **Nima bo'ldi → Qachon → Natija:** *I arrived at 7 AM. I waited two hours. I delivered at 9 AM.*
- **Harakat:** 3 ta aralash gapni tartiblash: *I delivered at 9 AM. / I arrived at 7 AM. / I waited two hours.* → arrive → wait → deliver (*Tartiblash*).

#### S8 · Traps — Tuzoqlar
- ✗ *I leave at 5 PM yesterday.* → ✓ *I left at 5 PM yesterday.* (*yesterday* = o'tgan zamon)
- ✗ *Did he delivered the load?* → ✓ *Did he deliver the load?* (*did* dan keyin asl fe'l)
- ✗ *We was late.* → ✓ *We were late.* (*we* bilan *were*)

#### S9 · Vocabulary — 8 ta so'z
| So'z | Ma'nosi | Misol |
|---|---|---|
| pick up | yukni olish | *I picked up the load at 6 AM.* |
| deliver | yetkazib berish | *We delivered it on time.* |
| arrive | yetib kelish | *She arrived at noon.* |
| leave | jo'nab ketish | *They left the yard at 4 PM.* |
| on time | o'z vaqtida | *The truck was on time.* |
| late | kech | *The driver was late.* |
| detention | kutish uchun to'lov (kutilgan vaqt uchun) | *We waited three hours, so we asked for detention.* |
| POD | yetkazilganini tasdiqlovchi hujjat | *I sent the POD to the broker.* |

#### S10 · Guided check — 3 savol
1. ***The driver ___ the load yesterday.*** A deliver · B delivered ✓ · C delivering — Izoh: *yesterday* o'tgan zamonni ko'rsatadi.
2. ***___ you get the POD?*** A Did ✓ · B Do · C Were — Izoh: o'tgan zamon savoli *did* bilan boshlanadi.
3. ***I ___ any problems on the road.*** A not had · B didn't had · C didn't have ✓ — Izoh: *didn't* dan keyin asl fe'l.

#### S11 · Build — gap tuzish (3 ta)
1. *waited / We / two hours / at the dock* → **We waited two hours at the dock.**
2. *Did / you / send / the photo / ?* → **Did you send the photo?**
3. *didn't / He / the BOL / get* → **He didn't get the BOL.**

#### S12 · Fix it (3 ta)
1. *She didn't picked up the POD.* → A ✓ *She didn't pick up the POD.* · B *She not pick up the POD.* · C *She didn't picks up the POD.*
2. *Did he sent the photo?* → A ✓ *Did he send the photo?* · B *Does he sent the photo?* · C *Did he sends the photo?*
3. *We was late yesterday.* → A ✓ *We were late yesterday.* · B *We did late yesterday.* · C *We be late yesterday.*

#### S13 · Role-play — Siz Anna, dispatcher so'raydi
- **Qadam 1.** Dispatcher: *Did you arrive on time?*
  - A *Yes, I arrived at 7 AM.* ✓ · B *Yes, I arrive at 7 AM.* · C *Yes, I did arrived at 7 AM.*
- **Qadam 2.** Dispatcher: *What happened at the receiver?*
  - A *I waited two hours. The receiver wasn't ready.* ✓ · B *I wait two hours. The receiver isn't ready.* · C *I waited two hours. The receiver didn't be ready.*
  - Izoh: B da hozirgi zamon, voqea esa o'tgan. C da *be* uchun *did* ishlatilmaydi.
- **Qadam 3.** Dispatcher: *Did you have any problems?*
  - A *No, I didn't have any problems.* ✓ · B *No, I didn't had any problems.* · C *No, I not have any problems.*

#### S14 · Rapid test — 4 savol
1. ***She ___ the load at 9 AM.*** A pick up · B picks up · C picked up ✓ — Izoh: *at 9 AM* tugagan voqea.
2. ***___ he arrive on time?*** A Did ✓ · B Was · C Does
3. ***We ___ late because of traffic.*** A was · B were ✓ · C did
4. ***I ___ the BOL to the broker.*** A send · B sended · C sent ✓ — Izoh: *send* tartibsiz fe'l.

#### S15 · Summary + Say it aloud
- **Phrase bank:** *I delivered the load at 3 PM.* · *I waited two hours.* · *I didn't have any problems.* · *Did you get the POD?* · *I left at 5 PM.* · *The receiver wasn't ready.*
- **Say it aloud:** ovoz chiqarib o'qing, o'zingizni baholang.

---

## M1L04 — Present Perfect for Status Updates

**Maqsad:** hozirgi holatga bog'liq natijani aytish.
**skillTags:** `present_perfect`, `irregular_v3`, `already_yet_just_still`, `perfect_vs_past`
**Davomiyligi:** ~13 daqiqa

#### S1 · Mission — "Haydovchi yetib keldimi?"
- **Ekranda:** Broker Mike: *Has the driver arrived yet?*
- **Savol:** Haydovchi hozirgina yetib keldi. Qaysi javob to'g'ri?
- **Variantlar:** A *Yes, he has just arrived.* ✓ · B *Yes, he arrived just.* · C *Yes, he has just arrive.*
- **Feedback:** A — *has + 3-shakl*: yaqinda bo'lgan va hozir ahamiyatli ish. B — *just* odatda fe'ldan oldin turadi. C — *has* dan keyin fe'lning 3-shakli kerak (*arrived*).

#### S2 · Read — Broker Mike va dispatcher
- **Ekranda (chat):**
  - Mike: *Has the truck arrived at the shipper yet?*
  - Dispatcher: *Yes, it has. The driver has just checked in.*
  - Mike: *Have you sent me the BOL?*
  - Dispatcher: *Not yet. The shipper hasn't signed it yet.*
  - Mike: *Has he loaded the freight already?*
  - Dispatcher: *No, he is still waiting.*
  - Mike: *OK. I have confirmed the rate with the receiver.*
- **Tarjima (yashirin):** Yuk mashinasi shipperga yetib keldimi? / Ha, yetib keldi. Haydovchi hozirgina ro'yxatdan o'tdi. / Menga BOL ni yubordingizmi? / Hali yo'q. Shipper hali imzolamadi. / U yukni allaqachon ortdimi? / Yo'q, hali kutyapti. / Yaxshi. Men qabul qiluvchi bilan narxni tasdiqladim.

#### S3 · Notice — "Hozirgi holat"
- **Harakat:** 5 ta gapdan Present Perfect bo'lgan 3 tasini toping (*Tanlash*): *has just checked in ✓ · hasn't signed ✓ · have confirmed ✓ · is still waiting · opens at 7.*
- **Feedback:** *has/have + fe'lning 3-shakli = Present Perfect.*

#### S4 · Pattern 1 — Shakl va savol
- **Shakl:** **have/has + 3-shakl**. I/you/we/they **have**; he/she/it **has**. Qisqa: *I've, he's.* Inkor: *haven't, hasn't.*
- **Muntazam fe'l:** 3-shakl = *-ed*: *arrived, confirmed.* Misol: *We have confirmed the rate.*
- **Savol:** *Have you sent the BOL?* → *Yes, I have. / No, I haven't.* · *Has he left?* → *Yes, he has. / No, he hasn't.*

#### S5 · Pattern 2 — Tartibsiz fe'llar (3-shakl)
- **Ekranda (bosilsa ochiladi):** *send → sent → **sent** · take → took → **taken** · give → gave → **given** · be → was/were → **been** · do → did → **done** · leave → left → **left***
- **Maslahat:** *Diqqat: take, give, be, do da 2- va 3-shakl farq qiladi.*

#### S6 · Pattern 3 — already, yet, just, still
- **Juftlash (4 ta):**
  - **already** — allaqachon: *I've already sent it.*
  - **yet** — hali (savol/inkorda, oxirida): *Has he arrived yet? He hasn't arrived yet.*
  - **just** — hozirgina: *He has just left.*
  - **still** — hali ham tugamagan: *He still hasn't signed.*
- **Harakat:** so'z ↔ ma'no juftlash (*Juftlash*).

#### S7 · Pattern 4 — Present Perfect yoki Past Simple?
- **Qoida:** **aniq vaqt bor** (*at 9 AM, yesterday*) → **Past Simple**: *I sent it at 9 AM.* **Vaqt aytilmagan, hozirga bog'liq** → **Present Perfect**: *I've sent it.*
- **Harakat:** *I ___ the BOL at 9 AM.* → **sent** ✓ · have sent. *Mike, I ___ the BOL.* → **have sent** ✓ · sent (*Tanlash*).

#### S8 · Traps — Tuzoqlar
- ✗ *He has arrived at 7 AM.* → ✓ *He arrived at 7 AM.* (aniq vaqt bor)
- ✗ *Have you confirm the rate?* → ✓ *Have you confirmed the rate?* (3-shakl)
- ✗ *The driver has not arrive yet.* → ✓ *The driver has not arrived yet.*
- ✗ *I have took the BOL.* → ✓ *I have taken the BOL.*

#### S9 · Vocabulary — 8 ta so'z
| So'z | Ma'nosi | Misol |
|---|---|---|
| confirm | tasdiqlash | *Please confirm the pickup time.* |
| send | yuborish | *I sent the BOL to you.* |
| receive | qabul qilib olish | *We received the rate.* |
| assign | tayinlash | *Dispatch assigned a new driver.* |
| empty | bo'sh | *The trailer is empty.* |
| loaded | yuklangan | *The truck is loaded.* |
| in transit | yo'lda (tashilmoqda) | *The freight is in transit.* |
| status | holat | *What is the status?* |

#### S10 · Guided check — 3 savol
1. ***We ___ the rate with the broker.*** A have confirm · B has confirmed · C have confirmed ✓ — Izoh: *we* bilan *have*, keyin 3-shakl.
2. ***Has the truck left ___ ?*** A yet ✓ · B already · C just — Izoh: savolda oxirida *yet* ishlatiladi.
3. ***The driver ___ at 7 AM.*** A has arrived · B arrived ✓ · C arrives — Izoh: *at 7 AM* aniq vaqt, shuning uchun Past Simple.

#### S11 · Build — gap tuzish (3 ta)
1. *has / The / driver / just / checked in* → **The driver has just checked in.**
2. *you / Have / received / the / rate confirmation / ?* → **Have you received the rate confirmation?**
3. *hasn't / The shipper / signed / the BOL / yet* → **The shipper hasn't signed the BOL yet.**

#### S12 · Fix it (3 ta)
1. *He has arrived at 7 AM.* → A ✓ *He arrived at 7 AM.* · B *He has arrive at 7 AM.* · C *He is arrived at 7 AM.*
2. *Have you confirm the rate?* → A ✓ *Have you confirmed the rate?* · B *Has you confirmed the rate?* · C *Did you confirmed the rate?*
3. *The driver has not leave yet.* → A ✓ *The driver has not left yet.* · B *The driver have not left yet.* · C *The driver has not leaved yet.*

#### S13 · Role-play — Siz dispatchersiz, Mike so'raydi
- **Qadam 1.** Mike: *Has the driver loaded yet?*
  - A *Yes, he has just finished loading.* ✓ · B *Yes, he have just finished loading.* · C *Yes, he has just finish loading.*
- **Qadam 2.** Mike: *Have you sent me the BOL?*
  - A *Not yet. The shipper hasn't signed it yet.* ✓ · B *No, I not sent yet.* · C *Not yet. The shipper didn't signed it.*
- **Qadam 3.** Mike: *When did he check in?*
  - A *He checked in at 7 AM.* ✓ · B *He has checked in at 7 AM.* · C *He has checked in yesterday.*
  - Izoh: *"qachon" aniq vaqtni so'raydi, shuning uchun Past Simple.*

#### S14 · Rapid test — 4 savol
1. ***She ___ the BOL already.*** A have sent · B has sent ✓ · C is sent
2. ***Have they arrived ___ ?*** A just · B still · C yet ✓
3. ***The driver ___ not signed the POD yet.*** A have · B has ✓ · C did
4. **To'g'ri gap:** A *I have confirmed the rate at 2 PM.* · B *I confirmed the rate at 2 PM.* ✓ · C *I am confirm the rate at 2 PM.* — Izoh: aniq vaqt (*at 2 PM*) = Past Simple.

#### S15 · Summary + Say it aloud
- **Phrase bank:** *Has the driver arrived yet?* · *He has just checked in.* · *I've already sent the BOL.* · *The shipper hasn't signed it yet.* · *We have confirmed the rate.* · *The freight is still in transit.*
- **Say it aloud:** ovoz chiqarib o'qing, o'zingizni baholang.

---

## M1L05 — Future: will, going to, arrangements

**Maqsad:** reja, va'da va kelishuvni to'g'ri ifodalash.
**skillTags:** `will_promise`, `going_to_plan`, `present_continuous_future`, `when_clause_present`
**Davomiyligi:** ~13 daqiqa

#### S1 · Mission — "Hujjatlar bugun kerak"
- **Ekranda:** Broker Mike: *Our receiver needs the paperwork today. Can you send it?*
- **Savol:** Siz hozir qaror qildingiz. Qaysi javob to'g'ri?
- **Variantlar:** A *Sure, I'll send it in five minutes.* ✓ · B *Sure, I send it in five minutes.* · C *Sure, I sending it in five minutes.*
- **Feedback:** A — hozir qabul qilingan qaror va va'da uchun *will*. B — *send* odatni bildiradi. C — *-ing* oldida *am* kerak va bu holatga baribir mos emas.

#### S2 · Read — Dispatcher va Omar
- **Ekranda (chat):**
  - Dispatcher: *Omar, what's your plan for tomorrow?*
  - Omar: *I'm picking up at 8 AM. The appointment is confirmed.*
  - Dispatcher: *Will you make it on time?*
  - Omar: *Yes. I'm going to leave at 5 AM, so I will arrive early.*
  - Dispatcher: *Good. The weather is bad. It's going to rain.*
  - Omar: *No problem. I'll call you when I get there.*
- **Tarjima (yashirin):** Omar, ertangi rejangiz qanday? / Soat 8 da yukni olaman. Vaqt tasdiqlangan. / O'z vaqtida yetib olasizmi? / Ha. Soat 5 da jo'nashni rejalashtirganman, shuning uchun erta yetaman. / Yaxshi. Ob-havo yomon. Yomg'ir yog'adi. / Muammo yo'q. U yerga borganimda qo'ng'iroq qilaman.

#### S3 · Notice — "Uch xil kelajak"
- **Harakat:** gapni vazifasiga qarab guruhlash (*Tanlash*):
  - *I'll call you when I get there.* → **Va'da / hozirgi qaror**
  - *I'm going to leave at 5 AM.* → **Reja (niyat)**
  - *I'm picking up at 8 AM.* → **Kelishilgan (vaqti belgilangan)**
- **Feedback:** *Uchala shakl kelajakni bildiradi, lekin ma'nosi boshqa-boshqa.*

#### S4 · Pattern 1 — will (va'da, hozirgi qaror)
- **Shakl:** **will + asl fe'l**: *I'll call you back. He won't be late.* (*won't* = will not)
- **Qachon:** hozir qaror qilganda, va'da va taklif: *I'll send it now.*
- **Eslatma:** *will* dan keyin fe'lga *-s* va *to* kerak emas.

#### S5 · Pattern 2 — going to (reja, ko'rinib turgan dalil)
- **Shakl:** **am/is/are + going to + asl fe'l**: *We're going to deliver on Friday.*
- **Qachon:** (1) oldindan rejalashtirilgan ish. (2) ko'rinib turgan dalil bo'yicha bashorat: *Look at the sky. It's going to rain.*

#### S6 · Pattern 3 — Uch ma'no taqqoslash va Present Continuous
- **Jadval (bitta jumla, uch ma'no):**
  - *I'll deliver tomorrow.* → hozir qaror qildim
  - *I'm going to deliver tomorrow.* → oldindan rejam bor
  - *I'm delivering tomorrow at 9.* → vaqti **kelishilgan**
- **Qoida:** *kelishilgan ish* (appointment) uchun Present Continuous: *am/is/are + -ing.*

#### S7 · Pattern 4 — Vaqt belgilari va "when" dan keyin
- **Vaqt:** *tomorrow · next week · in an hour · by 5 PM · at 8 AM on Friday*
- **Muhim qoida:** *when, as soon as, before, after* dan keyin **will ishlatilmaydi**: ✓ *I'll call you when I arrive.* ✗ *…when I will arrive.*
- **Harakat:** *I'll call you when I ___.* → **arrive** ✓ · will arrive (*Tanlash*).

#### S8 · Traps — Tuzoqlar
- ✗ *He will arrives at 8.* → ✓ *He will arrive at 8.* (*will* dan keyin asl fe'l)
- ✗ *I'll call you when I will arrive.* → ✓ *…when I arrive.*
- ✗ *We are go to deliver on Friday.* → ✓ *We are going to deliver on Friday.*
- ✗ *I will be not late.* → ✓ *I won't be late.*

#### S9 · Vocabulary — 8 ta so'z
| So'z | Ma'nosi | Misol |
|---|---|---|
| ETA | taxminiy yetib borish vaqti | *What is your ETA?* |
| schedule | jadval; jadvalga qo'yish | *The pickup is scheduled for 8 AM.* |
| reschedule | boshqa vaqtga ko'chirish | *Can we reschedule the delivery?* |
| confirm | tasdiqlash | *Please confirm the time.* |
| time window | vaqt oralig'i | *The window is 8 to 10 AM.* |
| on time | o'z vaqtida | *We will be on time.* |
| running late | kechikib ketyapti | *We are running late.* |
| cancel | bekor qilish | *The broker canceled the load.* |

#### S10 · Guided check — 3 savol
1. ***Don't worry. I ___ send the BOL right now.*** A will ✓ · B going · C am send — Izoh: hozir qilingan va'da, *will* + asl fe'l.
2. ***Look at the traffic! We ___ be late.*** A are going to ✓ · B are going · C will to — Izoh: ko'rinib turgan dalil bo'yicha bashorat, *going to*.
3. ***I'll call you when I ___ there.*** A will get · B get ✓ · C am getting — Izoh: *when* dan keyin hozirgi zamon.

#### S11 · Build — gap tuzish (3 ta)
1. *will / I / the rate con / send / in five minutes* → **I will send the rate con in five minutes.**
2. *is / It / to / going / rain* → **It is going to rain.**
3. *picking up / We / at 8 AM / are / tomorrow* → **We are picking up at 8 AM tomorrow.**

#### S12 · Fix it (3 ta)
1. *He will arrives at 8.* → A ✓ *He will arrive at 8.* · B *He will to arrive at 8.* · C *He wills arrive at 8.*
2. *I'll call you when I will arrive.* → A ✓ *I'll call you when I arrive.* · B *I'll call you when I arriving.* · C *I call you when I will arrive.*
3. *We are go to deliver on Friday.* → A ✓ *We are going to deliver on Friday.* · B *We going deliver on Friday.* · C *We go to deliver on Friday.*

#### S13 · Role-play — Siz dispatchersiz, shipper pickupni o'zgartirmoqchi
- **Qadam 1.** Shipper: *Can the driver come at 10 instead of 8?*
  - A *Let me check. I'll call you back in ten minutes.* ✓ · B *Let me check. I call you back in ten minutes.* · C *Let me check. I'm will call you back.*
- **Qadam 2.** Shipper: *What time will he arrive?*
  - A *He's going to leave at 7, so he'll be there by 10.* ✓ · B *He will to leave at 7.* · C *He leaves at 7 and will arrives by 10.*
- **Qadam 3.** Shipper: *Please confirm the new appointment.*
  - A *Confirmed. We're picking up at 10 AM tomorrow.* ✓ · B *Confirmed. We will picking up at 10 tomorrow.* · C *Confirmed. We pick up at 10 tomorrow will.*

#### S14 · Rapid test — 4 savol
1. ***The BOL is missing.*** — *I ___ call the shipper now.* A going · B will ✓ · C am call
2. ***Look at those clouds! It ___ rain.*** A will · B is going to ✓ · C rains
3. ***I'll call you when I ___ .*** A will arrive · B arrive ✓ · C arriving
4. ***He ___ at 8 AM tomorrow. The appointment is confirmed.*** A is picking up ✓ · B will picks up · C pick up

#### S15 · Summary + Say it aloud
- **Phrase bank:** *I'll call you back in ten minutes.* · *We're going to deliver on Friday.* · *I'm picking up at 8 AM tomorrow.* · *It's going to rain.* · *I'll call you when I arrive.* · *What is your ETA?*
- **Say it aloud:** ovoz chiqarib o'qing, o'zingizni baholang.

---

## M1L06 — Modals and Polite Requests

**Maqsad:** talabni muloyim va aniq bildirish.
**skillTags:** `polite_requests`, `can_could_would`, `obligation_advice`, `modal_base_form`
**Davomiyligi:** ~13 daqiqa

#### S1 · Mission — "Rate con kerak"
- **Ekranda:** Siz notanish brokerdan rate confirmation ni qayta so'ramoqchisiz.
- **Savol:** Qaysi gap eng yaxshi?
- **Variantlar:** A *Send me the rate con now.* · B *Could you send me the rate confirmation, please?* ✓ · C *You must send me the rate con.*
- **Feedback:** A — buyruq ohangi, broker xafa bo'lishi mumkin. C — *must* majburlaydi, broker sizga bo'ysunmaydi. B — muloyim so'rov.

#### S2 · Read — Dispatcher va shipper vakili (telefon)
- **Ekranda (transkript):**
  - Dispatcher: *Good morning. Could I speak to Linda, please?*
  - Rep: *She's on another call. Can you hold on?*
  - Dispatcher: *Yes, of course.*
  - Rep: *Thanks. What can I do for you?*
  - Dispatcher: *Could you send the BOL to my email? It's urgent.*
  - Rep: *I can send it in 10 minutes. You should check your spam folder too.*
  - Dispatcher: *Thank you. I would appreciate that.*
- **Tarjima (yashirin):** Xayrli tong. Linda bilan gaplasha olamanmi? / U boshqa qo'ng'iroqda. Kuta olasizmi? / Ha, albatta. / Rahmat. Sizga qanday yordam bera olaman? / BOL ni email'imga yubora olasizmi? Bu shoshilinch. / 10 daqiqada yubora olaman. Spam papkasini ham tekshirishingiz kerak. / Rahmat. Minnatdor bo'laman.

#### S3 · Notice — "Modal fe'llar nima qiladi?"
- **Harakat:** gapni vazifasiga qarab guruhlash (*Tanlash*):
  - *Could you send the BOL?* → **So'rov**
  - *Could I speak to Linda?* → **Ruxsat so'rash**
  - *You should check your spam folder.* → **Maslahat**
  - *I can send it in 10 minutes.* → **Imkoniyat**

#### S4 · Pattern 1 — So'rov zinapoyasi
- **Ekranda (pastdan yuqoriga muloyimroq):**
  1. *Send it!* (buyruq)
  2. *Can you send it?* (oddiy)
  3. *Could you send it, please?* (muloyim)
  4. *Would you mind sending it?* (juda muloyim; *mind* dan keyin *-ing*)
- **Maslahat:** *notanish odam va mijoz bilan 3–4 pog'onani ishlating.*

#### S5 · Pattern 2 — Ruxsat va taklif
- **Ekranda:** *Can I help you?* · *Could I speak to the manager?* · *Can I take a message?* · *I would like to confirm the pickup.* (*I want* o'rniga *I would like*)

#### S6 · Pattern 3 — Majburiyat va maslahat
- **Jadval:**
  - **must** — qoida, kuchli majburiyat: *Drivers must wear a vest.*
  - **have to / need to** — tashqi talab: *You have to check in at the gate.*
  - **should** — maslahat: *You should call the broker.*
  - **don't have to** — shart emas: *You don't have to unload.*
  - **mustn't** — taqiqlangan: *You mustn't park here.*
- **Muhim:** *don't have to* va *mustn't* ma'nosi **butunlay boshqa**.

#### S7 · Traps — Tuzoqlar
- ✗ *He can sends the BOL.* → ✓ *He can send the BOL.* (modaldan keyin asl fe'l)
- ✗ *Could you to repeat?* → ✓ *Could you repeat?* (*to* yo'q)
- ✗ *Do you can hold on?* → ✓ *Can you hold on?* (modal savolda oldinga chiqadi)
- ✗ *She should to call.* → ✓ *She should call.*

#### S8 · Polite replies — Muloyim javob va rad etish
- **Rozilik:** *Sure. · Of course. · No problem.*
- **Vaqt olish:** *Let me check.*
- **Rad etish:** *I'm afraid I can't…, but I can…* (rad + muqobil)
- **Harakat:** *Can you deliver tonight?* — eng muloyim javobni tanlang: A *No.* · B *I'm afraid I can't, but I can deliver at 8 AM tomorrow.* ✓ · C *Impossible.*
- **Feedback:** *rad etganda muqobil taklif qiling.*

#### S9 · Vocabulary — 8 ta so'z
| So'z | Ma'nosi | Misol |
|---|---|---|
| hold on | kutib turish (telefonda) | *Can you hold on, please?* |
| forward | boshqaga yo'naltirish | *Could you forward the email?* |
| resend | qayta yuborish | *Please resend the BOL.* |
| double-check | ikki marta tekshirish | *Let me double-check the address.* |
| repeat | takrorlash | *Could you repeat that?* |
| spell | harflab aytish | *How do you spell the street?* |
| available | band emas, mavjud | *He isn't available right now.* |
| urgent | shoshilinch | *It's urgent: the receiver closes soon.* |

#### S10 · Guided check — 3 savol
1. **Eng muloyim so'rov:** A *Send the BOL.* · B *Can you send the BOL?* · C *Would you mind sending the BOL?* ✓ — Izoh: *Would you mind* eng muloyim, undan keyin *-ing*.
2. ***You ___ park here. It's not allowed.*** A don't have to · B mustn't ✓ · C should — Izoh: taqiq = *mustn't*.
3. ***You ___ check in at the gate. It's the rule.*** A have to ✓ · B can · C might — Izoh: qoida = majburiyat.

#### S11 · Build — gap tuzish (3 ta)
1. *you / Could / forward / the email / ?* → **Could you forward the email?**
2. *should / You / double-check / the address* → **You should double-check the address.**
3. *mind / Would / you / resending / it / ?* → **Would you mind resending it?**

#### S12 · Fix it (3 ta)
1. *Could you to repeat that?* → A ✓ *Could you repeat that?* · B *Could you repeating that?* · C *Do you could repeat that?*
2. *He can sends the BOL.* → A ✓ *He can send the BOL.* · B *He cans send the BOL.* · C *He can to send the BOL.*
3. *Do you can hold on?* → A ✓ *Can you hold on?* · B *You can hold on?* · C *Are you can hold on?*

#### S13 · Role-play — Siz omborga qo'ng'iroq qilyapsiz
- **Qadam 1.** Receptionist: *Good morning, Alpha Warehouse.*
  - A *Good morning. Could I speak to the dock manager, please?* ✓ · B *Dock manager give me.* · C *I want the dock manager now.*
- **Qadam 2.** Receptionist: *He's not available. Can I take a message?*
  - A *Yes, please. Could you ask him to call me back?* ✓ · B *Yes. You must call me back.* · C *No. Hold on him.*
- **Qadam 3.** Receptionist: *He should be back at 2 PM. Do you have to deliver today?*
  - A *Yes, we have to deliver by 4 PM. Could he call before 2:30?* ✓ · B *Yes, we must to deliver by 4.* · C *Yes. He call before 2:30!*

#### S14 · Rapid test — 4 savol
1. ***___ you hold on, please?*** A Do · B Could ✓ · C Are
2. ***You ___ call the broker before you leave.*** (maslahat) A should ✓ · B mustn't · C might
3. ***We ___ park here. It's forbidden.*** A mustn't ✓ · B don't have to · C can
4. ***He can ___ the BOL.*** A sends · B send ✓ · C to send

#### S15 · Summary + Say it aloud
- **Phrase bank:** *Could you send the BOL, please?* · *Can you hold on?* · *Would you mind resending it?* · *I'm afraid I can't, but I can…* · *You should double-check the address.* · *We have to deliver by 4 PM.*
- **Say it aloud:** ovoz chiqarib o'qing, o'zingizni baholang.

---

## M1L07 — First Conditional for Negotiation

**Maqsad:** shart va natija qolipi bilan muzokaraga tayyorlanish.
**skillTags:** `first_conditional`, `unless`, `as_long_as`, `negotiation_formulas`
**Davomiyligi:** ~13 daqiqa

#### S1 · Mission — "Narx past"
- **Ekranda:** Broker Mike: *I can only do $2,300 for this load.* Siz $2,600 xohlaysiz.
- **Savol:** Qaysi javob to'g'ri va ishonchli?
- **Variantlar:** A *If you can do $2,600, I'll book it today.* ✓ · B *If you will do $2,600, I book it.* · C *You do $2,600, I book.*
- **Feedback:** A — *If + hozirgi zamon, will + fe'l.* B — *if* dan keyin *will* ishlatilmaydi, natija qismida esa *will* kerak. C — shart so'zi (*if*) yo'q, gap shart emas buyruqqa o'xshab ketdi.

#### S2 · Read — Narx muzokarasi
- **Ekranda (chat):**
  - Broker: *My rate is $2,300 for this load.*
  - Dispatcher: *That's low for 900 miles. If you can do $2,600, I'll book it.*
  - Broker: *If I pay $2,600, the driver must pick up today.*
  - Dispatcher: *He can pick up today if the shipper opens at 6.*
  - Broker: *OK. I can do $2,500 if he delivers by Friday.*
  - Dispatcher: *Unless there is heavy traffic, he will deliver on Thursday.*
- **Tarjima (yashirin):** Bu yuk uchun narxim 2 300 dollar. / 900 mil uchun bu kam. Agar 2 600 bera olsangiz, yukni band qilaman. / 2 600 to'lasam, haydovchi bugun yukni olishi kerak. / Shipper 6 da ochilsa, u bugun yuk ola oladi. / Yaxshi. Juma kuniga qadar yetkazsa, 2 500 bera olaman. / Kuchli tirbandlik bo'lmasa, u payshanba kuni yetkazadi.

#### S3 · Notice — "Shart va natija"
- **Harakat:** *If you can do $2,600, I'll book it.* gapida shart qismini tegib toping (*Tanlash*): **If you can do $2,600** ✓ (shart) · *I'll book it* (natija).
- **Feedback:** *Shart qismida hozirgi zamon (can do), natija qismida will/can + fe'l.*

#### S4 · Pattern 1 — If + hozirgi zamon, will + fe'l
- **Ekranda:** ikki yarim: **[If + hozirgi zamon]** + **[will / can + asl fe'l]**
  - *If you pay more, I will take it.*
  - *If the shipper opens at 6, he can load today.*
- **Qachon:** *real, bo'lishi mumkin bo'lgan kelajak shartlari.*

#### S5 · Pattern 2 — Tartib, vergul va inkor
- **Tartibni almashtirish:** *If you pay more, I will take it.* = *I will take it if you pay more.* (**If** boshida bo'lsa vergul bor; oxirida bo'lsa yo'q)
- **Inkor:** *If he doesn't arrive, we will reschedule.*
- **Natijada modal:** *If it rains, we should wait.* · *If you add $100, I can book it.*

#### S6 · Pattern 3 — unless va as long as
- **unless = if … not:** *I can't book it unless the rate goes up.* (rate o'smasa, band qila olmayman)
- **as long as = faqat shu shart bilan:** *I'll book it as long as the driver delivers by Friday.*
- **Eslatma:** *unless* o'zi inkor, shuning uchun uning ichida yana *not* ishlatilmaydi.

#### S7 · Pattern 4 — Muzokara formulalari
- **Ekranda (Module 4 ga tayyorgarlik):**
  - *If you can do $X, I can book it.*
  - *If you add $X, I'll take it.*
  - *I can do $X if the pickup is today.*
  - *I can't do $X unless …*
- **Maslahat:** *narxni oshirish uchun "shart + natija" ishlating: shart kuchsiz tomonni ham foydali qiladi.*

#### S8 · Traps — Tuzoqlar
- ✗ *If it will rain, we will reschedule.* → ✓ *If it rains, we will reschedule.* (*if* dan keyin *will* yo'q)
- ✗ *I will book it if you will add $100.* → ✓ *…if you add $100.*
- ✗ *Unless you don't pay, I won't go.* → ✓ *Unless you pay, I won't go.* (ikki inkor bo'lmaydi)
- ✗ *If the broker agrees, I will to book it.* → ✓ *…I will book it.*

#### S9 · Vocabulary — 8 ta so'z
| So'z | Ma'nosi | Misol |
|---|---|---|
| rate | yuk uchun narx | *What is the rate for this load?* |
| per mile | har bir mil uchun | *The rate is $2.80 per mile.* |
| flat rate | qat'iy narx (masofaga bog'liq emas) | *It's a flat rate of $1,800.* |
| deadhead | yukga yetguncha yuksiz yurilgan masofa | *The truck has 120 miles of deadhead.* |
| fuel surcharge | yoqilg'i uchun qo'shimcha to'lov | *The fuel surcharge is $150.* |
| lumper | yuk tushiruvchi (yoki uning to'lovi) | *The lumper fee is $120.* |
| accessorial | qo'shimcha xizmat to'lovi | *Accessorial charges are in the rate con.* |
| book | yukni band qilish | *I can book it today.* |

#### S10 · Guided check — 3 savol
1. ***If the driver ___ late, we will call you.*** A arrives ✓ · B will arrive · C arriving — Izoh: *if* dan keyin hozirgi zamon.
2. ***I'll take the load ___ the driver delivers by Friday.*** A as long as ✓ · B unless · C until — Izoh: *unless* ma'noni teskari qiladi (yetkazmasa olaman bo'lib qoladi).
3. ***If you add $100, I ___ book it.*** A will ✓ · B am · C adding — Izoh: natija qismida *will + fe'l*.

#### S11 · Build — gap tuzish (3 ta)
1. *If / the rate / goes up / I / will / book it* → **If the rate goes up, I will book it.**
2. *I / can / do / $2,500 / if / he / delivers / by / Friday* → **I can do $2,500 if he delivers by Friday.**
3. *won't / We / unless / pick up / you / the rate / increase* → **We won't pick up unless you increase the rate.**

#### S12 · Fix it (3 ta)
1. *If it will rain, we will reschedule.* → A ✓ *If it rains, we will reschedule.* · B *If it rain, we will reschedule.* · C *If it will rains, we reschedule.*
2. *I will book it if you will add $100.* → A ✓ *I will book it if you add $100.* · B *I book it if you will add $100.* · C *I will book it if you adding $100.*
3. *Unless you don't pay, I won't go.* → A ✓ *Unless you pay, I won't go.* · B *Unless you not pay, I won't go.* · C *If you don't pay, I will not to go.*

#### S13 · Role-play — Siz dispatchersiz, 3 raund muzokara
- **Raund 1.** Broker: *I can only do $2,400.*
  - A *That's low. If you can do $2,700, I'll book it.* ✓ · B *That's low. If you will do $2,700, I book it.* · C *That's low. You do $2,700, I will.*
- **Raund 2.** Broker: *$2,700 is too high. What about $2,550?*
  - A *If you add the fuel surcharge, I'll take it.* ✓ · B *If you will add fuel, I take.* · C *Unless you add the fuel surcharge, I take it.*
  - Izoh: C da *unless* ma'noni teskari qildi: "fuel qo'shmasangiz, olaman".
- **Raund 3.** Broker: *OK, $2,550 plus fuel. Can the driver pick up today?*
  - A *Yes, he can pick up today if the shipper opens by 6.* ✓ · B *Yes, he can pick up today if the shipper will open by 6.* · C *Yes, he pick up today unless shipper opens.*
- **Yakun:** *Siz shart bilan narxni ko'tardingiz va kelishuvga erishdingiz.*

#### S14 · Rapid test — 4 savol
1. ***If the broker ___ the rate, the driver will accept.*** A increases ✓ · B will increase · C increasing
2. ***I won't take it ___ you add $100.*** A if · B unless ✓ · C when
3. ***If he doesn't arrive, we ___ reschedule.*** A will ✓ · B are · C did
4. **To'g'ri gap:** A *If you will add $100, I take it.* · B *If you add $100, I will take it.* ✓ · C *If you adding $100, I will take it.*

#### S15 · Summary + Say it aloud
- **Phrase bank:** *If you can do $2,600, I'll book it.* · *I can do $2,500 if he delivers by Friday.* · *I won't take it unless you add the fuel surcharge.* · *If it rains, we will reschedule.* · *The rate is $2.80 per mile.* · *Is that a flat rate?*
- **Say it aloud:** ovoz chiqarib o'qing, o'zingizni baholang.

---

## M1L08 — Core Logistics Vocabulary + Checkpoint 1

**Maqsad:** 40 ta asosiy atamani mustahkamlash va Module 1 ni yopish.
**skillTags:** `core_vocab`, `equipment`, `documents`, `people`, `money_terms`, `places`, `checkpoint_1`
**Davomiyligi:** ~15 daqiqa
**Checkpoint:** 8 ta savol, o'tish chegarasi **70%** (kamida 6 ta to'g'ri).

#### S1 · Mission — "Reefer nima?"
- **Ekranda:** Broker Mike: *Do you have a reefer? It's frozen chicken.*
- **Savol:** Siz atamani bilmaysiz. *Reefer* nima?
- **Variantlar:** A Muzlatgichli treyler ✓ · B Ochiq platforma · C Tarozi cheki
- **Feedback:** A — *reefer = refrigerated trailer*. B — bu *flatbed*. C — bu *weight ticket*. *Bitta atamani bilmaslik savdoni yo'qotishga olib keladi.*

#### S2 · Map — "40 ta atama, 5 guruh"
- **Ekranda:** 5 ta kartochka: **Equipment · Documents · People · Money · Places** (har birida 8 ta atama).
- **Harakat:** ko'rish.

#### S3 · Equipment — jihozlar (8)
| So'z | Ma'nosi | Misol |
|---|---|---|
| dry van | yopiq oddiy treyler | *I have a 53-foot dry van.* |
| reefer | muzlatgichli treyler | *We need a reefer for frozen food.* |
| flatbed | ochiq platforma | *Steel goes on a flatbed.* |
| trailer | treyler | *The trailer is at the dock.* |
| tractor | tyagach (kabinali bosh qism) | *The tractor needs fuel.* |
| pallet | poddon | *There are 24 pallets.* |
| container | konteyner | *The container is at the port.* |
| step deck | pasaytirilgan ochiq platforma | *Tall freight goes on a step deck.* |

#### S4 · Documents — hujjatlar (8)
| So'z | Ma'nosi | Misol |
|---|---|---|
| BOL (bill of lading) | yuk yo'l hujjati | *The driver signs the BOL.* |
| rate confirmation | narx va shartlar tasdig'i | *Please send the rate confirmation.* |
| POD (proof of delivery) | yetkazilganini tasdiqlovchi hujjat | *Send me the POD today.* |
| invoice | hisob-faktura | *I'll send the invoice tomorrow.* |
| COI (certificate of insurance) | sug'urta sertifikati | *The broker needs our COI.* |
| carrier packet | tashuvchi hujjatlari to'plami | *Please fill out the carrier packet.* |
| weight ticket | tarozi cheki | *Here is the weight ticket.* |
| lumper receipt | yuk tushirish to'lovi kvitansiyasi | *Keep the lumper receipt.* |

#### S5 · People — odamlar (8)
| So'z | Ma'nosi | Misol |
|---|---|---|
| shipper | yukni jo'natuvchi | *The shipper loads at 7 AM.* |
| receiver | yukni qabul qiluvchi | *The receiver closes at 5 PM.* |
| carrier | tashuvchi kompaniya | *Our carrier has a new truck.* |
| broker | vositachi | *The broker sends the rate.* |
| dispatcher | haydovchini yo'naltiruvchi | *The dispatcher calls the driver.* |
| driver | haydovchi | *The driver is at the gate.* |
| owner-operator | o'z mashinasi bor mustaqil haydovchi | *He is an owner-operator.* |
| customer | mijoz | *The customer needs it Friday.* |

#### S6 · Money — pul atamalari (8)
| So'z | Ma'nosi | Misol |
|---|---|---|
| rate | yuk uchun narx | *The rate is $2,500.* |
| detention | kutish uchun to'lov | *We waited four hours, so we need detention.* |
| TONU (truck order not used) | yuk bekor bo'lganda haydovchiga to'lov | *The load was canceled, so we ask for TONU.* |
| lumper fee | yuk tushirish to'lovi | *The receiver charged a lumper fee.* |
| fuel surcharge | yoqilg'i qo'shimchasi | *The fuel surcharge is $150.* |
| layover | tunab qolish uchun to'lov | *We stayed overnight, so we need layover.* |
| accessorial | qo'shimcha xizmat to'lovi | *Accessorial charges are listed.* |
| payment terms | to'lov shartlari | *The payment terms are Net 30.* |

#### S7 · Places — joylar (8)
| So'z | Ma'nosi | Misol |
|---|---|---|
| dock | yuk ortish/tushirish platformasi | *Back up to the dock.* |
| yard | mashinalar to'xtaydigan maydon | *The trailer is in the yard.* |
| warehouse | ombor | *The warehouse opens at 6.* |
| terminal | terminal | *Drop the trailer at the terminal.* |
| gate | darvoza | *Check in at the gate.* |
| scale | tarozi | *Go to the scale first.* |
| door | eshik (dock raqami) | *Report to door 12.* |
| rest area | dam olish joyi | *I'm at the rest area.* |

#### S8 · Sort — 12 atamani guruhlang
- **Harakat:** 12 ta atamani 4 guruhga ajrating (*Tanlash*): *reefer, flatbed, tractor* → **Equipment** · *BOL, POD, invoice* → **Documents** · *detention, TONU, lumper fee* → **Money** · *broker, carrier, shipper* → **People**.
- **Feedback:** xato guruhga qo'yilsa: *"Bu hujjat emas, to'lov. Detention — kutish uchun pul."* kabi aniq izoh.

#### S9 · Guided check — 3 savol
1. **Kelishilgan narx va shartlar qaysi hujjatda?** A BOL · B rate confirmation ✓ · C POD — Izoh: BOL yukni, POD yetkazilganini tasdiqlaydi; narx va shartlar rate con da.
2. **Yukni kim jo'natadi?** A shipper ✓ · B receiver · C carrier — Izoh: *shipper* jo'natadi, *receiver* qabul qiladi, *carrier* tashiydi.
3. **Siz dockda 3 soat kutdingiz. Nima so'rashingiz mumkin?** A TONU · B detention ✓ · C lumper fee — Izoh: kutish uchun to'lov = *detention*.

#### S10 · Build — gap tuzish (3 ta)
1. *I / have / a / 53-foot / dry van* → **I have a 53-foot dry van.**
2. *has / The shipper / signed / the BOL* → **The shipper has signed the BOL.**
3. *pays / the lumper fee / Who / ?* → **Who pays the lumper fee?**

#### S11 · Fix it — noto'g'ri atama (3 ta)
1. *I need the POD to see the rate and terms.* → A ✓ *I need the rate confirmation to see the rate and terms.* · B *I need the BOL to see the rate and terms.* · C *I need the detention to see the rate and terms.*
2. *The shipper receives the freight at the dock.* → A ✓ *The receiver receives the freight at the dock.* · B *The broker receives the freight at the dock.* · C *The dispatcher receives the freight at the dock.*
3. *I need a flatbed to carry frozen food.* → A ✓ *I need a reefer to carry frozen food.* · B *I need a pallet to carry frozen food.* · C *I need a gate to carry frozen food.*

#### S12 · Role-play — Siz brokerga yukni tasvirlayapsiz
- **Qadam 1.** Broker: *The load is frozen chicken. Which trailer do you need?*
  - A *A reefer.* ✓ · B *A flatbed.* · C *A dry van.*
- **Qadam 2.** Broker: *Who signs the POD at delivery?*
  - A *The receiver.* ✓ · B *The broker.* · C *The shipper.*
- **Qadam 3.** Broker: *The receiver made you wait four hours. What can you ask for?*
  - A *Detention.* ✓ · B *TONU.* · C *A flat rate.*
- **Yakun:** *Siz 3 ta atamani to'g'ri ishlatdingiz.*

#### S13 · Checkpoint 1 — 8 savol
1. **To'g'ri savol:** A *Where is the shipper?* ✓ · B *Where the shipper is?* · C *Is where the shipper?*
2. ***She ___ at the gate right now.*** A waits · B is waiting ✓ · C wait
3. ***We ___ two hours at the dock yesterday.*** A wait · B waited ✓ · C were wait
4. ***The driver ___ not signed the BOL yet.*** A have · B has ✓ · C did
5. ***We ___ deliver on Friday. It's in the plan.*** A are going to ✓ · B going · C will to
6. **Eng muloyim so'rov:** A *Send the rate con.* · B *Could you send the rate con, please?* ✓ · C *You must send the rate con.*
7. ***If the broker ___ the rate, I'll book the load.*** A will increase · B increases ✓ · C increasing
8. **Qaysi treyler muzlatgichli?** A flatbed · B dry van · C reefer ✓
- **Natija:** 6 va undan ko'p to'g'ri (≥70%) → *Module 1 yakunlandi.* Kam bo'lsa: xato mavzular ro'yxati chiqadi (qaysi dars qayta ko'rilishi kerakligi bilan).

#### S14 · Summary + Say it aloud
- **Phrase bank:** *I have a 53-foot dry van.* · *I need a reefer for this load.* · *The shipper has signed the BOL.* · *Who pays the lumper fee?* · *We waited four hours. We need detention.* · *Please send the rate confirmation.*
- **Module 1 yakuni:** *Siz gap va savol tuzishni, hozirgi, o'tgan va kelasi zamonni, muloyim so'rovni, shartli muzokarani va 40 ta asosiy atamani o'rgandingiz. Keyingi: Module 2 · Everyday Communication.*
- **Say it aloud:** ovoz chiqarib o'qing, o'zingizni baholang.

---

## Xulosa

| Dars | Slaydlar | Rapid test | Takrorlanuvchi tuzoq mavzu |
|---|---:|---|---|
| M1L01 | 14 | 4 savol | so'z tartibi, *is* tushib qolishi |
| M1L02 | 14 | 4 savol | *-s/-ing*, *does + asl fe'l* |
| M1L03 | 15 | 4 savol | *did + asl fe'l*, tartibsiz fe'llar |
| M1L04 | 15 | 4 savol | 3-shakl, aniq vaqt = Past Simple |
| M1L05 | 15 | 4 savol | *will* + asl fe'l, *when* dan keyin hozirgi |
| M1L06 | 15 | 4 savol | modaldan keyin asl fe'l |
| M1L07 | 15 | 4 savol | *if* dan keyin *will* yo'q |
| M1L08 | 14 | 8 savol (checkpoint) | atamalar, 1–7 darsni takrorlash |
| **Jami** | **117** | | |

**Yig'ishda keyingi qadamlar (JSX):**
1. Har dars uchun `CONTENT` obyekti shu hujjatdan olinadi (`uz` matnlar tayyor; `ru` va `en` tushuntirishlar qo'shiladi).
2. Takrorlanuvchi mexanikalar kitga ko'chadi: Read (chat), Notice, FlipCards, MultiPick, SingleChoice (izohli), ORDER, FIX, Role-play (branching), Rapid test, Phrase bank.
3. Birinchi yig'iladigan fayl: `M1L01.learn.jsx` (Intro dan keyin). U qolgan 7 ta dars uchun shablon bo'ladi.
