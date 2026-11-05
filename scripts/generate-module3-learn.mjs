import assert from 'node:assert/strict';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { dirname, resolve, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { module3 } from './module3-content.mjs';
import { module3Scenarios } from './module3-content-scenarios.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const folder = join(root, 'jsx-lessons/module-03');
mkdirSync(folder, {recursive:true});
let template = readFileSync(join(root,'scripts/module1-learn-template.jsx.txt'),'utf8');
const replace = (from, to) => { assert.ok(template.includes(from), `Template anchor missing: ${from.slice(0,70)}`); template = template.replace(from,to); };
replace('useEffect, useRef, useState', 'useCallback, useEffect, useRef, useState');
replace('import { RiveRoute } from "@coliseum/kit";', '');
const truckStart = template.indexOf('function TruckScene(');
const truckEnd = template.indexOf('function TheorySlide(',truckStart);
assert.ok(truckStart > 0 && truckEnd > truckStart);
template = template.slice(0,truckStart) + readFileSync(join(root,'scripts/module3-scenes.jsx.txt'),'utf8') + '\n\n' + template.slice(truckEnd);
template = template.replace(/\.ml-stage\{[^\n]*\n@keyframes ml-drive\{[^\n]*\n/,'');
replace('function TypeLine(',`const MODULE_CSS = ${JSON.stringify(readFileSync(join(root,'scripts/module3-theme.css'),'utf8'))};\n\nfunction TypeLine(`);
replace('<TruckScene code={DATA.code} />','<WorkplaceScene />');
replace('index={current}', 'index={current - 1}');
replace('{index + 1}/5','{index + 1}/{DATA.theoryCount}');
// Progress and exercise labels already identify the slide; omit the duplicate above its title.
replace('<div className="ml-kick">{slide.kind === "theory" ? `ASOSIY QOIDA · ${current + 1}/5` : slide.kind === "quiz" ? "TEKSHIRUV" : slide.kind === "vocab" ? "SO‘ZLAR" : "NAZARIYA"} · {DATA.code}</div>', '');
replace('slides.findIndex(item => /rapid test|checkpoint 1/i.test(item.heading))','slides.findIndex(item => item.kind === "quiz" && /rapid test|checkpoint 3/i.test(item.heading))');
template = template.replaceAll('M1L08','M3L08').replaceAll('Module 1 yakunlandi. Asosiy grammatika va logistika atamalarini o‘zlashtirdingiz.','Module 3 nazariyasi yakunlandi. Ish hujjatlarini o‘qish, noaniqlikni so‘rash va tekshirilgan update yozishni mashq qildingiz.');
replace('const markReady = () => setReady(prev => prev[current] ? prev : ({ ...prev, [current]: true }));','const markReady = useCallback(() => setReady(prev => prev[current] ? prev : ({ ...prev, [current]: true })), [current]);');
replace('if (slide.kind === "theory") content','if (slide.kind === "hook") content = <HookSlide key={current} {...props} />;\n  else if (slide.kind === "document") content = <DocumentSlide key={current} {...props} />;\n  else if (slide.kind === "details") content = <DetailsSlide key={current} {...props} />;\n  else if (slide.kind === "theory") content');
replace('<style>{CSS}</style>','<style>{CSS + MODULE_CSS}</style>');
replace('<div className="ml-slide" key={current}>','<div className="ml-slide" data-kind={slide.kind} key={current}>');
replace('{DATA.code} · {current + 1}/{slides.length}','M03 / WORKPLACE · {DATA.code} · {current + 1}/{slides.length}');
replace('"Qoida va misolni eslang, yana urinib ko‘ring."','`“${question.options[selection]}” variantini manba bilan solishtiring. ${question.hint || question.why || "Fakt, vaqt va shart mosligini tekshiring."}`');
replace('const canContinue = !!ready[current] || slide.kind === "summary";','const failedTest = resultScreen && rapid.firstTry / rapid.total < DATA.threshold;\n  const canContinue = !failedTest && (!!ready[current] || slide.kind === "summary");');
replace('{finished ? <span','{failedTest && <button type="button" className="ml-button primary" onClick={() => { setResults(prev => { const next = { ...prev }; delete next[current]; return next; }); setReady(prev => ({ ...prev, [current]: false })); }}>Testni qayta ishlash →</button>}{finished ? <span');
replace('if (done.current) return;','if (done.current || !rapid || rapid.firstTry / rapid.total < DATA.threshold) return;');
replace('answers: [],','answers: Object.entries(results).map(([index, value]) => ({ slide: Number(index) + 1, ...value })),');
replace('const build = slide.builds[index];','const [tokenOrders] = useState(() => slide.builds.map(item => shuffled({ options: item.parts })));\n  const build = slide.builds[index];');
replace('build.parts.map((part, partIndex) => <button','tokenOrders[index].map(({ text: part, id: partIndex }) => <button');
// Reset inner scroll when navigating between long documents and short exercises.
replace('const slide = slides[current];','const slide = slides[current];\n  const bodyRef = useRef(null);\n  useEffect(() => { if (bodyRef.current) bodyRef.current.scrollTop = 0; }, [current]);');
replace('<section className="ml-body">','<section className="ml-body" ref={bodyRef}>');

// Small typographic cleanup in authoring strings; do not change lesson IDs.
const readable = value => typeof value === 'string' ? value.replace(/\b(at|load|Load|door|Door|dock|Dock|gate|Gate|Checkpoint|About|about)(?=\d)/g,'$1 ').replace(/([÷=+])(?=\d)/g,'$1 ') : Array.isArray(value) ? value.map(readable) : value && typeof value === 'object' ? Object.fromEntries(Object.entries(value).map(([key,item]) => [key,readable(item)])) : value;

export const lessons = [...module3,...module3Scenarios].map(original => {
  const item = readable(original);
  const slides = [
    {kind:'hook',heading:item.title,lines:item.hook},
    ...item.theory,
    {kind:'mission',heading:'Mission · Vaziyatni tahlil qiling',intro:[item.goal],questions:[item.mission]},
    item.documents ? {kind:'document',heading:item.code === 'M3L06' ? 'Read · Uchta yozma update' : 'Read · Ish hujjatini o‘qing',documents:item.documents} : {kind:'read',heading:'Read · Ishdagi suhbat',chat:item.chat,translation:item.translation},
    {kind:'reveal',heading:'Notice · Fakt, shart va taxmin',cards:item.theory.slice(-3).map(rule => `${rule.example} — ${rule.translation}`)},
    {kind:'reveal',heading:'Pattern · Fikrni qanday tuzamiz?',cards:item.theory.slice(0,3).map(rule => `${rule.steps.map(step => step[1]).join(' → ')} · ${rule.points[0]}`)},
    {kind:'vocab',heading:'Vocabulary · 8 ta ish atamasi',rows:item.vocab},
    {kind:'quiz',heading:'Guided check · Dalil bilan tanlang',questions:item.guided},
    {kind:'build',heading:'Build · 3 ta aniq gap',builds:item.builds},
    {kind:'read',heading:item.code === 'M3L06' ? 'Read · Manba va email draft' : 'Read · Yangi ma’lumot',chat:item.read2,translation:'Keyingi savol aynan shu manbaga tegishli. Fakt, vaqt, shart va tasdiq holatini ajrating.'},
    {kind:'quiz',heading:'Read check · Ikki detalni solishtiring',questions:[item.readQuestion]},
    {kind:'quiz',heading:'Fix it · Noto‘g‘ri xulosani tuzating',questions:item.fixes},
    {kind:'details',heading:'Apply · Manbadan aniq natija',...item.application},
    {kind:'quiz',heading:item.code === 'M3L06' ? 'Write back · Uch bosqichli update' : 'Role-play · Uch bosqichli qaror',questions:item.role},
    {kind:'quiz',heading:item.code === 'M3L08' ? 'Checkpoint 3 · Modul yakuni' : 'Rapid test · Tezkor test',questions:item.rapid},
    {kind:'summary',heading:'Summary · Ish uchun phrase bank',phrases:item.phrases,extras:['Manba → aniqlashtirish → tasdiq. Iboralarni o‘z ish vaziyatingizga moslab mashq qiling.']},
  ].map((slide,index) => ({...slide,number:index+1}));
  assert.ok(item.theory.length >= 6 && item.theory.length <= 7,item.code);
  assert.equal(slides.length,15+item.theory.length);
  for (const rule of item.theory) { assert.equal(rule.steps.length,3); assert.equal(rule.points.length,2); for (const key of ['heading','explanation','example','translation','wrong','right','why']) assert.ok(rule[key],`${item.code}: ${key}`); }
  assert.equal(item.vocab.length,8); assert.equal(item.builds.length,3); assert.equal(item.phrases.length,6);
  assert.equal(item.rapid.length,item.code === 'M3L08' ? 8 : 4);
  for (const slide of slides) for (const question of slide.questions || []) { assert.equal(question.options.length,3); assert.equal(new Set(question.options).size,3); assert.ok(question.options[question.answer]); }
  for (const sentence of item.builds) {
    const words = text => text.toLowerCase().replace(/[.,?!]/g,'').split(/\s+/).filter(Boolean).sort();
    assert.deepEqual(words(sentence.parts.join(' ')),words(sentence.answer),`${item.code}: token mismatch`);
  }
  return {code:item.code,title:item.title,goal:item.goal,skillTags:item.skillTags,scene:item.scene,theoryCount:item.theory.length,threshold:item.code === 'M3L08' ? .7 : .6,slides};
});
assert.equal(lessons.length,8);
for (const data of lessons) {
  const source = template.replace('__LESSON_DATA__',JSON.stringify(data));
  writeFileSync(join(folder,`${data.code}.learn.jsx`),source,'utf8');
  console.log(`${data.code}: ${data.theoryCount} theory, ${data.slides.length} total slides; ${Buffer.byteLength(source)} bytes`);
}
rmSync(join(folder,'.gitkeep'),{force:true});
