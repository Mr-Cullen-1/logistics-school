import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L05","seq":7,"mechanic":"FIX"};
const task = {
  "id": "M1L05-p07",
  "kind": "FIX",
  "title": "Will dan keyin",
  "instruction": "Xatoni topib, to'g'ri variantni tanlang.",
  "questionText": "I will to call you later. To‘g‘ri gap qaysi?",
  "options": [
    {
      "label": "I will call you later."
    },
    {
      "label": "I will calling you later."
    },
    {
      "label": "I will to calling you later."
    }
  ],
  "answer": 0,
  "hint": "Will dan keyin to ishlatilmaydi.",
  "success": "I will call you later."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
