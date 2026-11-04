import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L06","seq":1,"mechanic":"MC"};
const task = {
  "id": "M1L06-p01",
  "kind": "MC",
  "title": "Muloyim so‘rov",
  "instruction": "To'g'ri javobni tanlang.",
  "questionText": "Brokerdan rate confirmationni qanday so‘raysiz?",
  "options": [
    {
      "label": "Could you send me the rate, please?"
    },
    {
      "label": "Send me the rate!"
    },
    {
      "label": "You must send the rate now!"
    }
  ],
  "answer": 0,
  "hint": "Could you ... please? eng muloyim shakl.",
  "success": "So‘rov muloyim va aniq."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
