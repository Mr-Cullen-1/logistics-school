// Everyday Communication: COURSE.md Module 2 + the eight Module 2 Learn lessons.
const instructions = {
  MC: "To'g'ri javobni tanlang.", MATCH: "Har bir elementni mos javob bilan juftlang.",
  'READ-MC': "Matnni o'qib, javobni tanlang.", GAP: "Bo'sh joyga mos so'zni tanlang.",
  ORDER: "Bo'laklarni to'g'ri tartibda joylang.", FIX: "Xatoni tuzatadigan variantni tanlang.",
  SORT: "Har bir elementni mos guruhga ajrating.", TYPE: "Berilgan ma'lumot asosida inglizcha yozing.",
  'READ-TYPE': "Matndan so'ralgan ma'lumotni yozing.", REPLY: "Vaziyatga mos javobni tanlang.",
  FORM: "Manbaga qarab forma maydonlarini to'ldiring.", SCENE: "Uch bosqichli vaziyatda mos javoblarni tanlang.",
};
const base = (kind, title, questionText, hint, success, passage) => ({ kind, title, instruction: instructions[kind], questionText, hint, success, ...(passage ? { passage } : {}) });
// Correct option is declared first in authoring data, then shuffled once per mounted file.
const c = (kind, title, question, right, wrong1, wrong2, hint, passage) => ({ ...base(kind, title, question, hint, `To'g'ri. ${hint}`, passage), options: [right, wrong1, wrong2].map(label => ({ label })), answer: 0 });
const m = (title, pairs, hint) => ({ ...base('MATCH', title, "Mos juftliklarni toping.", hint, "Barcha juftliklar to'g'ri."), pairs: pairs.map(([left, right]) => ({ left, right, hint })) });
const o = (title, expected, hint) => ({ ...base('ORDER', title, "Bo'laklardan berilgan ma'nodagi gap yoki xabarni tuzing.", hint, expected.join(' ')), tokens: [...expected], expected });
const t = (kind, title, question, fields, hint, passage) => ({ ...base(kind, title, question, hint, "Ma'lumotlar to'g'ri kiritildi.", passage), fields: fields.map(([label, answers, fieldHint]) => ({ label, answers: Array.isArray(answers) ? answers : [answers], hint: fieldHint || hint })) });
const s = (title, groups, hint) => ({ ...base('SORT', title, "Elementlarni guruhlarga ajrating.", hint, "Barcha elementlar to'g'ri guruhlandi."), groups: groups.map(([label, items]) => ({ label, items })) });
const scene = (title, steps, hint) => ({ ...base('SCENE', title, "Har bosqichda javobni tanlang va Tekshirish tugmasini bosing.", hint, "Uch bosqich muvaffaqiyatli yakunlandi."), steps: steps.map(([prompt, right, wrong1, wrong2]) => ({ prompt, options: [right, wrong1, wrong2].map(label => ({ label })), answer: 0 })) });

export const module2Practice = {
  M2L01: [
    c('MC', 'Professional tanishuv', "Brokerga telefon qilganda qaysi kirish mos?", 'Good morning. This is Aziz from Coliseum Logistics.', 'Give me your load now.', 'I dispatcher. Who you?', 'Telefon boshida salom, ism va kompaniya aytiladi.'),
    m('Kim nima qiladi?', [['dispatcher', 'coordinates drivers and loads'], ['broker', 'arranges transportation between shippers and carriers'], ['carrier representative', 'speaks on behalf of the carrier'], ['safety officer', 'handles safety and compliance']], 'Lavozimni uning ish vazifasi bilan moslang.'),
    c('READ-MC', 'Kim gapirmoqda?', 'Ism va kompaniya qaysi?', 'Maya Reed — Northline Freight', 'Aziz — Northline Freight', 'Maya Reed — Coliseum Logistics', 'This is dan keyin ism, from dan keyin kompaniya kelgan.', 'Good afternoon. This is Maya Reed from Northline Freight. I am a carrier representative. May I speak with your dispatcher?'),
    c('GAP', 'Lavozimni ayting', 'I ___ as a dispatcher for Coliseum Logistics.', 'work', 'am', 'been', 'Lavozim uchun work as, kompaniya uchun work for ishlatiladi.'),
    o('Ikki yillik tajriba', ["I've", 'been', 'in logistics', 'for', 'two years.'], 'Hozirgacha davom etgan tajriba: have been; muddat: for.'),
    t('TYPE', 'Kontakt kartasi', "Rol kartasiga qarab uch bo'sh joyni to'ldiring.", [['My name is ___.', 'Aziz'], ['I work as a ___.', 'dispatcher'], ['I work for ___.', 'Coliseum Logistics']], "Shaxsiy ma'lumotingizni emas, rol kartasidagi ma'lumotni yozing.", 'Name: Aziz\nPosition: dispatcher\nCompany: Coliseum Logistics'),
    c('FIX', 'Tajribani tuzating', 'I am working dispatcher since 2 years. Qaysi tuzatish mos?', "I've been working as a dispatcher for two years.", 'I am dispatcher since two years.', "I've working dispatcher for two years.", 'have been working as a dispatcher + for two years.'),
    c('REPLY', 'Kasbingiz nima?', 'Nice to meet you. What do you do?', 'Nice to meet you too. I work as a dispatcher.', 'I am fine, thank you.', 'It is ten o’clock.', 'What do you do? — kasb yoki vazifa haqida savol.'),
    t('READ-TYPE', 'Kontaktni ajrating', 'Kontaktning to‘liq ismi va kompaniyasini yozing.', [['Full name', 'Maya Reed'], ['Company', 'Northline Freight']], 'Ism va kompaniyani alohida maydonlarga yozing.', 'Contact: Maya Reed\nCompany: Northline Freight\nDepartment: Operations\nPosition: carrier representative'),
    scene('Yangi broker bilan tanishuv', [
      ['Broker: Who am I speaking with? Siz Azizsiz.', 'This is Aziz from Coliseum Logistics.', 'Give me a rate.', 'This is the pickup.'],
      ['Broker: What do you do at Coliseum Logistics?', 'I work as a dispatcher.', 'I am fine.', 'I work since two years.'],
      ['Broker: How long have you been in logistics? Tajriba: 2 yil.', "I've been in logistics for two years.", "I've been in logistics since two years.", 'I logistics two years.'],
    ], 'Ism va kompaniya → lavozim → tajriba.'),
  ],
  M2L02: [
    c('MC', 'Muloyim savol', 'Qaysi bilvosita savol to‘g‘ri?', 'Could you tell me where the pickup is?', 'Could you tell me where is the pickup?', 'Tell me where pickup!', 'Bilvosita savolda where + ega + fe’l tartibi ishlatiladi.'),
    m('Savolni muloyim qiling', [['Where is the dock?', 'Could you tell me where the dock is?'], ['When is the delivery?', 'Do you know when the delivery is?'], ['What time does the receiver open?', 'Could you tell me what time the receiver opens?'], ['Is a pickup number required?', 'Could you tell me if a pickup number is required?']], 'Savol ichida odatiy ega + fe’l tartibini saqlang.'),
    c('READ-MC', 'Shipper talabi', 'Haydovchi check-in vaqtida nimani ko‘rsatishi kerak?', 'Pickup number PU624', 'A delivery receipt only', 'A new rate offer', 'required so‘zi talabni bildiradi.', 'Shipper: Pickup is at 480 Oak Street, dock 6. Pickup number PU624 is required at check-in. Please arrive between 8 AM and 10 AM.'),
    c('GAP', 'Ish boshlanishi', 'Could you tell me what time the receiver ___?', 'opens', 'does open', 'open', 'Bilvosita savolda does yo‘q; the receiver opens.'),
    o('Yetkazish vaqti', ['Do you know', 'when', 'the delivery', 'is?'], 'when dan keyin the delivery is keladi.'),
    t('TYPE', 'Dockni so‘rang', 'Where is the dock? savolini Could you tell me bilan boshlang.', [['Polite question', ['Could you tell me where the dock is?', 'Could you please tell me where the dock is?']]], 'Could you tell me + where + the dock + is.'),
    c('FIX', 'Savol tartibi', 'Could you tell me where is the pickup? gapini tuzating.', 'Could you tell me where the pickup is?', 'Could you tell me where does the pickup is?', 'Could you tell where the pickup?', 'Bilvosita savolda is egadan keyin keladi.'),
    c('REPLY', 'Tushunmagan detal', 'Shipper: Use the east entrance. Siz entrance so‘zini aniq eshitmadingiz.', 'Sorry, could you repeat which entrance I should use?', 'Yes, I will use the west entrance.', 'You are wrong.', 'Taxmin qilmang: qayta aytishni muloyim so‘rang.'),
    t('READ-TYPE', 'Manzil raqami', 'Faqat ko‘cha raqamini yozing.', [['Street number', '725']], 'Dock raqami va pickup identifikatori ko‘cha raqami emas.', 'Pickup: 725 Pine Road\nDock: 3\nPickup reference: PU918\nWindow: 9–11 AM'),
    scene('Pickup talablarini aniqlang', [
      ['Manzil hali berilmadi. Uni bilvosita savol bilan so‘rang.', 'Could you tell me where the pickup is?', 'Could you tell me where is pickup?', 'Pickup where?'],
      ['Shipper: 480 Oak Street. Endi dock raqamini so‘rang.', 'Do you know which dock I should use?', 'Do you know which dock should I use?', 'I will choose any dock.'],
      ['Shipper: Dock 6. Pickup raqami kerakligini so‘rang.', 'Could you tell me if a pickup number is required?', 'Could you tell me is a pickup number required?', 'I do not need any number.'],
    ], 'Bilvosita savolda ega fe’ldan oldin keladi; Yes/No savolda if ishlating.'),
  ],
  M2L03: [
    c('MC', 'Thirteen yoki thirty?', '“thirty” qaysi son?', '30', '13', '3', 'thirteen — 13; thirty — 30. Bu yozma farqlash mashqi.'),
    m('Son va yozilishi', [['$2,350', 'two thousand three hundred fifty dollars'], ['1,000 miles', 'one thousand miles'], ['42,000 lbs', 'forty-two thousand pounds'], ['13', 'thirteen'], ['30', 'thirty']], 'Valyuta va o‘lchov birligini ham tekshiring.'),
    c('READ-MC', 'Quarter past', 'Pickup qaysi vaqtda?', '8:15 AM', '8:45 AM', '7:45 AM', 'quarter past eight — sakkizdan o‘n besh daqiqa o‘tgan.', 'Receiver: Please arrange pickup for a quarter past eight in the morning. The driver should check in ten minutes earlier.'),
    c('GAP', 'Vaqt oralig‘i', 'The pickup window is ___ 8 AM and 10 AM.', 'between', 'on', 'at', 'between ... and ... ikki chegara orasini bildiradi.'),
    t('TYPE', 'Sonni yozing', '1,450 ni inglizcha so‘zlar bilan yozing (valyutasiz).', [['Number in words', ['one thousand four hundred fifty', 'one thousand four hundred and fifty']]], 'one thousand + four hundred + fifty. and bilan yoki usiz yozish mumkin.'),
    o('Sana bilan on', ['The delivery', 'is', 'on', 'October 29th.'], 'Aniq sana oldidan on ishlatiladi.'),
    c('FIX', 'Sana va vaqt', 'We deliver at the 3 PM in October 5. gapini tuzating.', 'We deliver at 3 PM on October 5.', 'We deliver in 3 PM at October 5.', 'We deliver on the 3 PM in October 5.', 'Vaqt: at 3 PM; sana: on October 5.'),
    s('Raqamli ma’lumotlar', [['Money', ['$2,350', '$1,800']], ['Weight', ['42,000 lbs', '36,000 pounds']], ['Time', ['8:15 AM', 'between 9 and 11 AM']], ['Date', ['October 29', 'November 5']]], 'Pul, og‘irlik, vaqt va sanani ajrating.'),
    t('READ-TYPE', 'Taklifdagi uch son', 'Faqat raqamlarni kiriting; birliklar yorliqda berilgan.', [['Rate ($)', ['1800', '$1800', '$1,800']], ['Distance (miles)', ['900', '900 miles']], ['Weight (lbs)', ['36000', '36,000', '36000 lbs', '36,000 lbs']]], 'Rate — narx, miles — masofa, lbs — og‘irlik.', 'Load offer\nRate: $1,800\nDistance: 900 miles\nWeight: 36,000 lbs\nPickup: October 29, 8–10 AM'),
    scene('Raqamlarni qayta tasdiqlang', [
      ['Broker: The rate is $2,350. Narxni tasdiqlang.', 'Just to confirm, the rate is two thousand three hundred fifty dollars.', 'The rate is two thousand thirty-five dollars.', 'The rate is three thousand two hundred fifty dollars.'],
      ['Broker: It is 1,000 miles. Masofani tasdiqlang.', 'The distance is one thousand miles.', 'The distance is one hundred miles.', 'The weight is one thousand dollars.'],
      ['Broker: Pickup is between 8 and 10 AM on October 29. Mos tasdiqni tanlang.', 'Pickup is on October 29, between 8 and 10 AM.', 'Pickup is on October 29 at 10 PM.', 'Pickup is on October 28, between 8 and 10 AM.'],
    ], 'Sonni, birlikni, AM/PM ni va sanani o‘zgartirmang.'),
  ],
  M2L04: [
    m('NATO harflari', [['K', 'Kilo'], ['T', 'Tango'], ['D', 'Delta'], ['B', 'Bravo'], ['M', 'Mike'], ['I', 'India']], 'Nazariyada berilgan olti harfning kod so‘zlarini eslang.'),
    c('MC', 'B harfini aniqlang', 'B harfi uchun qaysi ifoda to‘g‘ri?', 'B as in Bravo', 'B as in Delta', 'B as in Mike', 'B — Bravo; D — Delta; M — Mike.'),
    c('READ-MC', 'Harflarni o‘qing', 'Yozma spell-back qaysi harflarni bildiradi?', 'DT', 'BT', 'KT', 'Delta — D; Tango — T.', 'Dispatcher: Delta, Tango. Let me confirm: D as in Delta, T as in Tango.'),
    t('READ-TYPE', 'Identifikatorni yozing', 'Harflar va raqamlarni bitta ID qilib yozing.', [['Load ID', ['KT4821', 'KT 4821', 'KT-4821']]], 'Kilo K, Tango T; four eight two one = 4821.', 'Reference: Kilo, Tango, four, eight, two, one. Please read the reference back.'),
    c('GAP', 'Aniqlik kiriting', 'Let me ___ that: DT5062.', 'confirm', 'confirms', 'confirmed', 'Let me dan keyin fe’lning asosiy shakli keladi.'),
    t('TYPE', 'Ismni harflang', 'Rol kartasidagi KIM ismini uchta NATO so‘zi bilan yozing.', [['KIM → NATO words', ['Kilo India Mike', 'Kilo, India, Mike', 'K as in Kilo I as in India M as in Mike']]], 'Harflar tartibi: K, I, M. Bo‘shliq yoki vergul bilan ajrating.', 'Contact name: KIM\nReference: K = Kilo; I = India; M = Mike'),
    c('FIX', 'Tasdiqlash savoli', 'That is M like Mike? o‘rniga standart savolni tanlang.', 'Is that M as in Mike?', 'Is M that in Mike?', 'That as Mike is M?', 'Is that + harf + as in + kod so‘zi?'),
    o('D harfini tekshiring', ['Is that', 'D', 'as in', 'Delta?'], 'Tasdiqlash savoli Is that bilan boshlanadi.'),
    c('REPLY', 'Noto‘g‘ri harfni tuzating', 'Broker: B as in Bravo? Sizning ID D bilan boshlanadi.', 'No, D as in Delta.', 'Yes, B as in Bravo.', 'Yes, that is a number.', 'Noto‘g‘ri harfni rad eting va kerakli harfni kod so‘zi bilan ayting.'),
    scene('Kontaktni aniq saqlang', [
      ['Kontaktning ismi KIM. Uni NATO so‘zlari bilan tasdiqlang.', 'Kilo, India, Mike.', 'Kilo, Tango, Mike.', 'Delta, India, Bravo.'],
      ['ID: DT5062. Mos spell-back qaysi?', 'Delta Tango, five zero six two.', 'Bravo Tango, five zero six two.', 'Delta Tango, five six zero two.'],
      ['Phone: 202-555-0148. Raqamni to‘g‘ri qaytaring.', 'Two zero two, five five five, zero one four eight.', 'Two zero two, five five five, zero one eight four.', 'Two zero two, five five five, one zero four eight.'],
    ], 'Harflar, raqamlar va ularning tartibini alohida tekshiring.'),
  ],
  M2L05: [
    c('MC', 'Suhbatni yakunlang', 'Yordam olgandan so‘ng qaysi yakun mos?', 'Thank you for your help. Have a good day.', 'Hold on forever.', 'What do you want now?', 'Yakunlashda rahmat ayting va muloyim xayrlashing.'),
    m('Telefon iboralari', [['Put a caller on hold', 'Could you hold for a moment?'], ['Transfer a call', 'I will transfer you to dispatch.'], ['Take a message', 'Would you like to leave a message?'], ['Ask someone to repeat', 'Could you repeat that, please?']], 'Kutish, o‘tkazish, xabar olish va takrorlashni farqlang.'),
    c('READ-MC', 'Qo‘ng‘iroq natijasi', 'Suhbat qanday yakunlandi?', 'Maya left a message for dispatch.', 'Maya spoke directly to dispatch.', 'The load was cancelled.', 'Dispatcher mavjud emas; receptionist xabarni yozib oldi.', 'Maya: Could I speak with dispatch?\nReceptionist: They are unavailable. May I take a message?\nMaya: Please ask them to call me about load 624.\nReceptionist: Certainly, I have written that down.'),
    c('GAP', 'Qo‘ng‘iroqni o‘tkazing', "I'll ___ you to Mr. Brown.", 'transfer', 'transferring', 'transferred', 'will dan keyin fe’lning asosiy shakli keladi.'),
    o('Sekinroq gapiring', ['Could you', 'speak', 'a little', 'slower?'], 'Could you ...? — muloyim iltimos.'),
    c('FIX', 'Ismni tushunmadingiz', 'I am not catch your name. gapini tuzating.', "I didn't catch your name.", "I didn't caught your name.", 'I not catching your name.', 'did not dan keyin catch; o‘tgan suhbat detalini tushunmadingiz.'),
    c('REPLY', 'Xabar qoldirish', 'Receptionist: Maya is unavailable. Would you like to leave a message?', 'Yes, please ask her to call Aziz about load 624.', 'No, I am Maya now.', 'Transfer me yesterday.', 'Kimga, kimdan va nima haqida xabar ekanini aniq ayting.'),
    s('Suhbat bosqichlari', [['Opening', ['Good morning, this is Aziz.', 'Coliseum Logistics, how may I help you?']], ['Middle', ['Could you hold for a moment?', 'I will transfer you to dispatch.', 'Could you repeat the number?', 'May I take a message?']], ['Closing', ['Thank you for your help.', 'Have a good day. Goodbye.']]], 'Salomlashuv — opening; ish tafsilotlari — middle; xayrlashuv — closing.'),
    t('READ-TYPE', 'Voicemail kartasi', 'Qo‘ng‘iroq qilgan shaxs va qaytish raqamini yozing.', [['Caller name', 'Maya Reed'], ['Callback number', ['202-555-0148', '2025550148', '202 555 0148', '(202) 555-0148']]], 'Xabar raqami bilan telefon raqamini aralashtirmang.', 'Hello, this is Maya Reed from Northline Freight. Please call me back at 202-555-0148 about load 624. Thank you.'),
    scene('Kerakli odamga ulaning', [
      ['Siz dispatchga qo‘ng‘iroq qildingiz, safety bo‘limi javob berdi.', 'Could you transfer me to dispatch, please?', 'You must be the dispatcher.', 'Cancel the call and the load.'],
      ['Safety: Certainly. Could you hold for a moment?', 'Of course, thank you.', 'I already delivered the load.', 'Your phone number is wrong.'],
      ['Dispatch band. Receptionist: May I take a message?', 'Yes. This is Aziz. Please call me about load 624 at 202-555-0148.', 'Just say someone called.', 'I will transfer you to myself.'],
    ], 'O‘tkazishni so‘rang → kutishga rozilik → aniq xabar.'),
  ],
  M2L06: [
    m('Formadagi qisqartmalar', [['PU', 'Pickup'], ['DEL', 'Delivery'], ['FCFS', 'First come, first served'], ['TBD', 'To be determined'], ['ETA', 'Estimated time of arrival'], ['N/A', 'Not applicable']], 'Qisqartmaning to‘liq ma’nosini tanlang.'),
    c('MC', 'Consignee kim?', 'Consignee maydoniga kim yoziladi?', 'The company receiving the goods', 'The company sending the goods', 'The driver’s safety officer', 'Consignee — yukni qabul qiluvchi tomon.'),
    c('READ-MC', 'Haydovchi bergan ma’lumot', 'Haydovchining javobi qaysi maydonni to‘ldiradi?', 'ETA', 'Commodity', 'Shipper', 'Estimated arrival — yetib kelishning taxminiy vaqti.', 'Dispatcher: When do you expect to arrive?\nDriver: My estimated arrival is 9:30 AM.\nDispatcher: I will update the form.'),
    t('FORM', 'BOL ma’lumotlari', 'Manbadagi oltita ma’lumotni formaga ko‘chiring.', [['Shipper', 'LakeFoods'], ['Consignee', 'MetroMarket'], ['Commodity', 'canned soup'], ['Qty (pallets)', ['16', '16 pallets']], ['Wt (lbs)', ['28000', '28,000', '28000 lbs', '28,000 lbs']], ['PO number', ['7306', 'PO7306', 'PO 7306']]], 'Qty — dona/pallet soni; Wt — og‘irlik; PO — buyurtma raqami.', 'Shipper: LakeFoods\nConsignee: MetroMarket\nCommodity: canned soup\nQuantity: 16 pallets\nWeight: 28,000 lbs\nPurchase order: 7306'),
    c('GAP', 'Pickup sanasi', 'Yukni olish sanasi maydoni: Date of ___: 10/29.', 'pickup', 'weight', 'quantity', 'Date of pickup — yukni olish sanasi; 10/29 bu October 29.'),
    t('TYPE', 'Ustun yorliqlari', 'Qty va Wt qisqartmalarini inglizcha to‘liq yozing.', [['Qty', 'quantity'], ['Wt', 'weight']], 'Qty yuk miqdorini, Wt og‘irligini bildiradi.'),
    c('FIX', 'Formani manba bilan solishtiring', 'Draft: Pickup 10/28; Weight 28,000 lbs. Qaysi tuzatish kerak?', 'Change pickup to 10/29; keep weight at 28,000 lbs.', 'Keep pickup at 10/28; change weight to 16 lbs.', 'Change pickup to 10/30; keep weight at 28,000 lbs.', 'Faqat manbaga zid maydonni tuzating.', 'Confirmed details: Pickup October 29 (10/29); Weight 28,000 lbs; Quantity 16 pallets.'),
    s('Forma bo‘limlari', [['Shipper', ['Sender name: LakeFoods', 'Sender address: 480 Oak Street', 'Pickup dock: 6']], ['Consignee', ['Receiver name: MetroMarket', 'Receiver address: 725 Pine Road', 'Delivery dock: 3']], ['Commodity', ['Product: canned soup', 'Quantity: 16 pallets', 'Weight: 28,000 lbs', 'Packaging: cartons']]], 'Sender/pickup — Shipper; receiver/delivery — Consignee; mahsulot va miqdor — Commodity.'),
    t('READ-TYPE', 'PO raqamini toping', 'Faqat purchase order raqamini kiriting.', [['PO number', ['7306', 'PO7306', 'PO 7306']]], 'PO ni seal yoki load raqami bilan aralashtirmang.', 'Load: 624\nPO: 7306\nSeal: 91842\nQuantity: 16 pallets'),
    scene('Haydovchi formasini tekshiring', [
      ['Source: LakeFoods sends goods to MetroMarket. Shipper maydonini to‘ldiring.', 'LakeFoods', 'MetroMarket', 'The driver'],
      ['Source: 16 pallets, 28,000 lbs. Qty maydonida 28,000 yozilgan. Tuzating.', 'Qty: 16 pallets; Wt: 28,000 lbs.', 'Qty: 28,000 pallets; Wt: 16 lbs.', 'Qty: 16 lbs; Wt: 28,000 pallets.'],
      ['Source: PO7306, pickup 10/29. Draft: PO7306, pickup 10/28. Yakuniy variant?', 'PO7306; pickup 10/29.', 'PO7306; pickup 10/28.', 'PO7036; pickup 10/29.'],
    ], 'Yorliq va manbani birga tekshiring; taxmin qilmang.'),
  ],
  M2L07: [
    c('MC', 'Aniq subject', 'Load 624 uchun rate confirmation so‘rash emailiga qaysi subject mos?', 'Rate confirmation request — Load 624', 'Hello!!!', 'Something important', 'Subject xabar maqsadi va load identifikatorini ko‘rsatadi.'),
    o('Email tuzilishi', ['Hello Maya,', 'I am writing about load 624.', 'Could you please send the rate confirmation?', 'Thank you, Aziz'], 'Greeting → purpose → request → closing.'),
    m('Email maqsadi', [['Request', 'Could you please send the rate confirmation?'], ['Thanks', 'Thank you for your help.'], ['Attachment', 'Please find attached the BOL.'], ['Reminder', 'I am following up on my previous email.']], 'So‘rov, minnatdorchilik, ilova va eslatmani ajrating.'),
    c('GAP', 'Ilovani bildiring', '___ find attached the BOL.', 'Please', 'Could', 'Thanks', 'Please find attached ... — ilova qilingan faylni bildiradi.'),
    t('TYPE', 'Muloyim so‘rov', 'Send the rate confirmation. gapini Could you please bilan boshlang.', [['Request', ['Could you please send the rate confirmation?', 'Could you please send me the rate confirmation?', 'Could you please send us the rate confirmation?']]], 'Could you please + send + the rate confirmation?'),
    c('FIX', 'Email ohangi', '“Send the BOL now!!!” o‘rniga muloyim ish so‘rovini tanlang.', 'Could you please send the BOL when you have a moment?', 'You must send it right now!!!', 'Where BOL? Send!', 'Buyruqni Could you please so‘roviga aylantiring.'),
    t('READ-TYPE', 'Subjectni ajrating', 'Subject qatorini aynan ko‘chiring.', [['Subject', 'BOL attached for load 624']], 'Greeting va body emas, faqat Subject qatorini yozing.', 'To: Maya Reed\nSubject: BOL attached for load 624\nHello Maya,\nPlease find attached the BOL.\nThank you,\nAziz'),
    c('REPLY', 'Emailga javob', 'Broker email: Could you send the signed BOL? Fayl javobingizga ilova qilingan.', 'Please find attached the signed BOL for load 624.', 'I have no idea what you want.', 'The rate is too low.', 'So‘ralgan hujjat ilova qilinganini aniq bildiring.'),
    c('READ-MC', 'Follow-up mavzusi', 'Xabarga eng mos subjectni tanlang.', 'Follow-up: rate confirmation for load 624', 'BOL attached for load 915', 'Driver birthday invitation', 'Matn oldingi rate confirmation so‘rovini eslatmoqda.', 'Hello Maya,\nI am following up on my earlier request for the rate confirmation for load 624. Could you please send it today?\nThank you,\nAziz'),
    scene('Uch qismli email', [
      ['Yozma email: load 624 uchun rate confirmation so‘raysiz. Subjectni tanlang.', 'Rate confirmation request — Load 624', 'Hi there', 'Phone transfer complete'],
      ['Email body: Maya bilan salomlashib, kerakli hujjatni so‘rang.', 'Hello Maya, could you please send the rate confirmation for load 624?', 'Send all papers NOW.', 'Could you hold while I transfer this call?'],
      ['Email closing: Aziz nomidan muloyim yakunlang.', 'Thank you for your help. Best regards, Aziz', 'Why are you so slow?', 'End of phone call.'],
    ], 'Bu yozma email: aniq subject → salomlashuv va so‘rov → muloyim yakun.'),
  ],
  M2L08: [
    c('MC', 'As discussed', 'Emaildagi “As discussed” nimani bildiradi?', 'Avval muhokama qilinganidek', 'Hali hech kim bilan gaplashilmadi', 'Kelishuv bekor qilindi', 'As discussed oldingi suhbat yoki kelishuvga ishora qiladi.'),
    m('Suhbatdan emailga', [['Call: pickup October 29 at 8 AM', 'Pickup is confirmed for October 29 at 8 AM.'], ['Call: delivery October 30 at 2 PM', 'Delivery is confirmed for October 30 at 2 PM.'], ['Call: agreed rate $2,350', 'The agreed rate is $2,350.'], ['Call: load reference 624', 'This confirmation is for load 624.']], 'Sana, vaqt, narx va reference o‘zgarmasligi kerak.'),
    c('READ-MC', 'Mos tasdiq', 'Kelishuvga aynan mos email jumlasi qaysi?', 'Pickup: October 29 at 8 AM; delivery: October 30 at 2 PM; rate: $2,350.', 'Pickup: October 28 at 8 AM; delivery: October 30 at 2 PM; rate: $2,350.', 'Pickup: October 29 at 8 PM; delivery: October 30 at 2 PM; rate: $2,530.', 'Har bir detalni manba bilan solishtiring.', 'Call notes — Load 624\nPickup: October 29, 8 AM\nDelivery: October 30, 2 PM\nAgreed rate: $2,350'),
    t('READ-TYPE', 'Emaildan detallar', 'Pickup vaqtini va narxni yozing.', [['Pickup time', ['8 AM', '8:00 AM', '08:00', '08:00 AM']], ['Rate ($)', ['2350', '2,350', '$2350', '$2,350']]], 'Pickup va delivery vaqtlarini aralashtirmang.', 'As discussed, pickup is on October 29 at 8 AM. Delivery is on October 30 at 2 PM. The agreed rate is $2,350. Please confirm receipt.'),
    c('GAP', 'Just to ...', 'Just to ___, pickup is at 8 AM.', 'confirm', 'confirmed', 'confirmation', 'to dan keyin fe’lning asosiy shakli: confirm.'),
    o('Tasdiqlash xati', ['Hello Maya,', 'As discussed, pickup is on October 29 at 8 AM.', 'The agreed rate is $2,350.', 'Please confirm receipt.', 'Best regards, Aziz'], 'Salomlashuv → pickup → narx → qabul tasdig‘i → yakun.'),
    c('FIX', 'Mos kelmagan detal', 'Draft email: pickup October 30, rate $2,530. To‘g‘ri variantni tanlang.', 'Pickup October 29, rate $2,350.', 'Pickup October 30, rate $2,350.', 'Pickup October 29, rate $2,530.', 'Ikkala xatoni ham manbaga qarab tuzating.', 'Agreed by phone: pickup October 29; rate $2,350.'),
    t('TYPE', 'Bir jumlada tasdiqlang', 'Just to confirm bilan boshlang: pickup = 8 AM. Bitta inglizcha gap yozing.', [['Confirmation sentence', ['Just to confirm, pickup is at 8 AM.', 'Just to confirm, the pickup is at 8 AM.', 'Just to confirm, pickup is at 8:00 AM.', 'Just to confirm, the pickup is at 8:00 AM.', 'Just to confirm, pickup is scheduled for 8 AM.']]], 'Qolip: Just to confirm, pickup is at + vaqt.', 'Agreed pickup time: 8 AM'),
    t('FORM', 'Tasdiqlash shabloni', 'Suhbat qaydidan email shablonining olti maydonini to‘ldiring.', [['Load reference', ['624', 'Load 624']], ['Pickup date', ['October 29', 'October 29th', '10/29']], ['Pickup time', ['8 AM', '8:00 AM', '08:00', '08:00 AM']], ['Delivery date', ['October 30', 'October 30th', '10/30']], ['Delivery time', ['2 PM', '2:00 PM', '14:00']], ['Agreed rate ($)', ['2350', '2,350', '$2350', '$2,350']]], 'Sana, AM/PM va narxni to‘liq saqlang.', 'Per our call — Load 624\nPickup: October 29 at 8 AM\nDelivery: October 30 at 2 PM\nRate: $2,350'),
    scene('Suhbatdan yozma tasdiqqa', [
      ['Call notes: load 624, pickup October 29 at 8 AM. Emailning birinchi gapini tanlang.', 'As discussed, pickup for load 624 is on October 29 at 8 AM.', 'As discussed, pickup for load 624 is on October 30 at 8 AM.', 'The pickup date is not known.'],
      ['Kelishilgan narx $2,350. Emailga mos gapni qo‘shing.', 'The agreed rate is $2,350.', 'The agreed rate is $2,530.', 'The agreed rate is $3,250.'],
      ['Detallar kiritildi. Xat olinganini tasdiqlashni so‘rab yakunlang.', 'Please confirm receipt. Thank you, Aziz.', 'No reply is ever needed.', 'I have changed the pickup without asking.'],
    ], 'Kelishuvni o‘zgartirmay yozing va xat qabul qilinganini tasdiqlashni so‘rang.'),
  ],
};
