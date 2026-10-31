import type { CSSProperties } from "react";

const choiceStyle: CSSProperties = { minHeight: 44, padding: "10px 15px", borderRadius: 9, border: "1px solid #bd985f", background: "#182329", color: "#f5f0e8", cursor: "pointer" };
const activeStyle: CSSProperties = { ...choiceStyle, background: "#d4af7c", color: "#15191b" };

export function MC({ question, options, value, onChange }: { question: string; options: { id: string; label: string }[]; value: string | null; onChange: (id: string) => void }) {
  return <div><p>{question}</p><div style={{ display: "grid", gap: 8 }}>{options.map((option) => <button type="button" key={option.id} style={value === option.id ? activeStyle : choiceStyle} aria-pressed={value === option.id} onClick={() => onChange(option.id)}>{option.label}</button>)}</div></div>;
}

export function GAP({ prompt, choices, value, onChange }: { prompt: string; choices: string[]; value: string | null; onChange: (word: string) => void }) {
  const [before, after = ""] = prompt.split("___");
  return <div><p>{before}<strong style={{ color: "#d4af7c" }}>{value || "_____"}</strong>{after}</p><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{choices.map((choice, index) => <button type="button" key={`${choice}-${index}`} style={value === choice ? activeStyle : choiceStyle} aria-pressed={value === choice} onClick={() => onChange(choice)}>{choice}</button>)}</div></div>;
}

export function ORDER({ tokens, value, onChange }: { tokens: string[]; value: string[]; onChange: (words: string[]) => void }) {
  return <div><p aria-live="polite">{value.length ? value.join(" ") : "So‘zlarni tartib bilan tanlang"}</p><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{tokens.map((token, index) => {
    const used = value.filter((word) => word === token).length > tokens.slice(0, index).filter((word) => word === token).length;
    return <button type="button" key={`${token}-${index}`} style={used ? activeStyle : choiceStyle} disabled={used} onClick={() => onChange([...value, token])}>{token}</button>;
  })}</div>{value.length > 0 && <button type="button" style={{ ...choiceStyle, marginTop: 12 }} onClick={() => onChange(value.slice(0, -1))}>Oxirgi so‘zni qaytarish</button>}</div>;
}
