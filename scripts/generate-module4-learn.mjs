import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {dirname,join,resolve} from 'node:path';
import {module4A} from './module4-content-a.mjs';
import {module4B} from './module4-content-b.mjs';
import {module4C} from './module4-content-c.mjs';

const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const read=path=>readFileSync(join(root,path),'utf8');
let template=read('scripts/module1-learn-template.jsx.txt');
const replace=(from,to)=>{assert.ok(template.includes(from),`Missing anchor: ${from.slice(0,80)}`);template=template.replace(from,to);};
replace('useEffect, useRef, useState','useCallback, useEffect, useRef, useState');
replace('import { RiveRoute } from "@coliseum/kit";','');
const start=template.indexOf('function TruckScene('),end=template.indexOf('function TheorySlide(',start);
assert.ok(start>0&&end>start);
let extensions=read('scripts/module3-scenes.jsx.txt');
extensions=extensions.slice(extensions.indexOf('function HookSlide(')).replaceAll('m3-','m4-').replaceAll('WorkplaceScene','DecisionScene');
extensions=extensions.replace('const normalize = value => String(value || "").trim().toLowerCase().replace(/[.,!?]/g, "").replace(/\\s+/g, " ");','const normalize = normalizeAnswer;');
template=template.slice(0,start)+read('scripts/module4-scenes.jsx.txt')+'\n'+extensions+'\n'+template.slice(end);
template=template.replace(/\.ml-stage\{[^\n]*\n@keyframes ml-drive\{[^\n]*\n/,'');
const choiceStart=template.indexOf('function ChoiceSlide('),choiceEnd=template.indexOf('function BuildSlide(',choiceStart);
assert.ok(choiceStart>0&&choiceEnd>choiceStart);template=template.slice(0,choiceStart)+template.slice(choiceEnd);
replace('function TypeLine(',`const MODULE_CSS = ${JSON.stringify(read('scripts/module4-theme.css'))};\n\nfunction TypeLine(`);
replace('index={current}','index={current - 1}');
replace('{index + 1}/5','{index + 1}/{DATA.theoryCount}');
replace('<div className="ml-kick">{slide.kind === "theory" ? `ASOSIY QOIDA · ${current + 1}/5` : slide.kind === "quiz" ? "TEKSHIRUV" : slide.kind === "vocab" ? "SO‘ZLAR" : "NAZARIYA"} · {DATA.code}</div>','');
replace('slides.findIndex(item => /rapid test|checkpoint 1/i.test(item.heading))','slides.findIndex(item => item.final)');
replace('<ChoiceSlide','<AssessmentSlide');
replace('const [results, setResults] = useState({});','const [results, setResults] = useState({});\n  const attempts = useRef({});');
replace('final={current === rapidIndex}', 'attempt={attempts.current[current] || (attempts.current[current] = {})} final={current === rapidIndex}');
replace('const markReady = () => setReady(prev => prev[current] ? prev : ({ ...prev, [current]: true }));','const markReady = useCallback(() => setReady(prev => prev[current] ? prev : ({ ...prev, [current]: true })), [current]);');
replace('if (slide.kind === "theory") content','if (slide.kind === "hook") content = <HookSlide key={current} {...props} />;\n  else if (slide.kind === "document") content = <DocumentSlide key={current} {...props} />;\n  else if (slide.kind === "evidence") content = <EvidenceSlide key={current} {...props} />;\n  else if (slide.kind === "details") content = <DetailsSlide key={current} {...props} />;\n  else if (slide.kind === "theory") content');
replace('<style>{CSS}</style>','<style>{CSS + MODULE_CSS}</style>');
replace('<div className="ml-slide" key={current}>','<div className="ml-slide" data-kind={slide.kind} key={current}>');
replace('{DATA.code} · {current + 1}/{slides.length}','M04 / OPERATIONS · {DATA.code} · {current + 1}/{slides.length}');
replace('const slide = slides[current];','const slide = slides[current];\n  const bodyRef = useRef(null);\n  useEffect(() => { if(bodyRef.current) bodyRef.current.scrollTop = 0; }, [current]);');
replace('<section className="ml-body">','<section className="ml-body" ref={bodyRef}>');
replace('const canContinue = !!ready[current] || slide.kind === "summary";','const failedTest = resultScreen && rapid.firstTry / rapid.total < DATA.threshold;\n  const canContinue = !failedTest && (!!ready[current] || slide.kind === "summary");');
replace('{finished ? <span','{failedTest && <button type="button" className="ml-button primary" onClick={() => { delete attempts.current[current]; setResults(prev => { const next = { ...prev }; delete next[current]; return next; }); setReady(prev => ({ ...prev, [current]: false })); }}>Testni qayta ishlash →</button>}{finished ? <span');
replace('if (done.current) return;','if (done.current || !rapid || rapid.firstTry / rapid.total < DATA.threshold) return;');
replace('answers: [],','answers: Object.entries(results).map(([index, value]) => ({ slide: Number(index) + 1, ...value })),');
replace('const build = slide.builds[index];','const [tokenOrders] = useState(() => slide.builds.map(item => shuffled({ options: item.parts })));\n  const build = slide.builds[index];');
replace('build.parts.map((part, partIndex) => <button','tokenOrders[index].map(({ text: part, id: partIndex }) => <button');
template=template.replaceAll('M1L08','M4L08').replaceAll('Module 1 yakunlandi. Asosiy grammatika va logistika atamalarini o‘zlashtirdingiz.','Yakuniy modul nazariyasi tugadi. Fakt, cheklov va dalil asosida professional muloqotni mashq qildingiz.');
replace('DATA.code === "M4L08" ? 8 : 4','DATA.code === "M4L08" ? 12 : 6');

export const lessons=[...module4A,...module4B,...module4C].map(item=>{
  const expected=[8,9,9,9,9,9,10,10][Number(item.code.slice(-2))-1];
  assert.equal(item.theory.length,expected,item.code);
  const theory=item.theory.map((rule,i)=>({...rule,id:`T${i+1}`}));
  for(const rule of theory){assert.equal(rule.steps.length,3);assert.equal(rule.points.length,2);for(const key of ['heading','explanation','example','translation','wrong','right','why'])assert.ok(rule[key],`${item.code} ${key}`);}
  const slides=[
    {kind:'hook',heading:item.title,lines:item.hook},...theory,
    {kind:'mission',heading:'Mission · Cheklovlar asosida qaror',questions:[item.mission]},
    {kind:'evidence',heading:'Qarorni dalillash',source:item.mission.stem,items:[['QAROR',item.mission.options[item.mission.answer]],['ASOS',item.mission.why],['QAYTA TEKSHIRISH',item.mission.hints[1]]]},
    {kind:'document',heading:'Case file · Manbalarni solishtiring',documents:item.documents},
    {kind:'reveal',heading:'Notice · Majburiyat chegarasi',cards:item.theory.slice(-3).map(rule=>`${rule.example} — ${rule.translation}`)},
    {kind:'reveal',heading:'Pattern · Fakt → shart → javob',cards:item.theory.slice(0,3).map(rule=>`${rule.steps.map(step=>step[1]).join(' → ')}. ${rule.points[0]}`)},
    {kind:'vocab',heading:'Professional vocabulary',rows:item.vocab},
    {kind:'quiz',heading:'Guided analysis · Dalilni tanlang',questions:item.guided},
    {kind:'build',heading:'Build · Aniq majburiyat bilan gap',builds:item.builds},
    {kind:'read',heading:'Yangi ma’lumot · Qarorni yangilang',chat:item.read2,translation:'Keyingi savolda aynan shu faktlar va tasdiq holati hisobga olinadi.'},
    {kind:'quiz',heading:'Read check · Qaysi holat amalda?',questions:[item.readQuestion]},
    {kind:'quiz',heading:'Fix · Asossiz xulosani tuzating',questions:item.fixes},
    {kind:'details',heading:'Apply · Aniq yozma natija',...item.application},
    {kind:'quiz',heading:'Role-play · Uch bosqichli qaror',questions:item.role},
    {kind:'quiz',final:true,heading:item.code==='M4L08'?'Final assessment · Kurs yakuni':'Rapid test · Mustaqil qaror',questions:item.rapid},
    {kind:'summary',heading:'Phrase bank · Ishga ko‘chiring',phrases:item.phrases,extras:['Faktni tekshiring, shartni saqlang, keyingi amalni aniq ayting. Iboralarni o‘z ish vaziyatingizda ovoz chiqarib mashq qiling; ovoz yozilmaydi.']},
  ].map((slide,index)=>({...slide,number:index+1}));
  assert.equal(slides.length,16+theory.length);
  assert.equal(item.rapid.length,item.code==='M4L08'?12:6);
  assert.ok(item.rapid.filter(q=>q.kind==='type').length>=(item.code==='M4L08'?4:2));
  for(const slide of slides)for(const question of slide.questions||[]){
    assert.ok(question.stem&&question.why);assert.ok(question.theoryRefs?.length);
    for(const ref of question.theoryRefs)assert.ok(theory.some(t=>t.id===ref),`${item.code}: ${ref}`);
    if(question.kind==='type'){assert.ok(question.answerText&&question.hint);assert.ok(Array.isArray(question.accept));}
    else{assert.equal(question.options.length,3);assert.equal(new Set(question.options).size,3);assert.equal(question.hints.length,3);for(let i=0;i<3;i++)if(i!==question.answer)assert.ok(question.hints[i]);}
  }
  assert.equal(item.vocab.length,8);assert.equal(item.phrases.length,6);assert.equal(item.builds.length,3);
  for(const sentence of item.builds){const words=s=>s.toLowerCase().replace(/[.,?!]/g,'').split(/\s+/).filter(Boolean).sort();assert.deepEqual(words(sentence.parts.join(' ')),words(sentence.answer),item.code);}
  return {code:item.code,title:item.title,goal:item.goal,skillTags:item.skillTags,scene:item.scene,theoryCount:theory.length,threshold:item.code==='M4L08'?.7:.6,slides};
});
assert.equal(lessons.length,8);
mkdirSync(join(root,'jsx-lessons/module-04'),{recursive:true});
for(const data of lessons){const source=template.replace('__LESSON_DATA__',JSON.stringify(data));writeFileSync(join(root,`jsx-lessons/module-04/${data.code}.learn.jsx`),source,'utf8');console.log(`${data.code}: ${data.theoryCount} theory, ${data.slides.length} slides, ${Buffer.byteLength(source)} bytes`);}
