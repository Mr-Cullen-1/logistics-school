import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L04","seq":8,"mechanic":"SORT"};
const task = {
  "id": "M1L04-p08",
  "kind": "SORT",
  "title": "Natija yoki o‘tgan vaqt",
  "instruction": "Har bir gap yoki atamani mos guruhga ajrating.",
  "questionText": "Elementlarni mos guruhga ajrating.",
  "groups": [
    {
      "label": "Present Perfect",
      "items": [
        "We have received the BOL.",
        "She has already confirmed the load.",
        "The truck has just left.",
        "Have you sent the invoice yet?"
      ]
    },
    {
      "label": "Past Simple",
      "items": [
        "We received the BOL at noon.",
        "She confirmed the load yesterday.",
        "The truck left at 8 AM.",
        "Did you send the invoice on Monday?"
      ]
    }
  ],
  "hint": "Aniq o‘tgan vaqt bo‘lsa Past Simple.",
  "success": "Natija va aniq vaqtli voqealar ajratildi."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
