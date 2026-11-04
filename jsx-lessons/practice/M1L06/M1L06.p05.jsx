import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L06","seq":5,"mechanic":"GAP"};
const task = {
  "id": "M1L06-p05",
  "kind": "GAP",
  "title": "Qayta so‘rash",
  "instruction": "Bo'sh joyga mos so'zni tanlang.",
  "questionText": "___ you repeat that, please?",
  "options": [
    {
      "label": "Could"
    },
    {
      "label": "Must"
    },
    {
      "label": "Have"
    }
  ],
  "answer": 0,
  "hint": "Muloyim iltimos uchun Could you ...?",
  "success": "Could you repeat that, please?"
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
