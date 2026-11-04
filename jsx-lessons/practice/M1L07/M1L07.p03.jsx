import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L07","seq":3,"mechanic":"READ-MC"};
const task = {
  "id": "M1L07-p03",
  "kind": "READ-MC",
  "title": "Broker sharti",
  "instruction": "Xabarni o'qib, to'g'ri javobni tanlang.",
  "questionText": "Broker qaysi shartni qo‘ydi?",
  "options": [
    {
      "label": "Haydovchi 7 AM da yetib kelsa narxni ko‘taradi."
    },
    {
      "label": "Narxni har qanday holatda ko‘taradi."
    },
    {
      "label": "Haydovchi 7 PM da yetsa narxni pasaytiradi."
    }
  ],
  "answer": 0,
  "hint": "If shartini va vaqtni aniq o‘qing.",
  "success": "Shart: haydovchi 7 AM da yetib kelishi.",
  "passage": "Broker: If your driver can arrive by 7 AM, I will add $150 to the rate. Otherwise the rate stays the same."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
