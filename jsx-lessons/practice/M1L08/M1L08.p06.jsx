import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L08","seq":6,"mechanic":"MC"};
const task = {
  "id": "M1L08-p06",
  "kind": "MC",
  "title": "Yetkazish dalili",
  "instruction": "To'g'ri javobni tanlang.",
  "questionText": "Which document proves delivery?",
  "options": [
    {
      "label": "POD"
    },
    {
      "label": "RC"
    },
    {
      "label": "invoice"
    }
  ],
  "answer": 0,
  "hint": "Proof of Delivery qisqartmasini eslang.",
  "success": "POD yetkazib berilganini tasdiqlaydi."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
