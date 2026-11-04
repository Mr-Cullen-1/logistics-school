import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L05","seq":6,"mechanic":"ORDER"};
const task = {
  "id": "M1L05-p06",
  "kind": "ORDER",
  "title": "Hozir yuboraman",
  "instruction": "So'zlarni to'g'ri tartibda joylang.",
  "questionText": "Rate confirmationni hozir yuborishga va’da bering.",
  "tokens": [
    ".",
    "now",
    "confirmation",
    "rate",
    "the",
    "send",
    "will",
    "I"
  ],
  "expected": [
    "I",
    "will",
    "send",
    "the",
    "rate",
    "confirmation",
    "now",
    "."
  ],
  "hint": "I + will + asosiy fe’l.",
  "success": "I will send the rate confirmation now."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
