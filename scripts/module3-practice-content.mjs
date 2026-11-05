// Module 3: fictional documents and situations, aligned with M3L01-M3L08 Learn.
export const instructions = {
  MC:'Mos javobni tanlang.', MATCH:'Atamalarni ma’nosi bilan juftlang.',
  'READ-MC':'Manbani o‘qib, dalilga mos javobni tanlang.', GAP:'Bo‘sh joyni to‘ldiradigan variantni tanlang.',
  ORDER:'Bo‘laklardan mazmunga mos gap tuzing.', FIX:'Manbaga zid yoki grammatik xato gapni tuzating.',
  SORT:'Elementlarni mos guruhlarga ajrating.', FORM:'Manba asosida maydonlarni to‘ldiring.',
  'READ-TYPE':'Manbadan so‘ralgan ma’lumotni yozing.', SCENE:'Uch bosqichli vaziyatda qaror qiling; har bosqichda Tekshirishni bosing.',
};
const base = (kind,title,questionText,hint,passage) => ({kind,title,instruction:instructions[kind],questionText,hint,success:`To‘g‘ri. ${hint}`,...(passage ? {passage} : {})});
export const c = (kind,title,question,right,wrong1,wrong2,hint,passage) => ({...base(kind,title,question,hint,passage),options:[right,wrong1,wrong2].map(label=>({label})),answer:0});
export const m = (title,pairs,hint) => ({...base('MATCH',title,'Mos juftliklarni toping.',hint),pairs:pairs.map(([left,right])=>({left,right,hint}))});
export const o = (title,expected,hint) => ({...base('ORDER',title,'Berilgan ma’nodagi gapni tuzing.',hint),tokens:[...expected],expected});
export const t = (kind,title,question,fields,hint,passage) => ({...base(kind,title,question,hint,passage),fields:fields.map(([label,answers,fieldHint])=>({label,answers:Array.isArray(answers)?answers:[answers],hint:fieldHint||hint}))});
export const s = (title,groups,hint) => ({...base('SORT',title,'Har bir element uchun mos guruhni tanlang.',hint),groups:groups.map(([label,items])=>({label,items}))});
export const scene = (title,steps,hint) => ({...base('SCENE',title,'Manbaga tayangan holda uch bosqichni bajaring.',hint),steps:steps.map(([prompt,right,wrong1,wrong2])=>({prompt,options:[right,wrong1,wrong2].map(label=>({label})),answer:0}))});

export const module3PracticeCore = {
  M3L01:[
    c('MC','Equipment va vaqt','Truck: dry van, Dallas, ready 9 AM. Qaysi e’lon dastlabki ikki shartga mos?','A: dry van, pickup 10 AM','B: reefer, pickup 10 AM','C: dry van, pickup 7 AM','A transport turi va tayyor bo‘lish vaqtiga mos. Mavjudlik keyin tasdiqlanadi.'),
    m('Load board atamalari',[['origin','where the load starts'],['destination','where the load is delivered'],['commodity','the goods being transported'],['deadhead','empty travel to pickup'],['loaded miles','distance travelled with the load'],['posted','listed, with availability still to be confirmed']],'Origin va destination yo‘nalishni, deadhead va loaded miles turli masofalarni bildiradi.'),
    c('READ-MC','Ikki narx, bitta talab','Dry van va 10 AM tayyor truck uchun qaysi tanlov asosli?','Load 401: equipment and pickup time fit.','Load 402: the higher rate alone makes it suitable.','Both loads fit because both leave Dallas.','Dry van truck reefer talabini bajarmaydi. Narxning o‘zi yetarli emas.','Truck: dry van, Dallas, ready 10 AM.\n401: Dallas → Austin, dry van, PU 11 AM, rate $660.\n402: Dallas → Houston, reefer, PU 11 AM, rate $950.\nAvailability of both loads is unconfirmed.'),
    c('GAP','Yo‘nalish va manzil','Load 401 goes ___ Dallas to Austin.','from','at','between','Yo‘nalish: from + origin + to + destination.'),
    o('Loaded-mile RPM',['The rate','is $3.00','per','loaded mile.'],'“Narx yuk bilan bosilgan har milga 3 dollar” ma’nosini bering.'),
    t('FORM','Masofa va narx hisobi','Faqat raqam kiriting. RPMni loaded miles asosida hisoblang.',[['Load ID','401'],['Loaded-mile RPM ($)',['3','3.00']],['Total driving miles','250']],'660 ÷ 220 = 3; 220 + 30 = 250.',['Load 401 | Rate $660 | Loaded miles 220 | Deadhead 30.'].join('')),
    c('FIX','Loaded va totalni aralashtirmang','Manba: loaded 180, DH 20. “There are 200 loaded miles.” gapini tuzating.','There are 180 loaded miles and 200 total driving miles.','There are 200 loaded miles and 180 total miles.','There are 160 total miles.','Total = loaded + deadhead; loaded qiymati o‘zgarmaydi.'),
    s('E’lon qismlari',[['Equipment',['dry van','reefer']],['Load size / service',['FTL','LTL']],['Stop abbreviation',['PU','DEL']]],'FTL/LTL xizmat hajmini, PU/DEL olish/yetkazish stopini bildiradi.'),
    t('READ-TYPE','E’londagi dalillar','Destination, commodity va pickup window ni yozing.',[['Destination',['Tulsa','Tulsa, OK']],['Commodity','paper rolls'],['Pickup window',['9–11 AM','9-11 AM','between 9 and 11 AM','9 to 11 AM']]],'Origin o‘rniga destinationni yozing; PU oynasini DEL vaqti bilan almashtirmang.','Load 403\nOrigin: Dallas, TX\nDestination: Tulsa, OK\nCommodity: paper rolls\nPU: November 14, 9–11 AM\nDEL: November 14, 4 PM'),
    scene('Bookingdan oldingi uch qadam',[
      ['403 e’loni mos, lekin mavjudligi tasdiqlanmagan. Birinchi savol?','Is load 403 still available?','I have booked load 403 already.','I assume the load is available.'],
      ['Broker: Yes, available. Pickup 9–11 AM. E’londa dock yo‘q.','Could you confirm the dock number?','I will use dock 403.','Any dock will be fine.'],
      ['Broker: Dock 6. Load 403, Dallas to Tulsa, pickup 9–11 AM. Tasdiqlang.','Load 403, Dallas to Tulsa, dock 6, pickup between 9 and 11 AM.','Load 6, Tulsa to Dallas, dock 403, pickup at 11 PM.','Load 403, any dock, pickup whenever possible.'],
    ],'Moslik → mavjudlik → yetishmagan detal → aniq read-back.'),
  ],
  M3L02:[
    c('MC','Tasdiqlangan total','Sample RC: line haul $1,100 + fuel $250. Detention hali tasdiqlanmagan. Total qancha?','$1,350','$1,600 including assumed detention','$1,100','1100 + 250 = 1350; tasdiqlanmagan qo‘shimcha haq qo‘shilmaydi.'),
    m('Rate con lug‘ati',[['line haul','base transportation charge'],['fuel surcharge','fuel-related addition to the rate'],['written approval','permission confirmed in writing'],['receipt','proof of payment'],['signed POD','signed proof of delivery'],['payment terms','conditions and timing of payment']],'Approval, receipt va signed POD bir xil hujjat emas.'),
    c('READ-MC','Detention shartlari','8 AM da vaqtida kelgan truck uchun detention eng erta qachondan ko‘rib chiqilishi mumkin?','10 AM, with the stated evidence and approval.','8 AM automatically.','9 AM without any approval.','2 free hour tugashi 10 AM; dalillar va approval sharti ham saqlanadi.','Training RC 411: arrival appointment 8 AM. Detention review after 2 free hours. On-time arrival, recorded in/out times and written broker approval are required. No automatic payment is promised.'),
    c('GAP','Narx tarkibi','The total rate ___ the fuel surcharge.','includes','including','include','The total rate birlikdagi ega: includes. Fuel total tarkibida.'),
    o('Qo‘shimcha haq',['Written approval','is required','for','extra charges.'],'“Qo‘shimcha haq uchun yozma tasdiq kerak” gapini tuzing.'),
    t('FORM','Revised rate con','Totalni hisoblang, yangilangan check call vaqtini yozing.',[['Total ($)',['1700','1,700','$1700','$1,700']],['Check-call time',['11 AM','11:00 AM']],['Time zone',['Central','Central Time']]],'1500 + 200 = 1700. Eski 9 AM o‘rniga addendumdagi 11 AM olinadi.','RC 412 addendum: line haul $1,500; fuel $200. Revised daily check call: 11 AM Central (replaces 9 AM). Extra fees need written approval.'),
    c('FIX','Net 30 boshlanishi','“Net 30 starts on pickup day.” Namunaga mos tuzatish?','Net 30 starts after receipt of both the invoice and signed POD.','Net 30 always starts at check-in.','Payment is due thirty minutes after delivery.','Namunada boshlanish nuqtasi ikkala hujjat qabul qilinishi.','Sample payment terms: Net 30 after receipt of the invoice and signed POD.'),
    s('Summami yoki shartmi?',[['Stated base-rate amount',['Line haul: $1,100','Fuel: $250']],['Needs confirmation / approval',['TONU: amount not specified','Lumper: written approval pending']],['Evidence / document',['Signed POD','Recorded in/out times']]],'Asosiy narx, shartli haq va dalillarni alohida ajrating.'),
    t('READ-TYPE','Sample RC bandlari','Free hours, check call va Net 30 uchun POD holatini yozing.',[['Free hours','3'],['Check-call time and zone',['8 AM Central','8:00 AM Central']],['POD must be ___','signed']],'Vaqt zonasini saqlang; unsigned POD emas, signed POD so‘ralgan.','RC 413: 3 free hours. Daily check call at 8 AM Central. Net 30 after receipt of invoice and signed POD. TONU amount is not specified; written approval is needed.'),
    scene('Bekor qilingan yuk',[
      ['Load 414 cancelled. RC says TONU needs written approval, amount unspecified.','Could you confirm whether TONU applies and the approved amount?','I have added a guaranteed $250 TONU fee.','All cancellations pay the same fee.'],
      ['Broker: Send the dispatch confirmation; I will review it. Hozir nima qilasiz?','Send the confirmation and wait for the written decision.','Change the agreed total before review.','Invent an earlier dispatch time.'],
      ['Broker writes: TONU approved at $150 for load 414. Tasdiqlang.','Confirmed: $150 TONU approved in writing for load 414.','Confirmed: $250 TONU on every cancelled load.','The approval applies to all future loads.'],
    ],'Namunadagi aniq shart va yozma qarorga tayaning; umumiy kafolat yasamang.'),
  ],
  M3L03:[
    c('MC','Appointment yoki FCFS?','Qaysi ko‘rsatma aniq appointmentni bildiradi?','Appointment: November 16 at 9 AM.','FCFS: November 16, 7 AM–3 PM.','Call to confirm the time.','Appointment aniq belgilangan vaqt; FCFS xizmat navbatini bildiradi.'),
    m('Stop atamalari',[['shipper','pickup-side sender'],['receiver / consignee','delivery-side recipient'],['appointment','a scheduled arrival time'],['FCFS','first come, first served'],['PU number','pickup reference'],['seal number','identifier of the trailer seal']],'PU number, seal va dock raqamlarini aralashtirmang.'),
    c('READ-MC','Ikki stopni farqlang','Qaysi xulosa hujjatga mos?','Pickup has a 9 AM appointment; delivery is FCFS from 7 AM to 3 PM.','Both stops have a 9 AM appointment.','Delivery uses pickup dock 5 automatically.','Har stopning vaqti va check-in tartibi alohida.','Load 421\nPU: Lake Foods, Dallas. November 16, appointment 9 AM; check in 8:45 AM; dock 5.\nDEL: Metro Market, Austin. November 17, FCFS 7 AM–3 PM; check in at delivery office; dock assigned on arrival.'),
    c('GAP','Ketma-ket ko‘rsatma','Check in at the office first. ___, wait for the dock assignment.','Then','Because of','Due to','First → then — harakatlar ketma-ketligi.'),
    o('Check-in vaqti',['Please','check in','at 8:45 AM','before the appointment.'],'“Appointmentdan oldin 8:45 da check-in qiling” gapini tuzing.'),
    t('FORM','Pickup kartasi','Appointmentdan 20 daqiqa oldingi check-in vaqtini hisoblang va referenslarni yozing.',[['Check-in time',['9:40 AM','09:40','9:40']],['Dock','4'],['PU number',['PU728','PU 728']],['Seal number','99124']],'10:00 dan 20 daqiqa oldin 9:40. PU728 va seal 99124 boshqa identifikatorlar.','Load 422: pickup appointment 10 AM. Check in 20 minutes early. Dock 4. PU number PU728. Seal 99124.'),
    c('FIX','Delivery dock noma’lum','Pickup dock 4; delivery dock assigned on arrival. “Delivery is at dock 4.” o‘rniga?','The delivery dock will be assigned on arrival.','Both docks must be 4.','The driver may choose any delivery dock.','Pickup dockdan delivery dockni taxmin qilmang.'),
    s('Referens, vaqt va joy',[['Reference',['PU728','Seal 99124']],['Arrival timing',['Appointment 10 AM','FCFS 7 AM–3 PM']],['Check-in location',['Shipping office','Delivery office']]],'Identifikatorlar, vaqt va check-in joylari turlicha ma’lumot.'),
    t('READ-TYPE','Yangilangan appointment','Yangi sana, vaqt va gate raqamini yozing.',[['Appointment date',['November 18','Nov 18','18 November']],['Appointment time',['11 AM','11:00 AM']],['Gate','2']],'Faqat latest confirmationdan oling; eski vaqt almashtirilgan.','Old note: November 17, 9 AM, gate 1.\nLatest written confirmation for load 423: appointment moved to November 18 at 11 AM. Use gate 2. Bring PU number PU829.'),
    scene('Receiver yopiq',[
      ['Load 424: receiver is closed. Confirmed appointment cannot be completed now.','The receiver is closed. Could you confirm the next available appointment?','Delivery is complete.','I will leave the load outside without instructions.'],
      ['Broker: Tomorrow 8 AM confirmed. Check in at delivery office; dock assigned there.','Understood. Tomorrow at 8 AM; delivery office check-in, then dock assignment.','I will use the old pickup dock tonight.','I will arrive at 8 PM tomorrow.'],
      ['Haydovchi: Do I need the BOL at check-in? Written instruction: Bring the BOL.','Yes, bring the BOL to the delivery office at check-in.','No documents are needed.','The PU number replaces every delivery document.'],
    ],'Yopiq receiver → yangi appointment tasdig‘i → hujjat va check-in read-back.'),
  ],
  M3L04:[
    c('MC','Location va ETA','Haydovchi: I am near Waco. ETA so‘ralgan savolga nima yetishmayapti?','The estimated arrival time.','The truck colour.','The pickup city only.','Location qayerdaligini aytadi; ETA qachon yetib kelish taxmini.'),
    m('Update atamalari',[['loaded','the goods are on the truck'],['empty','no load is being carried'],['en route','travelling to the destination'],['ETA','estimated time of arrival'],['30 minutes out','about half an hour away'],['next update','the planned next status report']],'Vaziyat, taxminiy yetish va keyingi xabar vaqtini ajrating.'),
    c('READ-MC','To‘liq check call','Qaysi update manbadagi hamma asosiy detalni saqlaydi?','Load 431 is loaded, near Waco, ETA 4 PM Central; next update 3 PM Central.','Load 431 is delivered at 4 PM.','Load 431 is empty, next update tomorrow.','Loaded delivered degani emas; ETA tasdiqlangan delivery vaqti emas.','Driver: Load 431 is loaded. I am near Waco, en route to Austin. ETA is 4 PM Central. I will update you again at 3 PM Central.'),
    c('GAP','Yuklash holati','Have you ___ loaded yet?','been','be','being','Have you been loaded yet? — yuklash tugaganini so‘rash.'),
    o('Keyingi update',['I will','send the next update','at','3 PM Central.'],'“Keyingi xabarni 3 PM Centralda yuboraman” gapini tuzing.'),
    t('FORM','Vaqtli status','Location, ETA va keyingi update vaqtini yozing.',[['Location',['Temple','near Temple']],['ETA',['4:30 PM Central','16:30 Central']],['Next update',['3 PM Central','3:00 PM Central','15:00 Central']]],'ETA 4:30, keyingi update 3:00 — ular boshqa-boshqa vaqt.','Load 432: loaded, near Temple. Current ETA 4:30 PM Central due to traffic. Next update at 3 PM Central.'),
    c('FIX','Taxminni faktga aylantirmang','Haydovchi “ETA 5 PM” dedi. “Delivery is confirmed for 5 PM” o‘rniga?','The current estimated arrival time is 5 PM.','Delivery was completed at 5 PM.','The receiver confirmed a 5 PM appointment.','ETA arrival taxmini; appointment yoki delivery tasdig‘i emas.'),
    s('Update qismlari',[['Location',['near Waco','at the yard']],['Load status',['loaded','empty']],['ETA / distance in time',['ETA 4 PM','30 minutes out']],['Next report',['next update at 3 PM','I will update you in one hour']]],'Qayerda, qanday holatda, qachon yetadi va qachon xabar beradi — to‘rtta savol.'),
    t('READ-TYPE','30 minutes out','Hozirgi vaqt 2:10 PM Central. Estimated arrival va keyingi update ni yozing.',[['Estimated arrival',['2:40 PM Central','14:40 Central']],['Next update',['2:25 PM Central','14:25 Central']]],'2:10 + 30 daqiqa = 2:40. Keyingi update manbada alohida berilgan.','Driver at 2:10 PM Central: I am about 30 minutes out. I am loaded and en route. I will send another update at 2:25 PM Central.'),
    scene('Yetishmagan ETA',[
      ['Driver: I am near Temple. Loaded. ETA aytilmadi.','What is your current ETA, including the time zone?','Delivery is complete.','I will assume 4 PM.'],
      ['Driver: ETA 5 PM Central. Next update 4 PM Central. Brokerga yuboring.','Loaded near Temple; ETA 5 PM Central; next update 4 PM Central.','Empty near Temple; confirmed delivery 4 PM.','Loaded, no further updates planned.'],
      ['At 4 PM Central driver reports traffic; new ETA 5:30 PM, next update 4:30 PM Central.','Updated ETA 5:30 PM Central due to traffic; next update 4:30 PM Central.','ETA remains 5 PM because that was reported first.','Delivery completed at 5:30 PM.'],
    ],'Yetishmagan detalni so‘rang, so‘ng eng yangi taxmin va keyingi update vaqtini uzating.'),
  ],
};
