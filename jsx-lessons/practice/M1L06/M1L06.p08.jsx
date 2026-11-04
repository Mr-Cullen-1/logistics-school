import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L06","seq":8,"mechanic":"REPLY"};
const task = {
  "id": "M1L06-p08",
  "kind": "REPLY",
  "title": "Bir daqiqa kutish",
  "instruction": "Vaziyatga mos javobni tanlang.",
  "questionText": "Broker: Can you hold for a minute?",
  "options": [
    {
      "label": "Of course. I can hold."
    },
    {
      "label": "No, hold me!"
    },
    {
      "label": "Yes, I holding."
    }
  ],
  "answer": 0,
  "hint": "Muloyim va grammatik to‘g‘ri javobni tanlang.",
  "success": "Of course. I can hold."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
