import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L04","seq":7,"mechanic":"FIX"};
const task = {
  "id": "M1L04-p07",
  "kind": "FIX",
  "title": "Aniq o‘tgan vaqt",
  "instruction": "Xatoni topib, to'g'ri variantni tanlang.",
  "questionText": "I have sent it yesterday. Qaysi tuzatish to‘g‘ri?",
  "options": [
    {
      "label": "I sent it yesterday."
    },
    {
      "label": "I have send it yesterday."
    },
    {
      "label": "I had sent it yesterday now."
    }
  ],
  "answer": 0,
  "hint": "Yesterday aniq o‘tgan vaqt; Past Simple kerak.",
  "success": "I sent it yesterday."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
