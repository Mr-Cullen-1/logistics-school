import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L07","seq":6,"mechanic":"ORDER"};
const task = {
  "id": "M1L07-p06",
  "kind": "ORDER",
  "title": "Shart va natija",
  "instruction": "So'zlarni to'g'ri tartibda joylang.",
  "questionText": "Narx mos bo‘lsa yukni olishingizni ayting.",
  "tokens": [
    ".",
    "it",
    "take",
    "will",
    "I",
    ",",
    "more",
    "pay",
    "can",
    "you",
    "If"
  ],
  "expected": [
    "If",
    "you",
    "can",
    "pay",
    "more",
    ",",
    "I",
    "will",
    "take",
    "it",
    "."
  ],
  "hint": "If + Present, will + fe’l.",
  "success": "If you can pay more, I will take it."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
