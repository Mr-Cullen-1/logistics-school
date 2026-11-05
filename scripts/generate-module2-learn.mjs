import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { module2 } from "./module2-content.mjs";
import { module2Writing } from "./module2-content-writing.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const folder = join(root, "jsx-lessons/module-02");
mkdirSync(folder, { recursive: true });
let template = readFileSync(join(root, "scripts/module1-learn-template.jsx.txt"), "utf8");
const replace = (from, to) => { assert.ok(template.includes(from), `Missing template anchor: ${from.slice(0, 70)}`); template = template.replace(from, to); };
replace('useEffect, useRef, useState', 'useCallback, useEffect, useRef, useState');
replace('import { RiveRoute } from "@coliseum/kit";', '');
const truckStart = template.indexOf('function TruckScene(');
const truckEnd = template.indexOf('function TheorySlide(', truckStart);
assert.ok(truckStart > 0 && truckEnd > truckStart);
template = template.slice(0, truckStart) + readFileSync(join(root, "scripts/module2-scenes.jsx.txt"), "utf8") + '\n\n' + template.slice(truckEnd);
// Remove the obsolete route CSS; the Module 2 scene is entirely local SVG/CSS.
template = template.replace(/\.ml-stage\{[^\n]*\n@keyframes ml-drive\{[^\n]*\n/, "");
replace('function TypeLine(', `const MODULE_CSS = ${JSON.stringify(readFileSync(join(root, "scripts/module2-theme.css"), "utf8"))};\n\nfunction TypeLine(`);
replace('<TruckScene code={DATA.code} />', '<CommunicationScene />');
replace('index={current}', 'index={current - 1}');
replace('${current + 1}/5', '${current}/5');
replace('/rapid test|checkpoint 1/i', '/rapid test|checkpoint 2/i');
replace('slides.findIndex(item => /rapid test|checkpoint 2/i.test(item.heading))', 'slides.findIndex(item => item.kind === "quiz" && /rapid test|checkpoint 2/i.test(item.heading))');
template = template.replaceAll('M1L08', 'M2L08').replaceAll('Module 1 yakunlandi. Asosiy grammatika va logistika atamalarini o‘zlashtirdingiz.', 'Module 2 nazariyasi yakunlandi. Kundalik ish muloqoti, telefon va yozma tasdiqlash ko‘nikmalarini mashq qildingiz.');
replace('const markReady = () => setReady(prev => prev[current] ? prev : ({ ...prev, [current]: true }));', 'const markReady = useCallback(() => setReady(prev => prev[current] ? prev : ({ ...prev, [current]: true })), [current]);');
replace('if (slide.kind === "theory") content', 'if (slide.kind === "hook") content = <HookSlide key={current} {...props} />;\n  else if (slide.kind === "details") content = <DetailsSlide key={current} {...props} />;\n  else if (slide.kind === "theory") content');
replace('<style>{CSS}</style>', '<style>{CSS + MODULE_CSS}</style>');
replace('{DATA.code} · {current + 1}/{slides.length}', 'M02 / COMMUNICATION · {DATA.code} · {current + 1}/{slides.length}');
replace('"Qoida va misolni eslang, yana urinib ko‘ring."', '`“${question.options[selection]}” variantini qoida bilan solishtiring. ${question.hint || "Ma’no, so‘z tartibi yoki raqamlar mosligini tekshiring."}`');
// Keep a failed checkpoint retryable and prevent skipping straight to completion.
replace('const canContinue = !!ready[current] || slide.kind === "summary";', 'const failedTest = resultScreen && rapid.firstTry / rapid.total < DATA.threshold;\n  const canContinue = !failedTest && (!!ready[current] || slide.kind === "summary");');
replace('{finished ? <span', '{failedTest && <button type="button" className="ml-button primary" onClick={() => { setResults(prev => { const next = { ...prev }; delete next[current]; return next; }); setReady(prev => ({ ...prev, [current]: false })); }}>Testni qayta ishlash →</button>}{finished ? <span');
replace('if (done.current) return;', 'if (done.current || !rapid || rapid.firstTry / rapid.total < DATA.threshold) return;');
replace('answers: [],', 'answers: Object.entries(results).map(([index, value]) => ({ slide: Number(index) + 1, ...value })),');
// Sentence tokens shuffle once per mount, retain stable identities for repeated words.
replace('const build = slide.builds[index];', 'const [tokenOrders] = useState(() => slide.builds.map(item => shuffled({ options: item.parts })));\n  const build = slide.builds[index];');
replace('build.parts.map((part, partIndex) => <button', 'tokenOrders[index].map(({ text: part, id: partIndex }) => <button');
replace('slide.kind === "theory" ? `ASOSIY QOIDA', 'slide.kind === "hook" ? "HOOK" : slide.kind === "details" ? "AMALDA QO‘LLASH" : slide.kind === "theory" ? `ASOSIY QOIDA');

const applications = {
  M2L01: { source: "Maya Reed works as a carrier representative for Northline Freight. She has been in logistics for three years.", fields: [["Name", "Maya Reed"], ["Position", "carrier representative"], ["Company", "Northline Freight"]] },
  M2L02: { source: "Pickup: 725 Pine Road. Dock: 3. Commodity: furniture. Reference: PU-918. Contact: Emma.", fields: [["Street number", "725"], ["Dock number", "3"], ["Reference", "PU-918"]] },
  M2L03: { source: "Total rate: $1,800. Distance: 900 miles. Weight: 36,000 lbs. Enter the numbers only.", fields: [["Rate ($)", "1800"], ["Distance (miles)", "900"], ["Weight (lbs)", "36000"]] },
  M2L04: { source: "Name: Kilo India Mike. Reference: Delta Tango, hyphen, five zero six two. Phone: 202-555-0146.", fields: [["Name", "Kim"], ["Reference", "DT-5062"], ["Phone", "202-555-0146"]] },
  M2L05: { source: "Voicemail: This is Maya. Please call me at 202-555-0168 about load 624. I'm available after 2 PM.", fields: [["Caller", "Maya"], ["Phone", "202-555-0168"], ["Load number", "624"]] },
  M2L06: { source: "Lake Foods sends 16 pallets of canned soup to Metro Market. Weight: 28,000 lbs. PO: PO-7306.", fields: [["Shipper", "Lake Foods"], ["Consignee", "Metro Market"], ["Commodity", "canned soup"], ["Qty", "16 pallets"], ["Wt", "28,000 lbs"], ["PO number", "PO-7306"]] },
  M2L07: { source: "Subject: BOL attached — Load 624. Hello Emma, Please find attached the BOL for load 624. Best regards, Aziz. Fill the missing words below.", fields: [["Please find ___ the BOL", "attached"], ["Load number", "624"], ["Best ___, Aziz", "regards"]] },
  M2L08: { source: "Load 730. Pickup: November 2nd at 9 AM. Delivery: November 3rd at 2 PM. Total rate: $1,800. Copy the times with AM/PM, and enter the rate as a number.", fields: [["Pickup time", "9 AM"], ["Delivery time", "2 PM"], ["Total rate ($)", "1800"]] },
};

export const lessons = [...module2, ...module2Writing].map(item => {
  const details = applications[item.code];
  const slides = [
    { kind: "hook", heading: item.title, lines: item.hook },
    ...item.theory,
    { kind: "mission", heading: "Mission · Ish vaziyati", intro: [item.goal], questions: [item.mission] },
    { kind: "read", heading: item.code === "M2L07" ? "Read · Email 1" : "Read · Suhbatni o‘qing", chat: item.chat, translation: item.translation },
    { kind: "reveal", heading: "Notice · Muhim iboralar", cards: item.theory.slice(0, 3).map(rule => `${rule.example} — ${rule.translation}`) },
    { kind: "reveal", heading: "Pattern · Qolipni eslang", cards: item.theory.slice(0, 3).map(rule => `${rule.steps.map(step => step[1]).join(" → ")} · ${rule.points[0]}`) },
    { kind: "vocab", heading: "Vocabulary · 8 ta ish so‘zi", rows: item.vocab },
    { kind: "quiz", heading: "Guided check · Birga tekshiramiz", questions: item.guided },
    { kind: "build", heading: "Build · 3 ta gap tuzing", builds: item.builds },
    { kind: "read", heading: item.code === "M2L07" ? "Read · Email 2 va 3" : "Read · Yangi ma’lumot", chat: item.read2, translation: "Keyingi slaydda aynan shu manbadagi ma’lumot so‘raladi. Raqam va nomlarni diqqat bilan o‘qing." },
    { kind: "quiz", heading: "Read check · Detalni toping", questions: [item.readQuestion] },
    { kind: "quiz", heading: "Fix it · Xatoni tuzating", questions: item.fixes },
    { kind: "details", heading: item.code === "M2L06" ? "Form · Yuk ma’lumotlarini kiriting" : "Apply · Ma’lumotni kiriting", source: details.source, fields: details.fields.map(([label, answer]) => ({ label, answer })) },
    { kind: "quiz", heading: "Role-play · Uch qadam", questions: item.role },
    { kind: "quiz", heading: item.code === "M2L08" ? "Checkpoint 2 · Modul yakuni" : "Rapid test · Tezkor test", questions: item.rapid },
    { kind: "summary", heading: "Summary · Phrase bank", phrases: item.phrases, extras: ["Har iborani o‘zingizning ish vaziyatingizga moslab ayting. Tayyor bo‘lsangiz, darsni yakunlang."] },
  ].map((slide, index) => ({ ...slide, number: index + 1 }));
  assert.equal(slides.length, 20);
  assert.equal(item.theory.length, 5);
  for (const rule of item.theory) { assert.equal(rule.steps.length, 3); assert.equal(rule.points.length, 2); for (const key of ["explanation", "example", "translation", "wrong", "right", "why"]) assert.ok(rule[key], `${item.code} ${key}`); }
  assert.equal(item.vocab.length, 8); assert.equal(item.builds.length, 3); assert.equal(item.phrases.length, 6);
  assert.equal(item.rapid.length, item.code === "M2L08" ? 8 : 4);
  for (const slide of slides) for (const question of slide.questions || []) { assert.equal(question.options.length, 3); assert.equal(new Set(question.options).size, 3); assert.ok(question.options[question.answer]); }
  for (const sentence of item.builds) {
    const tokens = text => text.toLowerCase().replace(/[.,?!]/g, "").split(/\s+/).filter(Boolean).sort();
    assert.deepEqual(tokens(sentence.parts.join(" ")), tokens(sentence.answer), `${item.code}: sentence token mismatch`);
  }
  return { code: item.code, title: item.title, goal: item.goal, skillTags: item.skillTags, threshold: item.code === "M2L08" ? .7 : .6, slides };
});
for (const data of lessons) {
  const output = template.replace("__LESSON_DATA__", JSON.stringify(data));
  writeFileSync(join(folder, `${data.code}.learn.jsx`), output, "utf8");
  console.log(`${data.code}: hook + 5 theory + 14 learning slides; ${Buffer.byteLength(output)} bytes`);
}
