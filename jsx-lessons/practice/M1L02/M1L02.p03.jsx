import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L02","seq":3,"mechanic":"READ-MC"};
const task = {
  "id": "M1L02-p03",
  "kind": "READ-MC",
  "title": "Haydovchi xabari",
  "instruction": "Xabarni o'qib, to'g'ri javobni tanlang.",
  "questionText": "Haydovchi ayni paytda nima qilyapti?",
  "options": [
    {
      "label": "He is checking in."
    },
    {
      "label": "He checks in every morning."
    },
    {
      "label": "He has left the yard."
    }
  ],
  "answer": 0,
  "hint": "At the moment dan keyingi fe’lga qarang.",
  "success": "U hozir ro‘yxatdan o‘tmoqda.",
  "passage": "Driver: I usually arrive early. At the moment, I am checking in at the gate."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
