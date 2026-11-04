import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L06","seq":6,"mechanic":"ORDER"};
const task = {
  "id": "M1L06-p06",
  "kind": "ORDER",
  "title": "Ismni harflab aytish",
  "instruction": "So'zlarni to'g'ri tartibda joylang.",
  "questionText": "Ismni muloyim so‘rang.",
  "tokens": [
    "?",
    "please",
    "name",
    "the",
    "spell",
    "you",
    "Could"
  ],
  "expected": [
    "Could",
    "you",
    "spell",
    "the",
    "name",
    "please",
    "?"
  ],
  "hint": "Could you + asosiy fe’l + please?",
  "success": "Could you spell the name, please?"
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
