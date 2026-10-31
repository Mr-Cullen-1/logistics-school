import React, { useEffect, useRef, useState } from "react";

export const meta = { type: "learn", lessonCode: "INTRO", seq: 0, skillTags: ["course_orientation"] };

const STYLES = `
  .intro-root{--background:#0d1114;--surface:#171b1e;--surface-elevated:#1d2226;--bronze:#c19a63;--bronze-light:#e0c28c;--ivory:#f3efe7;--foreground:#f5f3ee;--text-secondary:#b9bcbe;--line:#ffffff24;--success:#9cddb5;--warn:#f0bc84;--radius:12px;--font-sans:Geist,system-ui,sans-serif;box-sizing:border-box;width:100%;height:100dvh;min-height:560px;display:flex;flex-direction:column;overflow:hidden;background:var(--background);color:var(--foreground);font-family:var(--font-sans);padding:clamp(12px,2.5vh,22px);gap:clamp(8px,1.5vh,16px)}
  .intro-root *{box-sizing:border-box}.intro-root button{font:inherit;cursor:pointer}.intro-root button:focus-visible{outline:3px solid var(--bronze-light);outline-offset:2px}.intro-root button:disabled{cursor:not-allowed;opacity:.45}.intro-head,.intro-foot{display:flex;align-items:center;justify-content:space-between;gap:10px;flex:none}.intro-eyebrow{color:var(--bronze-light);font-size:12px;font-weight:700;letter-spacing:.12em;text-transform:uppercase}.intro-count{color:var(--text-secondary);font-size:13px}.intro-progress{display:flex;gap:5px}.intro-dot{width:16px;height:4px;border-radius:4px;background:#454b4e}.intro-dot.on{background:var(--bronze)}
  .intro-body{flex:1;min-height:0;display:flex;flex-direction:column;justify-content:center;gap:clamp(8px,1.7vh,16px);max-width:960px;width:100%;margin:0 auto}.intro-title{font-size:clamp(22px,3vw,38px);letter-spacing:-.025em;line-height:1.1;margin:0;font-weight:600}.intro-sub{font-size:clamp(13px,1.5vw,16px);color:var(--text-secondary);line-height:1.35;margin:0}.intro-kicker{color:var(--bronze-light);font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.08em}.intro-panel,.intro-card{border:1px solid var(--line);border-radius:var(--radius);background:var(--surface);padding:clamp(9px,1.5vh,16px)}.intro-english{font-size:clamp(15px,2.1vw,22px);font-weight:600;line-height:1.25}.intro-muted{color:var(--text-secondary);font-size:clamp(12px,1.3vw,14px);line-height:1.3}.intro-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}.intro-grid.three{grid-template-columns:repeat(3,minmax(0,1fr))}.intro-list{display:grid;gap:6px}.intro-choice{min-height:44px;width:100%;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--foreground);padding:8px 11px;text-align:left;line-height:1.22;display:flex;align-items:center;justify-content:space-between;gap:8px}.intro-choice:hover,.intro-choice.selected{border-color:var(--bronze);background:var(--surface-elevated)}.intro-choice.matched{border-color:var(--success)}.intro-choice.wrong{border-color:var(--warn)}.intro-choice strong{font-size:clamp(12px,1.3vw,15px);font-weight:600}.intro-choice small{display:block;color:var(--text-secondary);font-size:11px;margin-top:3px}.intro-card-button{display:block;min-height:64px}.intro-feedback{min-height:22px;color:var(--bronze-light);font-size:13px;line-height:1.25}.intro-feedback.good{color:var(--success)}.intro-feedback.bad{color:var(--warn)}.intro-link{border:0;background:none;color:var(--bronze-light);padding:4px 0;text-decoration:underline}.intro-primary,.intro-secondary{min-height:44px;border-radius:12px;padding:9px 18px;font-weight:600}.intro-primary{border:1px solid var(--bronze);background:var(--bronze);color:var(--background)}.intro-primary:hover{background:var(--bronze-light)}.intro-secondary{border:1px solid var(--line);background:var(--surface);color:var(--foreground)}.intro-role-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px}.intro-role-column{display:grid;gap:5px}.intro-summary{display:grid;grid-template-columns:1fr 1fr;gap:8px}.intro-lang{min-height:44px;border:1px solid var(--line);border-radius:9px;background:var(--surface);color:var(--foreground);padding:4px 8px}.intro-root p{margin:0}.intro-root h2{margin:0;font-size:inherit}.intro-root ul{margin:0;padding-left:18px}.intro-root li{margin:2px 0}
  @media(max-width:600px){.intro-root{padding:10px;gap:7px;min-height:0}.intro-body{gap:7px}.intro-grid.three{grid-template-columns:1fr}.intro-card{padding:8px}.intro-card-button{min-height:58px}.intro-choice{padding:6px 8px}.intro-english{font-size:15px}.intro-role-grid{gap:5px}.intro-role-column{gap:4px}.intro-feedback{font-size:12px}.intro-summary{gap:5px}}
  @media(max-height:700px){.intro-root{padding-top:8px;padding-bottom:8px;gap:5px}.intro-body{gap:5px}.intro-title{font-size:clamp(21px,2.4vw,30px)}.intro-panel,.intro-card{padding:8px}.intro-choice{min-height:44px}.intro-kicker{font-size:11px}}
  .intro-root{min-height:640px}.intro-link{min-height:44px}.intro-root [hidden]{display:none!important}
  @media(prefers-reduced-motion:reduce){.intro-root *{animation:none!important;transition:none!important;scroll-behavior:auto!important}}
`;

const UI = {
  uz: { back: "Orqaga", next: "Davom etish", finish: "Birinchi darsni boshlash", translation: "Tarjima", hide: "Tarjimani yashirish", select: "Tanlang", selected: "Tanlandi", open: "Ochish", opened: "Ochildi", intro: "Kirish darsi", summaryGoals: "Siz tanlagan maqsadlar", summaryStruggles: "Eng qiyin vaziyatlar", complete: "Intro yakunlandi" },
  ru: { back: "Назад", next: "Далее", finish: "Начать первый урок", translation: "Перевод", hide: "Скрыть перевод", select: "Выбрать", selected: "Выбрано", open: "Открыть", opened: "Открыто", intro: "Вводный урок", summaryGoals: "Ваши цели", summaryStruggles: "Самые трудные ситуации", complete: "Введение завершено" },
  en: { back: "Back", next: "Continue", finish: "Start the first lesson", translation: "Translation", hide: "Hide translation", select: "Select", selected: "Selected", open: "Open", opened: "Opened", intro: "Introduction", summaryGoals: "Your goals", summaryStruggles: "Most difficult situations", complete: "Intro completed" },
};

const C = {
  s1: {
    title: { uz: "Telefon jiringlayapti", ru: "Звонит телефон", en: "The phone is ringing" },
    question: { uz: "Siz nima qilasiz?", ru: "Что вы сделаете?", en: "What would you do?" },
    message: "Hi, this is Mike from FastLoad. Where is my truck? The receiver closes at 4 AM!",
    translation: { uz: "Salom, men FastLoad'dan Mayk. Mening yukim qayerda? Qabul qiluvchi ertalab soat 4 da yopiladi!", ru: "Привет, это Майк из FastLoad. Где мой трак? Получатель закрывается в 4 утра!", en: "Mike needs the truck's location before the receiver closes." },
    choices: [
      { id: "A", label: { uz: "Qo'ng'iroqni ko'tarmayman", ru: "Не отвечу на звонок", en: "I won't answer" }, feedback: { uz: "Yuk kechikadi, broker sizga ishonmay qo'yadi. Bu eng qimmat tanlov.", ru: "Груз опоздает, а брокер перестанет вам доверять. Это самый дорогой выбор.", en: "The load is delayed and the broker loses trust. Silence costs you." } },
      { id: "B", label: { uz: "Tushunmay turib «Yes, yes…» deyman", ru: "Скажу «Yes, yes…», не поняв", en: "I say ‘Yes, yes…’ without understanding" }, feedback: { uz: "Mayk sizni tushundi deb o'ylaydi. Aytilmagan vaqt va'dasi muammoga aylanadi.", ru: "Майк решит, что вы всё поняли. Неясное время прибытия станет новой проблемой.", en: "Mike thinks you understood. An unclear arrival time becomes a new problem." } },
      { id: "C", label: "I'm 40 minutes out. I'll be there by 3:30.", feedback: { uz: "Kurs sizni shunday aniq javobga tayyorlaydi: 40 daqiqa naridasiz, 3:30 gacha yetasiz.", ru: "Курс готовит к такому точному ответу: вы в 40 минутах и приедете к 3:30.", en: "This course prepares you to give a clear location and arrival time." } },
    ],
  },
  s2: { title: { uz: "Ingliz tili har kuni kerak", ru: "Английский нужен каждый день", en: "English matters every day" }, instruction: { uz: "Har bir kartani bosing.", ru: "Нажмите на каждую карточку.", en: "Open every card." }, done: { uz: "Bular real iboralar. Kursda ularni o'zingiz ishlatasiz.", ru: "Это реальные фразы. На курсе вы будете использовать их сами.", en: "These are real phrases. You will use them yourself." }, cards: [
    { kind: { uz: "Chat · Dispatcher va Driver", ru: "Чат · Диспетчер и водитель", en: "Chat · Dispatcher and driver" }, en: "What's your ETA? / I'm 30 minutes out.", tr: { uz: "ETA qancha? / 30 daqiqa qoldi.", ru: "Какое у вас ETA? / Я в 30 минутах.", en: "ETA means estimated time of arrival." } },
    { kind: { uz: "Qo'ng'iroq · Broker", ru: "Звонок · Брокер", en: "Call · Broker" }, en: "Is the load still available? What's your MC number?", tr: { uz: "Yuk hali bormi? MC raqamingiz qancha?", ru: "Груз ещё свободен? Какой у вас MC-номер?", en: "The broker asks about the load and carrier number." } },
    { kind: { uz: "Email · Shipper", ru: "Email · Отправитель", en: "Email · Shipper" }, en: "Please find attached the BOL. Could you confirm the pickup time?", tr: { uz: "BOL ilova qilindi. Pickup vaqtini tasdiqlaysizmi?", ru: "BOL во вложении. Подтвердите время погрузки?", en: "The shipper sends a BOL and asks about pickup." } },
  ] },
  s3: { title: { uz: "Siz kim bilan gaplashasiz?", ru: "С кем вы разговариваете?", en: "Who are you speaking with?" }, instruction: { uz: "Avval iborani, keyin mos rolni bosing.", ru: "Сначала выберите фразу, затем подходящую роль.", en: "Choose a phrase, then match its role." }, choosePhrase: { uz: "Avval iborani tanlang.", ru: "Сначала выберите фразу.", en: "Choose a phrase first." }, wrong: { uz: "Bu rolning vazifasini yana tekshiring.", ru: "Проверьте обязанности этой роли ещё раз.", en: "Check what this role does and try again." }, roles: [
    { id: "broker", name: "Broker", desc: { uz: "yuk va tashuvchi o'rtasidagi vositachi", ru: "посредник между грузом и перевозчиком", en: "connects the load and carrier" }, phrase: "What's your MC number?", why: { uz: "MC raqamini vositachi broker tekshiradi.", ru: "MC-номер проверяет брокер-посредник.", en: "The broker checks the carrier's MC number." } },
    { id: "driver", name: "Driver", desc: { uz: "haydovchi", ru: "водитель", en: "drives the truck" }, phrase: "I'm 30 minutes out.", why: { uz: "O'z joyini haydovchi biladi.", ru: "Своё местоположение знает водитель.", en: "The driver knows their location." } },
    { id: "shipper", name: "Shipper", desc: { uz: "yukni jo'natuvchi", ru: "отправитель груза", en: "sends the load" }, phrase: "Pickup is at door 5.", why: { uz: "Yuk ortiladigan eshikni jo'natuvchi ko'rsatadi.", ru: "Ворота погрузки указывает отправитель.", en: "The shipper gives the pickup door." } },
    { id: "receiver", name: "Receiver", desc: { uz: "yukni qabul qiluvchi", ru: "получатель груза", en: "receives the load" }, phrase: "We close at 4 PM.", why: { uz: "Qabul qiluvchi ombor ish vaqtini belgilaydi.", ru: "Часы работы определяет склад получателя.", en: "The receiver sets the warehouse hours." } },
    { id: "dispatcher", name: "Dispatcher", desc: { uz: "haydovchini yo'naltiruvchi", ru: "направляет водителя", en: "guides the driver" }, phrase: "Check in when you arrive.", why: { uz: "Haydovchiga ko'rsatmani dispatcher beradi.", ru: "Указания водителю даёт диспетчер.", en: "The dispatcher gives the driver instructions." } },
  ] },
  s4: { title: { uz: "6 ta vaziyat", ru: "6 ситуаций", en: "Six situations" }, question: { uz: "Qaysi vaziyatlarda qiyinroq? 1–3 tasini tanlang.", ru: "Какие ситуации сложнее? Выберите 1–3.", en: "Which situations are hardest? Choose 1–3." }, items: [
    { id: "load", label: { uz: "Load olish", ru: "Взять груз", en: "Booking a load" }, example: "I can cover that load.", where: "Module 4 · Load Booking" },
    { id: "pickup", label: { uz: "Pickup va delivery", ru: "Погрузка и доставка", en: "Pickup and delivery" }, example: "I'll be at the dock by 8 AM.", where: "Modules 3–4 · Pickup and Delivery" },
    { id: "delay", label: { uz: "Kechikish", ru: "Опоздание", en: "Delays" }, example: "We're running late due to traffic.", where: "Modules 3–4 · Delays" },
    { id: "rate", label: { uz: "Rate", ru: "Ставка", en: "Rates" }, example: "The best I can do is $2,600.", where: "Modules 1–4 · Negotiation" },
    { id: "documents", label: { uz: "Hujjatlar", ru: "Документы", en: "Documents" }, example: "Please send the rate confirmation.", where: "Modules 2–3 · Forms" },
    { id: "problem", label: { uz: "Muammo", ru: "Проблема", en: "Problems" }, example: "The truck broke down.", where: "Module 4 · Emergencies" },
  ] },
  s5: { title: { uz: "Bitta so'z qimmatga tushadi", ru: "Одно слово может стоить дорого", en: "One word can cost money" }, badge: { uz: "O'quv misoli", ru: "Учебный пример", en: "Learning example" }, context: { uz: "Haydovchi «all-in» ni bilmadi va yoqilg'i uchun alohida to'lov kutdi.", ru: "Водитель не знал «all-in» и ждал отдельной оплаты топлива.", en: "The driver did not know ‘all-in’ and expected a separate fuel payment." }, question: { uz: "«All-in» nimani anglatadi?", ru: "Что значит «all-in»?", en: "What does ‘all-in’ mean?" }, ending: { uz: "Kutilgan qo'shimcha to'lov bo'lmaydi. Bitta so'z, haqiqiy pul.", ru: "Ожидаемой доплаты не будет. Одно слово — реальные деньги.", en: "There is no extra payment. One word changes the deal." }, choices: [
    { id: "A", label: { uz: "Hamma xarajat narxga kiritilgan", ru: "Все расходы включены в ставку", en: "All costs are included" }, feedback: { uz: "To'g'ri. Yoqilg'i va boshqa to'lovlar shu narx ichida.", ru: "Верно. Топливо и другие платежи уже включены.", en: "Correct. Fuel and other costs are included in this rate." } },
    { id: "B", label: { uz: "Faqat yo'l haqi", ru: "Только плата за рейс", en: "Only the line haul" }, feedback: { uz: "Bu line haul. All-in undan kengroq.", ru: "Это line haul. All-in шире.", en: "That is line haul. All-in includes more." } },
    { id: "C", label: { uz: "Yoqilg'i alohida to'lanadi", ru: "Топливо оплачивается отдельно", en: "Fuel is paid separately" }, feedback: { uz: "Aksincha. Haydovchi aynan shu yerda adashdi.", ru: "Наоборот. Именно здесь водитель ошибся.", en: "It is the opposite. This is the driver's mistake." } },
  ] },
  s6: { title: { uz: "Kurs yo'li", ru: "Путь курса", en: "Your course path" }, instruction: { uz: "To'rt modulni ochib ko'ring.", ru: "Откройте все четыре модуля.", en: "Open all four modules." }, modules: [
    { name: "English Foundations", outcome: { uz: "Gap va savolni tez tuzasiz", ru: "Быстро строите фразы и вопросы", en: "Build clear sentences and questions" }, example: "Has the driver arrived yet?" },
    { name: "Everyday Communication", outcome: { uz: "Telefon, forma va qisqa email", ru: "Телефон, формы и короткие письма", en: "Calls, forms, and short emails" }, example: "Could you spell your name, please?" },
    { name: "Workplace Communication", outcome: { uz: "Hujjatlarni o'qib, vaziyatni tushuntirasiz", ru: "Читаете документы и объясняете ситуацию", en: "Read documents and explain situations" }, example: "We were held up at the shipper." },
    { name: "Professional Logistics English", outcome: { uz: "Broker bilan professional muloqot", ru: "Профессиональный разговор с брокером", en: "Speak professionally with brokers" }, example: "If you can do $2,700, I can book it." },
  ] },
  s7: { title: { uz: "Maqsadingiz nima?", ru: "Чего вы хотите достичь?", en: "What is your goal?" }, question: { uz: "Kurs oxirida nimani qila olishni xohlaysiz? 1–3 tasini tanlang.", ru: "Что вы хотите уметь к концу курса? Выберите 1–3.", en: "What do you want to do by the end? Choose 1–3." }, goals: [
    { id: "understand_loads", en: "I can understand load details.", tr: { uz: "Load ma'lumotlarini tushunaman.", ru: "Понимаю данные по грузу.", en: "Understand load details." } },
    { id: "talk_to_brokers", en: "I can talk to brokers confidently.", tr: { uz: "Brokerlar bilan ishonchli gaplashaman.", ru: "Уверенно говорю с брокерами.", en: "Talk to brokers with confidence." } },
    { id: "write_emails", en: "I can write professional emails.", tr: { uz: "Professional email yozaman.", ru: "Пишу профессиональные письма.", en: "Write professional emails." } },
    { id: "negotiate_rate", en: "I can negotiate a rate.", tr: { uz: "Rate bo'yicha muzokara qilaman.", ru: "Веду переговоры о ставке.", en: "Negotiate a rate." } },
    { id: "solve_phone_problems", en: "I can solve problems on the phone.", tr: { uz: "Telefonda muammolarni hal qilaman.", ru: "Решаю проблемы по телефону.", en: "Solve problems on the phone." } },
  ] },
  s8: { title: { uz: "Dars qanday ishlaydi", ru: "Как проходит урок", en: "How a lesson works" }, steps: [
    { name: "Learn", desc: { uz: "Yangi mavzuni o'qiysiz va harakat qilasiz.", ru: "Изучаете тему и выполняете действия.", en: "Read and interact with the new topic." } },
    { name: "Practice", desc: { uz: "10 ta qisqa topshiriqni tekshirasiz.", ru: "Проверяете 10 коротких заданий.", en: "Check 10 short tasks." } },
    { name: "Next", desc: { uz: "Admin ochgan keyingi darsga o'tasiz.", ru: "Переходите к уроку, открытому админом.", en: "Continue when the admin opens the next lesson." } },
  ], notes: { uz: "Xato qilish normal: izohni o'qing va qayta urinib ko'ring. Kursda ovoz yo'q; iboralarni o'zingiz ovoz chiqarib o'qing. Yopiq dars ko'rinmaydi.", ru: "Ошибаться нормально: прочитайте пояснение и попробуйте снова. В курсе нет звука; произносите фразы вслух сами. Закрытый урок не виден.", en: "Mistakes are normal: read the explanation and try again. The course has no sound; say the phrases aloud yourself. Closed lessons are hidden." } },
  s9: { title: { uz: "Boshlaymiz", ru: "Начинаем", en: "Let's begin" }, promise: "In 32 lessons, I'll be able to handle real logistics calls.", tr: { uz: "32 darsdan keyin real logistika qo'ng'iroqlarini uddalay olaman.", ru: "Через 32 урока я смогу вести реальные логистические звонки.", en: "After 32 lessons, I can handle real logistics calls." } },
};

const tx = (value, lang) => typeof value === "string" ? value : value?.[lang] || value?.uz || "";
const toggleLimited = (items, id) => items.includes(id) ? items.filter((item) => item !== id) : items.length < 3 ? [...items, id] : items;

export default function Lesson({ lang: suppliedLang, onFinished }) {
  const [previewLang, setPreviewLang] = useState("uz");
  const lang = ["uz", "ru", "en"].includes(suppliedLang) ? suppliedLang : previewLang;
  const ui = UI[lang];
  const [current, setCurrent] = useState(0);
  const [showTranslation, setShowTranslation] = useState(false);
  const [firstReaction, setFirstReaction] = useState("");
  const [flipped, setFlipped] = useState([]);
  const [selectedPhrase, setSelectedPhrase] = useState("");
  const [matched, setMatched] = useState([]);
  const [pairAttempts, setPairAttempts] = useState({});
  const [matchFirstTry, setMatchFirstTry] = useState(0);
  const [pairFeedback, setPairFeedback] = useState(null);
  const [struggles, setStruggles] = useState([]);
  const [costChoice, setCostChoice] = useState("");
  const [costFirstTry, setCostFirstTry] = useState(null);
  const [openedModules, setOpenedModules] = useState([]);
  const [goals, setGoals] = useState([]);
  const [finished, setFinished] = useState(false);
  const startedAt = useRef(0);
  const finishedRef = useRef(false);
  useEffect(() => { startedAt.current = Date.now(); }, []);
  const gates = [!!firstReaction, flipped.length === 3, matched.length === 5, struggles.length > 0, costChoice === "A", openedModules.length === 4, goals.length > 0, true, true];

  function matchRole(roleId) {
    if (!selectedPhrase) { setPairFeedback({ text: C.s3.choosePhrase, good: false }); return; }
    if (roleId === selectedPhrase) {
      if (!matched.includes(roleId)) {
        setMatched((previous) => [...previous, roleId]);
        if (!pairAttempts[selectedPhrase]) setMatchFirstTry((count) => count + 1);
      }
      setPairFeedback({ text: C.s3.roles.find((role) => role.id === roleId).why, good: true });
      setSelectedPhrase("");
    } else {
      setPairAttempts((previous) => ({ ...previous, [selectedPhrase]: (previous[selectedPhrase] || 0) + 1 }));
      setPairFeedback({ text: C.s3.wrong, good: false });
    }
  }

  function finish() {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFinished(true);
    onFinished?.({
      lessonId: "INTRO", lessonTitle: "English for Logistics: The Why",
      durationSec: Math.max(0, Math.round((Date.now() - startedAt.current) / 1000)),
      totalQuestions: 0, correctAnswers: 0, scorePercent: 100, passed: true,
      firstTryStats: { total: 6, firstTryCorrect: matchFirstTry + (costFirstTry ? 1 : 0) },
      skillTags: ["course_orientation"], answers: [],
      profile: { firstReaction, struggles, goals },
    });
  }

  function screen() {
    if (current === 0) return <><span className="intro-kicker">02:00 · FastLoad</span><h1 className="intro-title">{tx(C.s1.title, lang)}</h1><div className="intro-panel"><div className="intro-muted">Mike · Broker</div><p className="intro-english">{C.s1.message}</p><button className="intro-link" type="button" aria-expanded={showTranslation} onClick={() => setShowTranslation(!showTranslation)}>{showTranslation ? ui.hide : ui.translation}</button>{showTranslation && <p className="intro-muted">{tx(C.s1.translation, lang)}</p>}</div><p className="intro-sub">{tx(C.s1.question, lang)}</p><div className="intro-list">{C.s1.choices.map((choice) => <button className={`intro-choice ${firstReaction === choice.id ? "selected" : ""}`} type="button" aria-pressed={firstReaction === choice.id} key={choice.id} onClick={() => setFirstReaction(choice.id)}><strong>{choice.id}. {tx(choice.label, lang)}</strong><span>{firstReaction === choice.id ? "✓" : "○"}</span></button>)}</div><div className="intro-feedback" aria-live="polite">{firstReaction && tx(C.s1.choices.find((choice) => choice.id === firstReaction).feedback, lang)}</div></>;
    if (current === 1) return <><h1 className="intro-title">{tx(C.s2.title, lang)}</h1><p className="intro-sub">{tx(C.s2.instruction, lang)}</p><div className="intro-list">{C.s2.cards.map((card, index) => <button className={`intro-choice intro-card-button ${flipped.includes(index) ? "selected" : ""}`} type="button" aria-expanded={flipped.includes(index)} key={index} onClick={() => setFlipped((previous) => previous.includes(index) ? previous : [...previous, index])}><span><small>{tx(card.kind, lang)}</small><strong className="intro-english">{card.en}</strong><small hidden={!flipped.includes(index)} aria-hidden={!flipped.includes(index)}>{tx(card.tr, lang)}</small></span><span>{flipped.includes(index) ? "✓" : "+"}</span></button>)}</div><div className="intro-feedback good" aria-live="polite">{flipped.length === 3 && tx(C.s2.done, lang)}</div></>;
    if (current === 2) return <><h1 className="intro-title">{tx(C.s3.title, lang)}</h1><p className="intro-sub">{tx(C.s3.instruction, lang)}</p><div className="intro-role-grid"><div className="intro-role-column">{C.s3.roles.map((role) => <button className={`intro-choice ${selectedPhrase === role.id ? "selected" : ""} ${matched.includes(role.id) ? "matched" : ""}`} type="button" key={role.id} disabled={matched.includes(role.id)} aria-pressed={selectedPhrase === role.id} onClick={() => { setSelectedPhrase(role.id); setPairFeedback(null); }}><strong>{role.phrase}</strong><span>{matched.includes(role.id) ? "✓" : "→"}</span></button>)}</div><div className="intro-role-column">{[2, 0, 4, 1, 3].map((index) => { const role = C.s3.roles[index]; return <button className={`intro-choice ${matched.includes(role.id) ? "matched" : ""}`} type="button" key={role.id} disabled={matched.includes(role.id)} onClick={() => matchRole(role.id)}><span><strong>{role.name}</strong><small>{tx(role.desc, lang)}</small></span><span>{matched.includes(role.id) ? "✓" : "○"}</span></button>; })}</div></div><div className={`intro-feedback ${pairFeedback?.good ? "good" : "bad"}`} aria-live="polite">{pairFeedback && tx(pairFeedback.text, lang)}</div></>;
    if (current === 3) return <><h1 className="intro-title">{tx(C.s4.title, lang)}</h1><p className="intro-sub">{tx(C.s4.question, lang)}</p><div className="intro-grid">{C.s4.items.map((item) => <button className={`intro-choice intro-card-button ${struggles.includes(item.id) ? "selected" : ""}`} type="button" key={item.id} aria-pressed={struggles.includes(item.id)} onClick={() => setStruggles((previous) => toggleLimited(previous, item.id))}><span><strong>{tx(item.label, lang)}</strong><small>{item.example}</small>{struggles.includes(item.id) && <small>{item.where}</small>}</span><span>{struggles.includes(item.id) ? "✓" : "+"}</span></button>)}</div></>;
    if (current === 4) return <><span className="intro-kicker">{tx(C.s5.badge, lang)}</span><h1 className="intro-title">{tx(C.s5.title, lang)}</h1><div className="intro-panel"><p className="intro-english">Rate: $2,150 all-in.</p><p className="intro-muted">{tx(C.s5.context, lang)}</p></div><p className="intro-sub">{tx(C.s5.question, lang)}</p><div className="intro-list">{C.s5.choices.map((choice) => <button className={`intro-choice ${costChoice === choice.id ? (choice.id === "A" ? "matched" : "wrong") : ""}`} type="button" key={choice.id} aria-pressed={costChoice === choice.id} onClick={() => { if (costFirstTry === null) setCostFirstTry(choice.id === "A"); setCostChoice(choice.id); }}><strong>{choice.id}. {tx(choice.label, lang)}</strong><span>{costChoice === choice.id ? (choice.id === "A" ? "✓" : "!") : "○"}</span></button>)}</div><div className={`intro-feedback ${costChoice === "A" ? "good" : "bad"}`} aria-live="polite">{costChoice && <>{tx(C.s5.choices.find((choice) => choice.id === costChoice).feedback, lang)} {costChoice === "A" && tx(C.s5.ending, lang)}</>}</div></>;
    if (current === 5) return <><h1 className="intro-title">{tx(C.s6.title, lang)}</h1><p className="intro-sub">{tx(C.s6.instruction, lang)}</p><div className="intro-kicker">INTRO · {ui.intro} ✓</div><div className="intro-list">{C.s6.modules.map((module, index) => <button className={`intro-choice ${openedModules.includes(index) ? "selected" : ""}`} type="button" key={index} aria-expanded={openedModules.includes(index)} onClick={() => setOpenedModules((previous) => previous.includes(index) ? previous : [...previous, index])}><span><strong>{index + 1}. {module.name}</strong>{openedModules.includes(index) && <><small>{tx(module.outcome, lang)}</small><small>{module.example}</small></>}</span><span>{openedModules.includes(index) ? "✓" : "+"}</span></button>)}</div></>;
    if (current === 6) return <><h1 className="intro-title">{tx(C.s7.title, lang)}</h1><p className="intro-sub">{tx(C.s7.question, lang)}</p><div className="intro-list">{C.s7.goals.map((goal) => <button className={`intro-choice ${goals.includes(goal.id) ? "selected" : ""}`} type="button" key={goal.id} aria-pressed={goals.includes(goal.id)} onClick={() => setGoals((previous) => toggleLimited(previous, goal.id))}><span><strong className="intro-english">{goal.en}</strong><small>{tx(goal.tr, lang)}</small></span><span>{goals.includes(goal.id) ? "✓" : "+"}</span></button>)}</div></>;
    if (current === 7) return <><h1 className="intro-title">{tx(C.s8.title, lang)}</h1><div className="intro-list">{C.s8.steps.map((step, index) => <div className="intro-card" key={step.name}><span className="intro-kicker">{index + 1}. {step.name}</span><p className="intro-muted">{tx(step.desc, lang)}</p></div>)}</div><div className="intro-panel intro-muted">{tx(C.s8.notes, lang)}</div></>;
    return <><span className="intro-kicker">9 / 9 · INTRO</span><h1 className="intro-title">{tx(C.s9.title, lang)}</h1><div className="intro-summary"><div className="intro-card"><strong>{ui.summaryGoals}</strong><ul className="intro-muted">{goals.map((id) => <li key={id}>{tx(C.s7.goals.find((goal) => goal.id === id).tr, lang)}</li>)}</ul></div><div className="intro-card"><strong>{ui.summaryStruggles}</strong><ul className="intro-muted">{struggles.map((id) => <li key={id}>{tx(C.s4.items.find((item) => item.id === id).label, lang)}</li>)}</ul></div></div><div className="intro-panel"><p className="intro-english">{C.s9.promise}</p><p className="intro-muted">{tx(C.s9.tr, lang)}</p></div>{finished && <div className="intro-feedback good" role="status">✓ {ui.complete}</div>}</>;
  }

  return <main className="intro-root"><style>{STYLES}</style><header className="intro-head"><span className="intro-eyebrow">COLISEUM · {ui.intro}</span>{suppliedLang === undefined && <select className="intro-lang" aria-label="Language" value={previewLang} onChange={(event) => setPreviewLang(event.target.value)}><option value="uz">🇺🇿 UZ</option><option value="ru">🇷🇺 RU</option><option value="en">🇬🇧 EN</option></select>}<span className="intro-count">{current + 1} / 9</span></header><div className="intro-progress" aria-label={`${current + 1} / 9`}>{Array.from({ length: 9 }, (_, index) => <span className={`intro-dot ${index <= current ? "on" : ""}`} key={index} />)}</div><section className="intro-body" aria-live="off">{screen()}</section><footer className="intro-foot"><button className="intro-secondary" type="button" disabled={current === 0} onClick={() => setCurrent((index) => Math.max(0, index - 1))}>{ui.back}</button><button className="intro-primary" type="button" disabled={!gates[current] || finished} onClick={() => current === 8 ? finish() : setCurrent((index) => index + 1)}>{current === 8 ? (finished ? ui.complete : ui.finish) : ui.next} →</button></footer></main>;
}
