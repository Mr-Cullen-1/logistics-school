import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L05","seq":1,"mechanic":"MC"};
const task = {
  "id": "M1L05-p01",
  "kind": "MC",
  "title": "Tez va’da",
  "instruction": "To'g'ri javobni tanlang.",
  "questionText": "I ___ call you back in 10 minutes.",
  "options": [
    {
      "label": "will"
    },
    {
      "label": "am"
    },
    {
      "label": "calling to"
    }
  ],
  "answer": 0,
  "hint": "Hozir berilgan va’da uchun will.",
  "success": "I will call you back in 10 minutes."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
