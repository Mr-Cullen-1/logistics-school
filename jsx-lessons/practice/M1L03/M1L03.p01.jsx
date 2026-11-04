import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L03","seq":1,"mechanic":"MC"};
const task = {
  "id": "M1L03-p01",
  "kind": "MC",
  "title": "O‘tgan voqea",
  "instruction": "To'g'ri javobni tanlang.",
  "questionText": "The truck ___ at 7 AM yesterday.",
  "options": [
    {
      "label": "arrived"
    },
    {
      "label": "arrive"
    },
    {
      "label": "arriving"
    }
  ],
  "answer": 0,
  "hint": "Yesterday o‘tgan vaqtni bildiradi.",
  "success": "The truck arrived at 7 AM yesterday."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
