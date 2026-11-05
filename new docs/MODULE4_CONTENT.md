# Module 4 — Professional Logistics English: chuqurlashtirilgan kontent

**Holat (2026-11-05):** 8 ta Learn JSX va generator yaratildi: 73 nazariya, 24–26 slayd. Standalone Practice fayllari hali yozilmadi. Quyidagi reja M4L01–M4L08 uchun COURSE.md dagi oldingi sodda mashqlar o‘rnini egallaydi.

## 1. Yakuniy modulning talabi

Maqsad — oldingi uch modul bilimlarini birlashtirib, shartlari o‘zgaradigan ish vaziyatida aniq va asoslangan inglizcha javob berish. Qiyinlik kam ishlatiladigan so‘zlar yoki chalkash savoldan emas, bir nechta fakt, cheklov va suhbat bosqichini birgalikda hisobga olishdan keladi. Tushuntirishlar o‘zbekcha, ish misollari inglizcha; ovoz, audio va mikrofon ishlatilmaydi.

- Oddiy darsda **8–10 ta nazariy slayd**; har mavzu uchun aniq ro‘yxat quyida. Hookdan keyin nazariya, undan keyin shu nazariyaga tayangan ichki mashqlar keladi.
- Har nazariy slayd: tushuncha → qachon ishlatilishi → ishlangan misol → yaqin, ammo xato qaror → xatoning sababi → yangi vaziyatga qo‘llash belgisi. Faqat qoida yoki ibora ro‘yxati yetarli emas.
- Har baholanadigan ko‘nikma oldindan tushuntiriladi. Mashq muallifi `theoryRefs`, kerakli faktlar va to‘g‘ri qaror sababini kontentda saqlaydi; bu muallif metama’lumoti, platformaga yangi API talabi emas.
- Har vaziyatda maqsad, vakolat, vaqt, tasdiq holati va yetishmayotgan ma’lumot ajratiladi. Yetarli ma’lumot bo‘lmaganda aniq savol berish ham to‘g‘ri javob bo‘lishi mumkin; barcha savollar shu qolipga qurilmaydi.
- Module 3 dan o‘sish: bitta hujjatdan fakt olish → 2–3 manbani solishtirish → o‘zgarish ta’sirini hisobga olish → kerakli kishiga to‘g‘ri majburiyat bilan javob berish.
- Har Learn: **Hook → 8–10 nazariya → ishlangan case → notice/pattern → lug‘at → guided analysis → build/fix → yangi case → yozma qo‘llash → role-play → yakuniy test → phrase bank**. Taxminan 24–30 ekran; ekran soni maqsad emas. Uzun tushuntirishni bir kartaga siqish o‘rniga mazmunli bo‘laklarga ajratish kerak.
- Guided mashqda izoh va yordam bor; yakuniy testda javobdan oldin yo‘l ko‘rsatuvchi belgi yo‘q. M4L01–07 Learn testi uchun 6–8, M4L08 uchun 12 savol rejalashtiriladi. Aniq savol banki JSX yozish bosqichida tayyorlanadi.
- Mavjud o‘tish qoidasi saqlanadi: oddiy Learn 60%, final 70%; foiz savollar soniga qarab hisoblanadi va talab qilinadigan eng kam to‘g‘ri son ko‘rsatiladi. Qiyinlikni oshirish uchun yashirin ball qoidasi qo‘shilmaydi.

## 2. Taxmin bilan topishga qarshi savol standarti

Variantli savolda tasodifiy topish ehtimoli nol emas. Maqsad — javobni mavzuni bilmasdan shakliy belgilar orqali topishni qiyinlashtirish va bilimni variantlarsiz ham tekshirish.

1. Tanlovdagi barcha javoblar grammatik jihatdan to‘g‘ri, professional va taxminan bir xil uzunlikda bo‘ladi. To‘g‘ri javob doim eng uzun, eng muloyim yoki eng batafsil bo‘lmaydi.
2. Har noto‘g‘ri variant **bitta aniq o‘rgatilgan xatoni** aks ettiradi: eski vaqt, boshqa load ID, tasdiqlanmagan shart, yetishmayotgan vakolat, noto‘g‘ri oluvchi, ETAni appointment deb olish yoki so‘ralgan summani tasdiqlangan summa deb olish.
3. Savolda qaror mezoni ochiq: “Hozir tasdiqlangan shartlarni saqlab, brokerga qaysi javobni yuborasiz?” kabi. Faqat “eng yaxshi gap” deb subyektiv tanlov berilmaydi.
4. Bitta himoya qilinadigan javob bo‘lishi kerak. Ikki variant bir xil vazifani to‘g‘ri bajarsa, savol qayta yoziladi. Bir nechta cheklov ishlatilsa, qaysi biri majburiyligi ko‘rsatiladi.
5. Mustaqil ish mashqlarining kamida 6 tasi ikki yoki undan ko‘p fakt/shartga tayanadi. Har darsda kamida 2 ta variantlarsiz TYPE yoki READ-TYPE vazifasi bo‘ladi.
6. Variantlar tasodifiy joylashadi, javob identifikatori o‘zgarmaydi; bir topshiriq ichida qayta render javob joyini almashtirmaydi. Harflar, ranglar va gap uzunligi javob kaliti bo‘la olmaydi.
7. Practice misollarida Learn dagi ism, raqam yoki gapni shunchaki ko‘chirib olish yetarli bo‘lmaydi: kamida bitta muhim shart o‘zgaradi va qaror qayta chiqariladi.
8. Xato feedbacki nimani tekshirishni aytadi, to‘g‘ri variantni darhol ochmaydi. Yechimdan keyin manba → qoida → qaror zanjiri ko‘rsatiladi.
9. Yozma javob vazifasi aniq chegaralangan: kerakli faktlar, berilgan ibora qolipi va qabul qilinadigan teng ma’noli variantlar oldindan yoziladi. Ochiq emailning sifatini oddiy string tengligi bilan “baholash” mumkin emas. Erkin phrase-bank mashqi ballsiz; baholanadigan email esa aniq maydonlar yoki tekshiriladigan qismlarga bo‘linadi.
10. Katta-kichik harf, ortiqcha bo‘shliq va ma’noni o‘zgartirmaydigan tinish belgisi normallashtiriladi. **Inkor, AM/PM, sana, valyuta, o‘lchov birligi, ID va shart** normalizatsiyada yo‘qolmaydi.

Har 10 ta Practice: kamida 5 mexanika, kamida 2 READ-MC/READ-TYPE, kamida 1 FIX, kamida 2 TYPE/READ-TYPE; **p10 = SCENE**. p01–03 ham Module 4 darajasida, ammo kamroq shart bilan boshlanadi; p04–06 bir nechta shart, p07–09 o‘zgarish/ziddiyat, p10 yangi vaziyatga transfer.

## 3. M4L01 — Talking to Brokers

**Natija:** yukning mavjudligi, mosligi va hozirgi suhbat bosqichini ajratib, faqat tasdiqlangan imkoniyatni bildiradi.
**Til/lug‘at:** availability, covered, pending, equipment, pickup window, carrier approval; “Subject to carrier approval…”, “To confirm, does … apply to this load?”, “We can meet …; could you confirm …?”

### Nazariya — 8 slayd

1. **T1 — Suhbat maqsadi:** availability so‘rovi, qualification va booking turli bosqich; “available” hali “booked” emas.
2. **T2 — Load identifikatsiyasi:** ID + lane + sana bilan bir yukni ajratish; shaharlar bir xil bo‘lsa ham boshqa load bo‘lishi mumkin.
3. **T3 — Moslik:** equipment, commodity, weight va berilgan talablarni birgalikda tekshirish; bitta mos detal yetmaydi.
4. **T4 — Vaqt chegarasi:** pickup window, truck availability va yetib borish vaqtini berilgan ma’lumot asosida solishtirish.
5. **T5 — Aniq savol:** yetishmagan detalni so‘rash; allaqachon berilgan hamma ma’lumotni qayta so‘rash o‘rniga zarur savolni tanlash.
6. **T6 — Shartli imkoniyat:** “can cover” va “can cover if…” farqi; hali tekshirilmagan shartni va’daga aylantirmaslik.
7. **T7 — Carrier ma’lumoti:** broker so‘ragan ma’lumotni aynan berish, yuborilgan ma’lumotni approval bilan adashtirmaslik.
8. **T8 — Read-back va keyingi qadam:** yuk IDsi, asosiy talab va qolgan savolni bitta qisqa yakunda birlashtirish.

**Ishlangan case:** Load 410, Dallas → Tulsa, dry van, pickup 14:00–16:00 Central. Driver ETA 15:20 Central; carrier approval pending. Uskuna va vaqt mos, booking hali yakunlanmagan. Namunaviy javob: “Our van can arrive at 15:20 Central for load 410. Carrier approval is still pending; please confirm approval before we finalize.” Xato qaror: mos ETA sabab approvalni ham tayyor deb hisoblash. Yangi case’da equipment yoki pickup window o‘zgaradi.

| P | Mexanika | Topshiriq va talab qilinadigan dalil | Nazariya |
|---|---|---|---|
| 01 | MC | Bir xil lane dagi ikki load uchun ID va sanaga mos boshlanishni tanlash | T1–T2 |
| 02 | MATCH | Kontekstli broker javoblarini availability/qualification/booking holatiga moslash | T1, T7 |
| 03 | READ-MC | Equipment va vaqt bo‘yicha qaysi load mosligini aniqlash | T3–T4 |
| 04 | READ-MC | Ikki xabardan keyin qolgan yagona hal qiluvchi savolni topish | T5, T7 |
| 05 | GAP | Berilgan shart va va’da darajasiga mos ibora qismini tanlash | T6 |
| 06 | TYPE | Load ID + imkoniyat + shartni berilgan qolipda yozish | T2, T6 |
| 07 | FIX | Approval kelmasdan “confirmed” deyilgan xulosani tuzatish | T1, T7 |
| 08 | REPLY | Brokerning yangi cheklovidan keyin oldingi taklifni moslashtirish | T3–T6 |
| 09 | READ-TYPE | Bir nechta load ichidan mosining IDsi va pickup windowini yozish | T2–T4 |
| 10 | SCENE | Yukni ajratish → moslikni aniqlash → shartli read-back; 3 qaror | T1–T8 |

## 4. M4L02 — Load Booking Conversations

**Natija:** taklif, qabul, hujjat mosligi va dispatch uchun tayyorlikni alohida boshqaradi.
**Til/lug‘at:** tentative, confirmed, revised rate confirmation, assigned, acceptance; “We can confirm once…”, “The revised confirmation still shows…”, “Please confirm the updated … before dispatch.”

### Nazariya — 9 slayd

1. **T1 — Booking holatlari:** inquiry → conditional offer → acceptance → hujjat tekshiruvi → berilgan case qoidasi bo‘yicha dispatch.
2. **T2 — Majburiy shartlar:** lane, equipment, sana/vaqt, rate va maxsus talablarni cheklistga ajratish.
3. **T3 — Rozilik chegarasi:** “I can cover” ni hamma noma’lum shartlarga rozilik sifatida ishlatmaslik.
4. **T4 — Og‘zaki kelishuv va rate con:** bir xil ID uchun summalar va vaqtlarni solishtirish.
5. **T5 — Tuzatilgan hujjat:** yangi versiya butunlay to‘g‘ri degani emas; aynan tuzatilishi kerak bo‘lgan maydonni qayta tekshirish.
6. **T6 — Driver/truck assignment:** “requested”, “assigned” va “details sent” holatlari; ularni bir-biriga almashtirmaslik.
7. **T7 — Yetishmayotgan tasdiq:** aniq maydon, so‘ralayotgan o‘zgarish va keyingi qadamni yozish.
8. **T8 — Dispatch gate:** case’da berilgan majburiy tasdiqlar bajarilmaguncha yakuniy majburiyat bildirmaslik.
9. **T9 — Final read-back:** amaldagi shartlar + jo‘natilgan ma’lumot + bajariladigan keyingi ish.

**Ishlangan case:** Broker xabari: load 418, $1,850, pickup 10:00 Central. Rate con v1: $1,800 va 09:00; v2: $1,850, ammo 09:00 qolgan. Case qoidasida ikkala maydon mos bo‘lishi dispatch sharti. V2 kelgani uchun emas, vaqt ham tuzatilgach dispatch tayyor hisoblanadi. Javob: “The rate is now correct at $1,850. Please revise pickup to 10:00 Central for load 418 before dispatch.”

| P | Mexanika | Topshiriq va talab qilinadigan dalil | Nazariya |
|---|---|---|---|
| 01 | MC | Uchta tasdiqdan qaysi holat haqiqatan yakunlanganini ajratish | T1, T3 |
| 02 | MATCH | Xabarlarni booking holati va qolgan vazifaga bog‘lash | T1, T6 |
| 03 | READ-MC | Broker yozuvi va rate con orasidagi ikki farqni hisobga olgan javob | T2, T4 |
| 04 | ORDER | Shartlari berilgan booking jarayonini operatsion ketma-ketlikda yig‘ish | T1, T8 |
| 05 | GAP | “Once / subject to / already” bilan tasdiq holatini to‘g‘ri ifodalash | T3, T7 |
| 06 | TYPE | Bitta qolgan nomuvofiqlik uchun aniq revision request yozish | T5, T7 |
| 07 | FIX | “Driver details sent” dan “truck dispatched” xulosasiga sakrashni tuzatish | T6, T8 |
| 08 | REPLY | Yangi rate con da bitta xato qolgan vaziyatga javob | T4–T5 |
| 09 | READ-TYPE | Xabarlar tarixidan amaldagi ID, rate va tasdiqlangan pickupni yozish | T2, T5 |
| 10 | SCENE | Shartli taklif → revision → yakuniy dispatch qarori | T1–T9 |

## 5. M4L03 — Rate Negotiation

**Natija:** summa, uning tarkibi va qo‘shimcha shartlarni birga solishtirib, dalilli counteroffer beradi.
**Til/lug‘at:** all-in, line haul, fuel included, conditional offer, counteroffer, firm; “At that rate, we can…”, “Does that total include…?”, “We can accept … provided that …”

### Nazariya — 9 slayd

1. **T1 — Taklifning tarkibi:** amount + inclusions + service conditions; bir xil raqam har doim bir xil taklif emas.
2. **T2 — Solishtirish bazasi:** all-in va line haul + fuel; faqat case’dagi qiymatlardan bir xil total chiqarish.
3. **T3 — Dalil:** masofa, deadhead yoki qo‘shimcha xizmatni manbada bor bo‘lsagina asos sifatida keltirish.
4. **T4 — Counteroffer tuzilmasi:** aniq summa → tegishli sabab → ko‘rsatilgan shart.
5. **T5 — Conditional concession:** summa kamayishi evaziga nima o‘zgarayotgani; yashirin yangi majburiyat olmaslik.
6. **T6 — Firm va flexible:** matndagi cheklovni tanish, ayni bir taklifni sababsiz qaytaravermaslik.
7. **T7 — Oxirgi taklif va kelishuv:** eng yangi raqam bilan accepted raqam farqi; qarshi taklif hali kelishuv emas.
8. **T8 — Vakolat va limit:** case’da berilgan minimum/approval talabiga rioya; o‘quv misoli universal bozor narxi emas.
9. **T9 — Yozma yakun:** total, inclusions, xizmat talabi va tasdiqni read-back qilish.

**Ishlangan case:** Offer A — $2,400 all-in, no extra stop. Offer B — $2,250 line haul + $150 fuel, one additional stop; stop uchun haq hali belgilanmagan. Ikkala ma’lum total $2,400, lekin xizmat hajmi teng emas. B ni avtomatik yaxshiroq deb olish xato. Javob: “The stated total is $2,400 including fuel. What compensation is included for the additional stop?” Keyingi xabarda stop haqi tasdiqlansa, yangi total qayta hisoblanadi.

| P | Mexanika | Topshiriq va talab qilinadigan dalil | Nazariya |
|---|---|---|---|
| 01 | MC | Total bir xil, xizmat sharti boshqa takliflarni farqlash | T1–T2 |
| 02 | MATCH | Dalil/shart/chegirma/yakun funksiyalarini kontekstdan ajratish | T3–T5, T9 |
| 03 | READ-MC | Ikki taklif va ichki limitdan joiz counterofferni tanlash | T2, T8 |
| 04 | GAP | Tasdiqlangan va shartli summani noto‘g‘ri aralashtirmaydigan jumla | T5, T7 |
| 05 | ORDER | Dalil va concession o‘rtasidagi mantiqni saqlab javob tuzish | T3–T5 |
| 06 | TYPE | Berilgan total, sabab va shart bilan chegaralangan counteroffer yozish | T4, T8 |
| 07 | FIX | Yuborilgan counterofferni accepted rate deb yozishni tuzatish | T7 |
| 08 | REPLY | Firm narx, ammo xizmat sharti o‘zgarishi mumkin bo‘lgan javob | T5–T6 |
| 09 | READ-TYPE | Xabarlar tarixidan oxirgi qabul qilingan total va inclusionni yozish | T2, T7 |
| 10 | SCENE | Bir xil bazada solishtirish → shartli murosa → yozma kelishuv | T1–T9 |

## 6. M4L04 — Communicating with Drivers

**Natija:** bir nechta cheklovni hisobga olib, haydovchiga bajariladigan va tekshiriladigan ko‘rsatma beradi.
**Til/lug‘at:** remaining driving time, rest, check-in, seal, POD, written instruction; “Before …, confirm …”, “Do not … until …”, “If …, contact … and wait for …”

### Nazariya — 9 slayd

1. **T1 — Ko‘rsatma tarkibi:** kim → nima → qayerda → qachon → qaysi ID bilan.
2. **T2 — Ketma-ketlik:** before, after, until, once; bir xil ishlar boshqa tartibda boshqa natija beradi.
3. **T3 — Driver holati:** location, mavjud vaqt va berilgan cheklovni to‘g‘ri qayta ifodalash.
4. **T4 — Imkoniyatga mos va’da:** case’da berilgan remaining driving time yetmasa appointmentni kafolatlamaslik; HOS qonunlarini o‘quvchi taxmin qilmaydi.
5. **T5 — Ma’lumot manbasi:** broker xabari, driver xabari va facility ko‘rsatmasining qaysi jihati tasdiqlanganini ajratish.
6. **T6 — Ziddiyatli ko‘rsatma:** xavfsiz to‘xtash/aniqlashtirish, mas’ul shaxsdan yozma tasdiq; hujjat yoki temperaturani o‘zboshimchalik bilan o‘zgartirmaslik.
7. **T7 — Check-back:** driver muhim vaqt/joyni qayta aytib tasdiqlaydi; “OK”ning o‘zi barcha detalni tasdiqlamaydi.
8. **T8 — Hodisa va hujjat:** holatni xabar qilish hamda POD/check-in kabi dalilni kerakli bosqichda so‘rash.
9. **T9 — Shartli fallback:** plan A bajarilmasa kimga, nima va qachon xabar berish.

**Ishlangan case:** Driverda 50 daqiqa driving time qolgan; facilitygacha 70 daqiqalik yo‘l berilgan. Broker “Can he make it in an hour?” deb so‘raydi. Hozirgi cheklov bilan tasdiqlash mumkin emas. Javob: “He has 50 minutes of driving time remaining, while the stated route takes 70 minutes. We need to confirm a feasible revised plan before committing to arrival.” Bu case hisobidir, huquqiy HOS maslahati emas.

| P | Mexanika | Topshiriq va talab qilinadigan dalil | Nazariya |
|---|---|---|---|
| 01 | MC | Gate, ID va deadline bo‘yicha bajariladigan ko‘rsatmani tanlash | T1–T2 |
| 02 | MATCH | Ko‘rsatmani tegishli trigger va tekshirish usuliga bog‘lash | T2, T7 |
| 03 | READ-MC | Location + qolgan vaqt + berilgan yo‘l davomiyligi asosida javob | T3–T4 |
| 04 | GAP | “Before / once / until” orqali to‘g‘ri operatsion shartni saqlash | T2, T9 |
| 05 | ORDER | Check-in → ko‘rsatmani tasdiqlash → keyingi amal tartibini yig‘ish | T1–T2, T7 |
| 06 | TYPE | Driverga ID, amal va trigger bilan qisqa ko‘rsatma yozish | T1, T9 |
| 07 | FIX | Eski gate yoki yetmaydigan vaqtga asoslangan ko‘rsatmani tuzatish | T3–T6 |
| 08 | REPLY | Facility va broker xabari zid bo‘lganda tegishli aniqlashtirish | T5–T6 |
| 09 | READ-TYPE | Oxirgi tasdiqlangan gate, load ID va call-back vaqtini yozish | T1, T5, T7 |
| 10 | SCENE | Cheklovni aniqlash → bajariladigan ko‘rsatma → check-back | T1–T9 |

## 7. M4L05 — Pickup and Delivery Coordination

**Natija:** pickup va delivery bog‘liqligini ko‘rib, taklif etilgan vaqtni tasdiqlangan appointmentdan ajratadi.
**Til/lug‘at:** appointment, arrival estimate, window, pending approval, reschedule; “The requested slot is…”, “The confirmed appointment remains…”, “Please confirm the date and time zone.”

### Nazariya — 9 slayd

1. **T1 — ETA/window/appointment:** uch xil ma’no va har birining javobdagi vazifasi.
2. **T2 — To‘liq vaqt:** sana + soat + time zone; bir vaqt zonasida bo‘lmasa farq case’da beriladi, yashirin bilim talab qilinmaydi.
3. **T3 — Bog‘langan reja:** pickup o‘zgarishi, berilgan loading/travel davomiyligi va delivery cheklovini birgalikda ko‘rish.
4. **T4 — So‘rov va tasdiq:** requested, offered, approved; yangi vaqt so‘ralgani eski slot bekor bo‘lganini bildirmaydi.
5. **T5 — Vakolat:** vaqtni kim tasdiqlashi kerakligi case’da ko‘rsatiladi; boshqa kishining va’dasini facility approval deb olish mumkin emas.
6. **T6 — Qayta rejalash:** yangi vaqt + sabab + load ID; qaysi oldingi appointmentni almashtirish aniq bo‘lsin.
7. **T7 — Joy ma’lumoti:** site, gate, dock va door farqi; boshqa loadning joyini ko‘chirmaslik.
8. **T8 — Closed-loop update:** facility tasdig‘i → broker/driver update → driver check-back.
9. **T9 — Reja o‘zgarganda:** bitta vaqtni emas, bog‘liq shartlar va oxirgi tasdiq holatini qayta tekshirish.

**Ishlangan case:** Pickup requested 10:00, confirmed 11:30 Central; loading 1 soat, travel 3 soat, delivery confirmed 15:00 Central. Berilgan hisob bo‘yicha earliest arrival 15:30; 10:00 so‘rovi hisob bazasi emas. Receiver yangi vaqtni hali tasdiqlamagan. Javob: “Pickup is confirmed for 11:30 Central. Based on the stated loading and transit times, arrival would be 15:30; please confirm a revised delivery slot.”

| P | Mexanika | Topshiriq va talab qilinadigan dalil | Nazariya |
|---|---|---|---|
| 01 | MC | ETA, window va confirmed appointmentni kontekstdan ajratish | T1, T4 |
| 02 | MATCH | Xabarlarni requested/offered/approved holatlari bilan moslash | T4–T5 |
| 03 | READ-MC | Pickup + davomiyliklar + delivery asosida mos reschedule so‘rovi | T2–T3 |
| 04 | GAP | Talab qilinayotgan vaqtni tasdiq sifatida ko‘rsatmaydigan jumla | T4, T6 |
| 05 | ORDER | Facility tasdig‘idan driver check-backgacha xabarlar tartibi | T5, T8 |
| 06 | TYPE | ID, sana, soat va zona bilan aniq reschedule request yozish | T2, T6 |
| 07 | FIX | Boshqa loadning door raqami yoki eski sanaga asoslangan update’ni tuzatish | T2, T7, T9 |
| 08 | REPLY | Broker slotni aytdi, facility esa pending dedi: to‘g‘ri javob | T4–T5 |
| 09 | READ-TYPE | Uch xabardan amaldagi appointment va joyni yozish | T2, T4, T7 |
| 10 | SCENE | Pickup o‘zgarishi → deliveryga ta’sir → barcha tomonlarga tasdiq | T1–T9 |

## 8. M4L06 — Handling Delays and Emergencies

**Natija:** tekshirilgan fakt, noma’lum holat va keyingi update’ni ajratib, xotirjam xabar beradi.
**Til/lug‘at:** reported, confirmed, estimated, pending, breakdown, escalation; “As of …”, “The cause has not been confirmed”, “We will provide the next update at …”

### Nazariya — 9 slayd

1. **T1 — Birinchi xabar:** xavfsizlik holati va ishonchli aloqa faktini aniqlash; tibbiy/texnik choralarni taxmin bilan buyurmaslik.
2. **T2 — Fakt/taxmin/noma’lum:** “driver reported” va “confirmed” ma’no farqi.
3. **T3 — Tuzilma:** situation → impact → current action → next update.
4. **T4 — ETA ishonchliligi:** tow ETA, repair estimate va delivery ETA bir xil emas.
5. **T5 — Vaqt tamg‘asi:** “as of” va aniq next update; “soon”ning o‘zi yetarli emas.
6. **T6 — Qabul qiluvchi:** driver, broker va receiver uchun umumiy faktlar bir xil, so‘raladigan amal boshqa.
7. **T7 — O‘zgarish bilan update:** oldingi xabardan qaysi fakt o‘zgarganini ko‘rsatish; eski ma’lumotni yangisi bilan ziddiyatli qoldirmaslik.
8. **T8 — Escalation:** case’da berilgan mas’ul shaxs va triggerga ko‘ra xabar; hal bo‘lmagan masalani hal bo‘ldi deb yopmaslik.
9. **T9 — Recovery confirmation:** qayta yo‘lga chiqish, yangi ETA va appointment tasdig‘ini alohida tekshirish.

**Ishlangan case:** 13:10 da driver xavfsiz joyda to‘xtaganini bildirgan. Tow ETA 14:00; repair duration noma’lum. 14:30 deliveryni tasdiqlashga asos yo‘q. Xabar: “As of 13:10, the driver reports being safely parked. Tow arrival is estimated for 14:00; repair time and revised delivery ETA are not yet confirmed. Our next update is at 13:40.” Yangi case’da tow va repair ma’lum, lekin appointment tasdig‘i yetishmaydi.

| P | Mexanika | Topshiriq va talab qilinadigan dalil | Nazariya |
|---|---|---|---|
| 01 | MC | Bir xil professional ohangdagi xabarlardan fact/statusga mosini tanlash | T1–T2 |
| 02 | MATCH | Reported fakt, confirmed fakt, estimate va noma’lumni ajratish | T2, T4 |
| 03 | READ-MC | Tow xabari bilan delivery va’dasi orasidagi asoslanmagan sakrash | T3–T4 |
| 04 | ORDER | Vaziyat, ta’sir, amal va update muddatini mazmunan tartiblash | T3, T5 |
| 05 | GAP | “Reported / confirmed / estimated” bilan manba darajasini saqlash | T2, T7 |
| 06 | TYPE | Berilgan faktlar asosida qolipli update yozish, noma’lum ETAni ajratish | T3–T5 |
| 07 | FIX | Eski repair estimate’dan chiqarilgan yangi delivery va’dasini tuzatish | T4, T7, T9 |
| 08 | REPLY | Brokerning aniqlik talabiga fakt va keyingi tekshirish bilan javob | T2–T5, T8 |
| 09 | READ-TYPE | Oxirgi tasdiqlangan holat va navbatdagi update vaqtini yozish | T5, T7 |
| 10 | SCENE | Driver faktlari → broker update → receiver uchun tegishli so‘rov | T1–T9 |

## 9. M4L07 — Resolving Disputes Professionally

**Natija:** e’tirozga dalil va shart bilan javob beradi, hisoblangan talabni tasdiqlangan to‘lov bilan adashtirmaydi.
**Til/lug‘at:** supporting records, requested amount, approval pending, discrepancy, review; “Our records show…”, “Under the stated terms…”, “Could you review … against …?”

### Nazariya — 10 slayd

1. **T1 — Bahsni aniqlash:** qaysi fakt, summa yoki shart bo‘yicha kelishmovchilik borligini chegaralash.
2. **T2 — Ohang va pozitsiya:** concernni tan olish fakt yoki javobgarlikni avtomatik tan olish emas.
3. **T3 — Dalil to‘plami:** case sharti, time records, yozma tasdiq; shunchaki qat’iy gapirish dalil emas.
4. **T4 — Eligibility:** berilgan free time, arrival sharti va approval talablarini birga tekshirish.
5. **T5 — Hisob:** case ko‘rsatgan billing boshi va yaxlitlash qoidasi bo‘yicha billable time; yashirin qoida ishlatilmaydi.
6. **T6 — So‘ralgan va approved summa:** hisoblangan request, yuborilgan invoice va tasdiqlangan payment farqi.
7. **T7 — Yetishmagan dalil:** aynan qaysi record yoki approval kerakligini so‘rash.
8. **T8 — Dalilli javob tuzilmasi:** concern → tekshirilgan fakt → tegishli shart → aniq review request.
9. **T9 — Murosa va vakolat:** berilgan limit doirasida taklif; chegirma yoki yakuniy settlementni ruxsatsiz tasdiqlamaslik.
10. **T10 — Yopish/escalation:** qaror, tasdiqlangan summa va qolgan ishni yozish; pending masalani yopilmagan holatda saqlash.

**Ishlangan case:** Appointment 09:00, recorded arrival 09:00, release 13:00. Faqat shu o‘quv shartida birinchi 2 soat free, keyingi vaqt $50/soat, request uchun signed time record, payment uchun yozma approval kerak. Record bor, approval pending. Request hisob-kitobi 2 × $50 = $100; **approved payment hali yo‘q**. Javob: “The signed records show 09:00–13:00. Under the stated two-hour free-time term, we are requesting $100 for two billable hours. Please review and confirm approval.”

| P | Mexanika | Topshiriq va talab qilinadigan dalil | Nazariya |
|---|---|---|---|
| 01 | MC | Faktni tan olmasdan concernni tan oluvchi, vaziyatga mos javob | T1–T2 |
| 02 | MATCH | Har e’tirozga zarur dalil/shartni moslash | T3–T4, T7 |
| 03 | READ-MC | Billing sharti + records + approval holati bo‘yicha to‘g‘ri xulosa | T4–T6 |
| 04 | GAP | Requested/approved va shartli tilni aniq saqlash | T6, T9 |
| 05 | ORDER | Concern → fakt → shart → review request tartibini yig‘ish | T8 |
| 06 | TYPE | Dalil va aniq so‘rov bilan chegaralangan dispute reply yozish | T3, T7–T8 |
| 07 | FIX | Hisoblangan requestni guaranteed payment deb yozishni tuzatish | T5–T6 |
| 08 | REPLY | Broker boshqa shartga e’tiroz bildirdi: tegishli dalil bilan javob | T1, T3, T9 |
| 09 | READ-TYPE | Berilgan qoida bilan billable duration va request summasini yozish | T4–T6 |
| 10 | SCENE | Eligibility → dalilli request → vakolatli qaror yoki escalation | T1–T10 |

## 10. M4L08 — Full Logistics Communication Simulation + Final Assessment

**Natija:** bitta yuk tarixini bosqichlar davomida izchil yuritib, yangi ma’lumot kelganda qarorni yangilaydi.
**Til/lug‘at:** butun kursdagi iboralar; yangi murakkab grammatika kiritilmaydi.

### Nazariya — 10 ta integratsion tushuntirish

1. **T1 — Case kartasi:** load ID, tomonlar, maqsad, cheklov va amaldagi holat.
2. **T2 — Fact ledger:** tasdiqlangan, shartli, rad etilgan va noma’lum ma’lumotni alohida saqlash.
3. **T3 — Xabarlar tarixi:** yangi xabar har doim oldingi kelishuvni almashtirmaydi; vakolat va tasdiqni tekshirish.
4. **T4 — Booking va negotiation bog‘liqligi:** accepted rate va dispatch gate bir xil narsa emas.
5. **T5 — Jadval bog‘liqligi:** pickup, berilgan davomiylik, driver availability va deliveryni birga ko‘rish.
6. **T6 — Ko‘rsatma va check-back:** bitta faktni turli oluvchilarga mos, ammo ziddiyatsiz yetkazish.
7. **T7 — O‘zgarish va risk:** qaysi shart buzilgani, kimga update va qaysi approval kerakligi.
8. **T8 — Dalil va dispute:** hodisa recordsidan request chiqarish; request va payment holatini ajratish.
9. **T9 — Handover xabari:** current status + pending issue + owner + next update.
10. **T10 — Yakuniy tekshiruv:** English clarity, fact accuracy, commitment va recipient/action mosligini tekshirish.

**Ishlangan case:** Load 480 bo‘yicha rate qabul qilingan, lekin pickup vaqti rate con’da eski. Keyin pickup tuzatiladi, driver availability esa o‘zgaradi. Birinchi to‘siq yechilgani ikkinchi cheklovni bekor qilmaydi. Fact ledger har xabardan keyin yangilanadi; yakuniy read-back oxirgi haqiqiy holatdan tuziladi. Bu ko‘rsatib beriladigan misol; baholanadigan case boshqa ID, raqamlar va o‘zgarish nuqtasiga ega bo‘ladi.

### Learn final testi

12 ta savol: broker/booking 2; negotiation 2; driver/coordination 2; delay/update 2; dispute 2; handover/cross-check 2. Kamida 4 tasi variantlarsiz chegaralangan yozma javob. Oldin tushuntirilgan ko‘nikmalar, yangi case va yangi ma’lumotlar. O‘tish: 70%, ya’ni **12 tadan kamida 9 ta** birinchi urinishda to‘g‘ri. Test javobini keyin tuzatish birinchi urinish ballini oshirmaydi; qayta test alohida urinish sifatida boshlanadi.

### Practice — aynan 10 ta fayl

Quyidagi jadval eski “ko‘p SCENE, kam mexanika” rejasini almashtiradi; 5 dan ortiq mexanika va variantlarsiz baholash saqlanadi.

| P | Mexanika | Topshiriq va talab qilinadigan dalil | Nazariya |
|---|---|---|---|
| 01 | READ-MC | Loadlar tarixidan amaldagi case va qolgan booking to‘sig‘ini tanlash | T1–T4 |
| 02 | MATCH | Xabarni uning owner, status va next actioniga moslash | T2–T3, T9 |
| 03 | READ-TYPE | Qabul qilingan total va tasdiqlangan pickupni tarixdan yozish | T3–T5 |
| 04 | ORDER | Cheklovli booking → driver → coordination jarayonini tartiblash | T4–T6 |
| 05 | GAP | Delay update’da fact/estimate/commitmentni farqlash | T2, T7 |
| 06 | TYPE | Berilgan qolipda current status, owner va next update bilan handover | T6, T9–T10 |
| 07 | FIX | Yangi ma’lumotga zid bitta muhim xulosani tuzatish | T3, T5, T7 |
| 08 | REPLY | Dispute javobini dalil, approval va vakolatga mos tanlash | T8, T10 |
| 09 | READ-TYPE | Hujjatdagi shart bilan request summasi va pending approvalni yozish | T2, T8 |
| 10 | SCENE | 3 qarorli yakuniy transfer: booking → o‘zgargan reja → dalilli handover | T1–T10 |

Case davomiyligi bir dars/SCENE ichida saqlanadi. Alohida p01–p10 fayllari bir-birining runtime holatiga bog‘lanmaydi: har fayl o‘ziga kerakli case snapshotini beradi. Butun kurs zanjiri Learn final case’da yoritiladi; p10 aynan uchta hal qiluvchi qarorni tekshiradi.

## 11. Muallif uchun qabul mezonlari

- Har dars nazariya ro‘yxati va Practice xaritasiga mos; tushuntirilmagan termin yoki qoida bilan ball kamaytirilmaydi.
- Har savolda manba, to‘g‘ri javob, izoh, har distractor xatosi, `theoryRefs` va yozma javobning qabul chegarasi mavjud.
- Case’dagi vaqt/sana/ID/summalar ichki izchil. Qonun, bozor narxi yoki umumiy to‘lov siyosati sifatida o‘quv case shartlari ko‘rsatilmaydi.
- Savolni manbasiz, faqat variantlarning ohangi/uzunligi bilan yechish mumkin bo‘lsa qayta yoziladi. Savolni diqqat bilan o‘qigan ikki muallif turli himoya qilinadigan javob topsa qayta yoziladi.
- Xato izohida qayta tekshiriladigan detal aniq; “yana urinib ko‘ring”ning o‘zi yetarli emas.
- Nazariya ketma-ket ochiladi, 2D/3D animatsiya o‘rgatilayotgan bog‘liqlikni ko‘rsatadi. Ovoz yo‘q; reduced-motionda barcha mazmun ko‘rinadi.
- Sarlavha ustidagi takroriy tur/kod qatori bo‘lmaydi. Desktopda footer va tugmalar ko‘rinadi; uzun nazariya alohida slaydga bo‘linadi. Mobil ekranda kontent kesilmaydi.
- Module 4 palitrasi va aniq animatsiya sahnalari JSX yozish bosqichida belgilanadi; ushbu kontent tahriri umumiy runtime yoki oldingi modul fayllarini o‘zgartirmaydi.
