import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L05","seq":8,"mechanic":"REPLY"};
const task = {
  "id": "M1L05-p08",
  "kind": "REPLY",
  "title": "Pickup vaqti",
  "instruction": "Vaziyatga mos javobni tanlang.",
  "questionText": "Broker: Can you pick up at 6 AM?",
  "options": [
    {
      "label": "Yes, I can. I will be there by six."
    },
    {
      "label": "Yes, I am pick up at six."
    },
    {
      "label": "Yes, I will to be there."
    }
  ],
  "answer": 0,
  "hint": "Can savoliga aniq va xushmuomala javob bering.",
  "success": "Pickup 6 AM ga tasdiqlandi."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
