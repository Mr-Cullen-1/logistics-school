import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L04","seq":1,"mechanic":"MC"};
const task = {
  "id": "M1L04-p01",
  "kind": "MC",
  "title": "Hozirgi natija",
  "instruction": "To'g'ri javobni tanlang.",
  "questionText": "The document is with the broker now. I ___ the BOL.",
  "options": [
    {
      "label": "have sent"
    },
    {
      "label": "sent yesterday"
    },
    {
      "label": "sending"
    }
  ],
  "answer": 0,
  "hint": "Hozirgi natija uchun have + V3 ishlating.",
  "success": "I have sent the BOL."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
