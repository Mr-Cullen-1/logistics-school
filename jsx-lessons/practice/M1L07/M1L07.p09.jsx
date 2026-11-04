import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L07","seq":9,"mechanic":"READ-TYPE"};
const task = {
  "id": "M1L07-p09",
  "kind": "READ-TYPE",
  "title": "Taklifni toping",
  "instruction": "Xabarni o'qib, kerakli ma'lumotni yozing.",
  "questionText": "Qancha narx va qanday shart taklif qilindi?",
  "fields": [
    {
      "label": "Summa",
      "answers": [
        "$2,350",
        "2350",
        "2,350"
      ],
      "hint": "If qismidagi narx va vaqtni toping."
    },
    {
      "label": "Shart",
      "answers": [
        "if you deliver by noon",
        "deliver by noon",
        "delivery by noon",
        "by noon"
      ],
      "hint": "If qismidagi narx va vaqtni toping."
    }
  ],
  "hint": "If qismidagi narx va vaqtni toping.",
  "success": "Taklif: $2,350, agar tushgacha yetkazilsa.",
  "passage": "Broker: I can offer $2,350 if you deliver by noon. The lumper fee is separate."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
