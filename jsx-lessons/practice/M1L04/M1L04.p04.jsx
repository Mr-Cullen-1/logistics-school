import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L04","seq":4,"mechanic":"GAP"};
const task = {
  "id": "M1L04-p04",
  "kind": "GAP",
  "title": "Have yoki has?",
  "instruction": "Bo'sh joyga mos so'zni tanlang.",
  "questionText": "The driver ___ not arrived yet.",
  "options": [
    {
      "label": "has"
    },
    {
      "label": "have"
    },
    {
      "label": "is"
    }
  ],
  "answer": 0,
  "hint": "The driver = he.",
  "success": "The driver has not arrived yet."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
