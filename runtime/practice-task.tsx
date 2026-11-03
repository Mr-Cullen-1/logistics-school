import { useCallback, useEffect, useRef, useState } from "react";

type Choice = { label: string; feedback?: string };
type Step = { prompt: string; options: Choice[]; answer: number };
export type PracticeDefinition = {
  id: string;
  kind: "MC" | "MATCH" | "READ-MC" | "GAP" | "ORDER" | "FIX" | "SORT" | "READ-TYPE" | "SCENE";
  title: string;
  instruction: string;
  questionText: string;
  passage?: string;
  prompt?: string;
  options?: Choice[];
  answer?: number;
  tokens?: string[];
  expected?: string[];
  pairs?: { left: string; right: string; hint?: string }[];
  groups?: { label: string; items: string[] }[];
  fields?: { label: string; answers: string[]; hint: string }[];
  steps?: Step[];
  success: string;
  hint: string;
};

type Props = { definition: PracticeDefinition; lang?: string; mode?: string; fullScreen?: boolean; onReady?: (ready: boolean) => void; registerCheck?: (check: () => void) => void; onSubmit?: (result: unknown) => void };
const STYLE = `
.pt{--ink:#1b2429;--muted:#59636a;--bronze:#a36f35;--line:#c7a67588;box-sizing:border-box;min-height:100dvh;padding:clamp(12px,3vw,32px);font:16px/1.45 Geist,system-ui,sans-serif;color:var(--ink);background:radial-gradient(circle at 10% 5%,#ead7b9,transparent 35%),radial-gradient(circle at 100% 100%,#d5bd96,transparent 32%),#f3efe7}
.pt *{box-sizing:border-box}.pt-shell{max-width:880px;margin:auto;min-height:calc(100dvh - 64px);display:flex;flex-direction:column;justify-content:center;gap:16px;padding:clamp(16px,3vw,30px);border:1px solid #fff;border-radius:22px;background:#ffffffae;backdrop-filter:blur(8px);box-shadow:0 20px 50px #6f533726;animation:pt-enter .55s both}
.pt-head{display:flex;align-items:center;gap:12px;color:#835322;font-size:12px;font-weight:800;letter-spacing:.12em;text-transform:uppercase}.pt-head:before{content:'';width:30px;height:4px;border-radius:3px;background:#b5874b}
.pt h1{font-size:clamp(24px,3.3vw,36px);line-height:1.1;margin:0}.pt p{margin:0}.pt-sub{color:var(--muted)}.pt-passage{padding:14px 18px;border:1px solid var(--line);border-radius:13px;background:#fffdf9;white-space:pre-line;font-size:clamp(15px,1.6vw,18px);font-weight:550}
.pt-question{font-weight:700;font-size:clamp(16px,1.8vw,21px)}.pt-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}.pt-list{display:grid;gap:9px}.pt-button,.pt-token,.pt-group{min-height:48px;padding:10px 14px;text-align:left;border:1px solid #cfbda6;border-radius:12px;background:#fffdfb;color:var(--ink);font:600 15px/1.3 Geist,system-ui,sans-serif;cursor:pointer;transition:transform .2s,border-color .2s,background .2s;box-shadow:0 4px 12px #6f533710}
.pt-button:hover:not(:disabled),.pt-token:hover:not(:disabled),.pt-group:hover:not(:disabled){transform:translateY(-2px);border-color:var(--bronze)}.pt-button:focus-visible,.pt-token:focus-visible,.pt-group:focus-visible,.pt-input:focus-visible{outline:3px solid #b5874b;outline-offset:2px}.pt-button.sel,.pt-token.sel,.pt-group.sel{border-color:var(--bronze);background:#f5e7cf}.pt-button.wrong,.pt-token.wrong{border-color:#b8614c;background:#fff0e9;animation:pt-shake .36s}.pt-button.correct,.pt-token.correct{border-color:#4d9967;background:#eaf5eb;animation:pt-pop .4s}.pt-button:disabled,.pt-token:disabled,.pt-group:disabled{cursor:default}
.pt-chip{display:inline-grid;place-items:center;min-width:26px;height:26px;margin-right:10px;border-radius:7px;background:#f2e6d7;color:#86572e;font-size:12px;font-weight:800}.pt-row{display:flex;flex-wrap:wrap;gap:8px}.pt-token{min-height:42px;padding:7px 12px}.pt-build{min-height:56px;display:flex;align-items:center;flex-wrap:wrap;gap:6px;padding:9px;border:1px dashed #b9956b;border-radius:12px;background:#fffaf1}.pt-pairs-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.pt-pair{display:flex;gap:8px;align-items:center}.pt-pair span{flex:1;cursor:default}.pt-pair select,.pt-input{min-height:44px;width:100%;padding:8px 12px;border:1px solid #cfbda6;border-radius:10px;background:#fffdfb;color:var(--ink);font:inherit}.pt-field{display:grid;gap:5px}.pt-field label{font-weight:700;font-size:14px}.pt-help{display:flex;align-items:flex-start;gap:10px;padding:12px 15px;border:1px solid #c69c67;border-radius:12px;background:#fff5e5;color:#6f4624;font-weight:650;animation:pt-pop .35s}.pt-help.good{border-color:#76a984;background:#e8f5ea;color:#285d3c}.pt-help.bad{border-color:#ce8d73;background:#fff0e8;color:#85452c}.pt-foot{color:var(--muted);font-size:13px}.pt-progress{display:flex;gap:5px}.pt-progress span{height:5px;flex:1;border-radius:3px;background:#ddd4ca}.pt-progress span.on{background:#b5874b}@keyframes pt-enter{from{opacity:0;transform:translateY(14px) rotateX(-4deg)}to{opacity:1;transform:none}}@keyframes pt-pop{50%{transform:scale(1.015)}}@keyframes pt-shake{25%{transform:translateX(-4px)}75%{transform:translateX(4px)}}@media(max-width:620px){.pt{padding:5px}.pt-shell{min-height:calc(100dvh - 10px);padding:15px;gap:12px}.pt-grid,.pt-pairs-grid{grid-template-columns:1fr}.pt-button{min-height:44px}.pt h1{font-size:24px}}@media(prefers-reduced-motion:reduce){.pt *{animation-duration:.01ms!important;transition-duration:.01ms!important}}
@media(max-width:620px){.pt-shell{padding:7px;gap:6px}}
.pt-pair{display:grid;grid-template-columns:minmax(0,1fr) minmax(130px,45%)}.pt-pair span,.pt-pair select{min-width:0}
.pt:not(.pt-full){min-height:0;padding:12px}.pt:not(.pt-full) .pt-shell{min-height:0;justify-content:flex-start;gap:10px;padding:16px}.pt:not(.pt-full) .pt-pairs-grid{grid-template-columns:1fr}
.pt.pt-full{min-height:100dvh}
/* Shared Coliseum lesson palette. Keep task geometry and motion above intact. */
.pt{--ink:#f5f3ee;--muted:#b8bbbd;--bronze:#e0c28c;--line:#c19a6366;background:radial-gradient(circle at 8% 8%,#9f713020,transparent 36%),radial-gradient(circle at 92% 88%,#a8793229,transparent 36%),#0d1114}
.pt-shell{border-color:#d8b678;background:linear-gradient(135deg,#30343bd9,#1b1f23ef 55%,#24282de8);box-shadow:0 20px 50px #0007,inset 0 1px #ffffff10}
.pt-head{color:#d8b678}.pt-head:before{background:#d8b678}.pt h1{color:#e0c28c}.pt-question{color:#f5f3ee}
.pt-passage,.pt-button,.pt-token,.pt-group,.pt-pair select,.pt-input{border-color:#c19a6366;background:linear-gradient(135deg,#30343bd9,#1a1f23e8);color:#f5f3ee;box-shadow:0 4px 12px #0003}
.pt-button:hover:not(:disabled),.pt-token:hover:not(:disabled),.pt-group:hover:not(:disabled){border-color:#e0c28c}.pt-button.sel,.pt-token.sel,.pt-group.sel{border-color:#e0c28c;background:#c19a6329}
.pt-button.correct,.pt-token.correct{border-color:#68ab7e;background:#1e463034;color:#f2fff5}.pt-button.wrong,.pt-token.wrong{border-color:#d77a79;background:#6a282832;color:#fff0ef}
.pt-chip{background:#c19a6326;color:#e0c28c}.pt-build{border-color:#c19a6388;background:#151a1dbd;color:#b8bbbd}
.pt-pair select{color-scheme:dark}.pt-pair select option{background:#1a1f23;color:#f5f3ee}.pt-input::placeholder{color:#a9acae}
.pt-pair.correct .pt-button,.pt-pair.correct select{border-color:#68ab7e;background:#25593a55}.pt-pair.wrong .pt-button,.pt-pair.wrong select{border-color:#d77a79;background:#6a282858}
.pt-pair.correct .pt-button:after,.pt-pair.wrong .pt-button:after{float:right;margin-left:8px;font-weight:800}.pt-pair.correct .pt-button:after{content:'✓';color:#9cddb5}.pt-pair.wrong .pt-button:after{content:'×';color:#ffaaa7}
.pt-help{border-color:#c19a6388;background:#c19a631f;color:#e0c28c}.pt-help.good{border-color:#68ab7e;background:#25593a55;color:#9cddb5}.pt-help.bad{border-color:#d77a79;background:#6a282858;color:#ffaaa7}
.pt-progress span{background:#454b4e}.pt-progress span.on{background:#e0c28c}
`;

function normalize(value: string) { return value.toLocaleLowerCase().replace(/[.,!?;:]/g, "").replace(/\s+/g, " ").trim(); }

export function PracticeTask({ definition: d, lang = "uz", mode, fullScreen = false, onReady, registerCheck, onSubmit }: Props) {
  const [selected, setSelected] = useState<number | null>(null);
  const [order, setOrder] = useState<number[]>([]);
  const [matches, setMatches] = useState<Record<number, string>>({});
  const [groups, setGroups] = useState<Record<string, string>>({});
  const [fields, setFields] = useState<Record<number, string>>({});
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState<{ text: string; good: boolean } | null>(null);
  const [attempts, setAttempts] = useState(0);
  const [locked, setLocked] = useState(false);
  const [shuffle, setShuffle] = useState(0);
  const [compact, setCompact] = useState(false);
  const [page, setPage] = useState(0);
  const checking = useRef(false);
  const review = mode === "review";
  const choiceMode = ["MC", "READ-MC", "GAP", "FIX", "SCENE"].includes(d.kind);
  const current = d.kind === "SCENE" ? d.steps?.[step] : undefined;
  const options = current?.options || d.options || [];
  const chosen = selected !== null ? options[selected] : undefined;
  const orderIndexes = options.map((_, index) => index);
  if (shuffle % 2) orderIndexes.reverse();
  useEffect(() => {
    const query = window.matchMedia("(max-width: 620px)");
    const sync = () => { setCompact(query.matches); setPage(0); };
    sync(); query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);
  const ready = !locked && !review && (choiceMode ? selected !== null : d.kind === "ORDER" ? order.length === (d.tokens?.length || 0) : d.kind === "MATCH" ? Object.keys(matches).length === (d.pairs?.length || 0) : d.kind === "SORT" ? Object.keys(groups).length === d.groups?.reduce((n, group) => n + group.items.length, 0) : d.kind === "READ-TYPE" ? (d.fields || []).every((_, index) => fields[index]?.trim()) : false);
  useEffect(() => { onReady?.(Boolean(ready)); }, [onReady, ready]);
  const check = useCallback(() => {
    if (!ready || checking.current) return;
    checking.current = true;
    const nextAttempts = attempts + 1;
    let correct = false;
    let detail = d.hint;
    if (choiceMode) {
      correct = selected === (current?.answer ?? d.answer);
      if (!correct) detail = chosen?.feedback || d.hint;
    } else if (d.kind === "ORDER") {
      correct = normalize(order.map((index) => d.tokens?.[index] || "").join(" ")) === normalize((d.expected || []).join(" "));
    } else if (d.kind === "MATCH") {
      correct = (d.pairs || []).every((pair, index) => normalize(matches[index] || "") === normalize(pair.right));
      if (!correct) detail = (d.pairs || []).find((pair, index) => normalize(matches[index] || "") !== normalize(pair.right))?.hint || "Ta'rifdagi kalit so'zni solishtiring: vazifa, joy yoki odamni anglatadimi?";
    } else if (d.kind === "SORT") {
      correct = (d.groups || []).every((group) => group.items.every((item) => groups[item] === group.label));
      if (!correct) {
        const misplaced = (d.groups || []).flatMap((group) => group.items.map((item) => ({ item, label: group.label }))).find((item) => groups[item.item] !== item.label);
        detail = `«${misplaced?.item || "Gap"}» guruhini qayta tekshiring. Boshida savol so'zi yoki yordamchi fe'l bormi?`;
      }
    } else if (d.kind === "READ-TYPE") {
      correct = (d.fields || []).every((field, index) => field.answers.some((answer) => normalize(fields[index] || "") === normalize(answer)));
      if (!correct) detail = (d.fields || []).find((field, index) => !field.answers.some((answer) => normalize(fields[index] || "") === normalize(answer)))?.hint || d.hint;
    }
    setAttempts(nextAttempts);
    if (correct && d.kind === "SCENE" && step < (d.steps?.length || 1) - 1) {
      setFeedback({ good: true, text: "To'g'ri. Keyingi savolga o'ting." });
      setTimeout(() => { setStep((value) => value + 1); setSelected(null); setFeedback(null); checking.current = false; }, 650);
      return;
    }
    setFeedback({ good: correct, text: correct ? d.success : detail });
    onSubmit?.({ questionText: d.questionText, correct, meta: { taskId: d.id, kind: d.kind, attempts: nextAttempts } });
    if (correct) setLocked(true);
    else { setSelected(null); setShuffle((value) => value + 1); setOrder([]); }
    checking.current = false;
  }, [ready, attempts, choiceMode, selected, current, d, chosen, order, matches, groups, fields, step, onSubmit]);
  useEffect(() => { registerCheck?.(check); }, [registerCheck, check]);
  const taskNumber = d.id.match(/p(\d+)$/)?.[1] || "";
  const sortedItems = d.kind === "SORT" ? (d.groups || []).flatMap((group) => group.items).sort((a, b) => a.localeCompare(b)) : [];
  const matchRows = (d.pairs || []).map((pair, index) => ({ pair, index }));
  const visibleMatches = compact ? matchRows.slice(page * 3, page * 3 + 3) : matchRows;
  const visibleSort = compact ? sortedItems.slice(page * 4, page * 4 + 4) : sortedItems;
  const totalPages = d.kind === "MATCH" ? Math.ceil(matchRows.length / 3) : Math.ceil(sortedItems.length / 4);
  return <div className={`pt ${fullScreen ? "pt-full" : ""}`}><style>{STYLE}</style><main className="pt-shell">
    <div className="pt-head">M1L01 · Practice {taskNumber}</div>
    <h1>{d.title}</h1><p className="pt-sub">{d.instruction}</p>
    {d.passage && <div className="pt-passage">{d.passage}</div>}
    <p className="pt-question">{current?.prompt || d.prompt || d.questionText}</p>
    {d.kind === "SCENE" && <div className="pt-progress" aria-label={`Qadam ${step + 1} / ${d.steps?.length || 3}`}>{d.steps?.map((_, index) => <span key={index} className={index <= step ? "on" : ""} />)}</div>}
    {choiceMode && <div className="pt-grid" role="group" aria-label={d.questionText}>{orderIndexes.map((index) => <button key={`${step}-${index}`} type="button" className={`pt-button ${selected === index ? "sel" : ""} ${feedback && selected === index ? feedback.good ? "correct" : "wrong" : ""}`} aria-pressed={selected === index} disabled={locked || review} onClick={() => { setSelected(index); setFeedback(null); }}><span className="pt-chip">{String.fromCharCode(65 + index)}</span>{options[index].label}</button>)}</div>}
    {d.kind === "ORDER" && <><div className="pt-build" aria-live="polite">{order.length ? order.map((index, position) => <button key={position} type="button" className="pt-token sel" disabled={locked || review} onClick={() => setOrder(order.filter((_, place) => place !== position))}>{d.tokens?.[index]}</button>) : "So'zlarni tartib bilan tanlang"}</div><div className="pt-row">{d.tokens?.map((token, index) => <button key={index} type="button" className="pt-token" disabled={locked || review || order.includes(index)} onClick={() => { setOrder([...order, index]); setFeedback(null); }}>{token}</button>)}</div></>}
    {d.kind === "MATCH" && <div className="pt-list pt-pairs-grid">{visibleMatches.map(({ pair, index }) => <div className={`pt-pair ${feedback ? normalize(matches[index] || "") === normalize(pair.right) ? "correct" : "wrong" : ""}`} key={pair.left}><span className="pt-button">{pair.left}</span><select aria-label={`${pair.left} ta'rifi`} disabled={locked || review} value={matches[index] || ""} onChange={(event) => { setMatches({ ...matches, [index]: event.target.value }); setFeedback(null); }}><option value="">Ta&apos;rifni tanlang</option>{[...(d.pairs || [])].sort((a,b) => a.right.localeCompare(b.right)).map((item) => <option key={item.right} value={item.right}>{item.right}</option>)}</select></div>)}</div>}
    {d.kind === "SORT" && <div className="pt-list pt-pairs-grid">{visibleSort.map((item) => <div className={`pt-pair ${feedback ? groups[item] === d.groups?.find((group) => group.items.includes(item))?.label ? "correct" : "wrong" : ""}`} key={item}><span className="pt-button">{item}</span><select aria-label={`${item} guruhi`} disabled={locked || review} value={groups[item] || ""} onChange={(event) => { setGroups({ ...groups, [item]: event.target.value }); setFeedback(null); }}><option value="">Guruhni tanlang</option>{d.groups?.map((group) => <option key={group.label} value={group.label}>{group.label}</option>)}</select></div>)}</div>}
    {compact && (d.kind === "MATCH" || d.kind === "SORT") && <div className="pt-row" aria-label={`Qism ${page + 1} / ${totalPages}`}><button type="button" className="pt-token" disabled={page === 0} onClick={() => setPage((value) => value - 1)}>← Oldingi</button><span>{page + 1}/{totalPages}</span><button type="button" className="pt-token" disabled={page >= totalPages - 1} onClick={() => setPage((value) => value + 1)}>Keyingi →</button></div>}
    {d.kind === "READ-TYPE" && <div className="pt-grid">{d.fields?.map((field, index) => <div className="pt-field" key={field.label}><label htmlFor={`${d.id}-${index}`}>{field.label}</label><input id={`${d.id}-${index}`} className="pt-input" disabled={locked || review} value={fields[index] || ""} onChange={(event) => { setFields({ ...fields, [index]: event.target.value }); setFeedback(null); }} autoComplete="off" /></div>)}</div>}
    {feedback && <div className={`pt-help ${feedback.good ? "good" : "bad"}`} role="status"><span aria-hidden="true">{feedback.good ? "✓" : "!"}</span><span>{feedback.text}</span></div>}
    <p className="pt-foot">{review ? "Ko'rib chiqish rejimi" : lang === "en" ? "Use the platform's Check button." : lang === "ru" ? "Нажмите кнопку проверки на платформе." : "Javob tayyor bo'lgach, platformadagi «Tekshirish» tugmasini bosing."}</p>
  </main></div>;
}
