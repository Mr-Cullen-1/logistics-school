import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L07","seq":7,"mechanic":"FIX"};
const task = {
  "id": "M1L07-p07",
  "kind": "FIX",
  "title": "If qismidagi xato",
  "instruction": "Xatoni topib, to'g'ri variantni tanlang.",
  "questionText": "If you will pay more, I take it. To‘g‘ri shakl qaysi?",
  "options": [
    {
      "label": "If you pay more, I will take it."
    },
    {
      "label": "If you will pay more, I will take it."
    },
    {
      "label": "If you paid more, I take it."
    }
  ],
  "answer": 0,
  "hint": "If qismida will bo‘lmaydi; natijada will ishlatiladi.",
  "success": "If you pay more, I will take it."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
