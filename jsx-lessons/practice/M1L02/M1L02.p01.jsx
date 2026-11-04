import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L02","seq":1,"mechanic":"MC"};
const task = {
  "id": "M1L02-p01",
  "kind": "MC",
  "title": "Hozir nima bo‘lyapti?",
  "instruction": "To'g'ri javobni tanlang.",
  "questionText": "He ___ at the dock now.",
  "options": [
    {
      "label": "is waiting"
    },
    {
      "label": "waits"
    },
    {
      "label": "wait"
    }
  ],
  "answer": 0,
  "hint": "Now hozir davom etayotgan ishni bildiradi.",
  "success": "He is waiting at the dock now."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
