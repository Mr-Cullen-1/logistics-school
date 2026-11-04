import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L04","seq":5,"mechanic":"GAP"};
const task = {
  "id": "M1L04-p05",
  "kind": "GAP",
  "title": "Savoldagi vaqt so‘zi",
  "instruction": "Bo'sh joyga mos so'zni tanlang.",
  "questionText": "Have you confirmed the rate ___?",
  "options": [
    {
      "label": "yet"
    },
    {
      "label": "already"
    },
    {
      "label": "still"
    }
  ],
  "answer": 0,
  "hint": "Hali bajarilgan-bajarilmaganini so‘rash uchun yet.",
  "success": "Have you confirmed the rate yet?"
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
