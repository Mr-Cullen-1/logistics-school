import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L06","seq":7,"mechanic":"FIX"};
const task = {
  "id": "M1L06-p07",
  "kind": "FIX",
  "title": "Must dan keyin",
  "instruction": "Xatoni topib, to'g'ri variantni tanlang.",
  "questionText": "You must to arrive at 8. Qaysi gap to‘g‘ri?",
  "options": [
    {
      "label": "You must arrive at 8."
    },
    {
      "label": "You must arriving at 8."
    },
    {
      "label": "You must to arriving at 8."
    }
  ],
  "answer": 0,
  "hint": "Must dan keyin to qo‘yilmaydi.",
  "success": "You must arrive at 8."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
