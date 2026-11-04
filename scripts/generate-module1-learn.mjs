/** Generate standalone Module 1 Learn JSX files from MODULE1_LESSONS.md. */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { openingTheory } from "./module1-theory.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const lessons = join(root, "jsx-lessons", "module-01");
const source = readFileSync(join(lessons, "MODULE1_LESSONS.md"), "utf8");
const template = readFileSync(join(root, "scripts", "module1-learn-template.jsx.txt"), "utf8");
const clean = value => value.trim().replace(/\s+/g, " ").trim();
const plain = value => clean(value.replace(/\*\*|\*|`/g, ""));

function questionFromLine(line, prefix = "") {
  const match = /\bA\s+(.+?)\s+·\s+B\s+(.+?)\s+·\s+C\s+(.+)/.exec(line);
  if (!match) return null;
  let third = match[3];
  let why = "";
  const note = /\s+—\s+Izoh:\s*/.exec(third);
  if (note) { why = plain(third.slice(note.index + note[0].length)); third = third.slice(0, note.index); }
  const raw = [match[1], match[2], third];
  const answer = raw.findIndex(option => option.includes("✓"));
  if (answer < 0) return null;
  const stem = plain(line.slice(0, match.index).replace(/^(?:-\s*)?(?:\d+\.\s*)?(?:\*\*[^*]+\*\*:\s*)?/, "")).replaceAll("—", " ").trim();
  return { stem: clean(`${prefix.replace(/^-\s*/, "")} ${/^Variantlar:/i.test(stem) ? "" : stem}`), options: raw.map(option => plain(option.replaceAll("✓", ""))), answer, why };
}

function parseSlide(number, heading, body) {
  const low = heading.toLowerCase();
  const kind = low.includes("mission") ? "mission"
    : /^read\b/.test(low) ? "read"
    : low.includes("vocabulary") || /^(equipment|documents|people|money|places)\b/.test(low) ? "vocab"
    : ["guided check", "fix it", "role-play", "rapid test", "checkpoint 1"].some(x => low.includes(x)) ? "quiz"
    : low.includes("build") ? "build"
    : low.includes("summary") ? "summary" : "reveal";
  const data = { number, heading: plain(heading), kind };
  const lines = body.split(/\r?\n/).map(x => x.trim()).filter(x => x && x !== "---");
  if (kind === "quiz" || kind === "mission") {
    let context = "";
    const missionQuestion = kind === "mission" ? plain(lines.find(line => line.startsWith("- **Savol:")) || "").replace(/^[- ]*Savol:\s*/, "") : "";
    const questions = [];
    for (const line of lines) {
      if (/^-?\s*\*\*(?:Qadam|Raund)\s+\d/.test(line)) context = plain(line);
      const question = questionFromLine(line, line.startsWith("- A ") ? context : "");
      if (question) { if (!question.stem) question.stem = context || missionQuestion; questions.push(question); context = ""; }
    }
    data.questions = questions;
    data.intro = lines.filter(line => line.startsWith("- **Ekranda:")).map(plain);
  } else if (kind === "read") {
    data.chat = [];
    data.translation = "";
    for (const line of lines) {
      if (line.includes("**Tarjima")) data.translation = plain(line.slice(line.indexOf(":") + 1));
      else {
        const match = /^-\s+([\w ]+):\s*\*(.+)\*/.exec(line);
        if (match) data.chat.push([match[1], match[2]]);
      }
    }
  } else if (kind === "vocab") {
    data.rows = lines.filter(line => line.startsWith("|"))
      .map(line => line.replace(/^\||\|$/g, "").split("|").map(plain))
      .filter(cells => cells.length === 3 && cells[0] !== "So'z" && !cells[0].startsWith("---"));
  } else if (kind === "build") {
    data.builds = lines.map(line => /\*([^*]+)\*\s*→\s*\*\*([^*]+)\*\*/.exec(line)).filter(Boolean)
      .map(match => ({ parts: match[1].split(" / ").map(plain), answer: plain(match[2]) }));
  } else if (kind === "summary") {
    const bank = lines.find(line => line.includes("Phrase bank")) || "";
    data.phrases = [...bank.replace(/^-?\s*\*\*[^*]+\*\*\s*/, "").matchAll(/\*([^*]+)\*/g)].map(match => plain(match[1]));
    data.extras = lines.filter(line => !line.includes("Phrase bank") && !line.includes("Say it aloud")).map(plain);
  } else {
    data.cards = lines.filter(line => !line.startsWith("|---") && !line.startsWith("| So'z"))
      .map(line => plain(line.replace(/^(?:-\s*|\d+\.\s*)/, "")));
  }
  return data;
}

const matches = [...source.matchAll(/^## (M1L0[2-8]) — (.+)$/gm)];
for (const [index, match] of matches.entries()) {
  const [full, code, title] = match;
  const end = matches[index + 1]?.index ?? source.search(/^## Xulosa/gm);
  const section = source.slice(match.index + full.length, end > 0 ? end : undefined);
  const tags = [...(section.match(/\*\*skillTags:\*\*\s*(.+)/)?.[1] || "").matchAll(/`([^`]+)`/g)].map(x => x[1]);
  const goal = plain(section.match(/\*\*Maqsad:\*\*\s*(.+)/)?.[1] || "");
  const heads = [...section.matchAll(/^#### S(\d+) · (.+)$/gm)];
  const lessonSlides = heads.map((headingMatch, slideIndex) => parseSlide(
    Number(headingMatch[1]), headingMatch[2],
    section.slice(headingMatch.index + headingMatch[0].length, heads[slideIndex + 1]?.index ?? section.length),
  ));
  if (![14, 15].includes(lessonSlides.length)) throw new Error(`${code}: ${lessonSlides.length} lesson slides`);
  const theory = openingTheory[code];
  if (!theory || theory.length !== 5 || theory.some(item => item.steps.length !== 3 || item.points.length !== 2 || !item.wrong || !item.right)) {
    throw new Error(`${code}: five complete opening theory slides required`);
  }
  const slides = [...theory, ...lessonSlides];
  for (const slide of lessonSlides) {
    if (["mission", "quiz"].includes(slide.kind) && !slide.questions.length) throw new Error(`${code} S${slide.number}: no questions`);
    if (slide.kind === "vocab" && slide.rows.length !== 8) throw new Error(`${code} S${slide.number}: ${slide.rows.length} words`);
    if (slide.kind === "build" && slide.builds.length !== 3) throw new Error(`${code} S${slide.number}: ${slide.builds.length} builds`);
    if (slide.kind === "summary" && (slide.phrases.length !== 6 || slide.phrases.some(phrase => !phrase.trim()))) throw new Error(`${code} S${slide.number}: six phrases required`);
  }
  const data = { code, title, goal, skillTags: tags, slides, threshold: code === "M1L08" ? .7 : .6 };
  writeFileSync(join(lessons, `${code}.learn.jsx`), template.replace("__LESSON_DATA__", JSON.stringify(data)), "utf8");
  console.log(`${code}: 5 theory + ${lessonSlides.length} lesson slides, ${slides.reduce((n, s) => n + (s.questions?.length || 0), 0)} choice items`);
}
