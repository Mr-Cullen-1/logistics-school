import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L07","seq":8,"mechanic":"REPLY"};
const task = {
  "id": "M1L07-p08",
  "kind": "REPLY",
  "title": "Narx juda past",
  "instruction": "Vaziyatga mos javobni tanlang.",
  "questionText": "Broker: That's too low. Qaysi shartli javob mos?",
  "options": [
    {
      "label": "If you can add $200, I can cover the load."
    },
    {
      "label": "If you will add $200, I cover the load."
    },
    {
      "label": "You add $200 now!"
    }
  ],
  "answer": 0,
  "hint": "Taklifni If + Present bilan muloyim bildiring.",
  "success": "If you can add $200, I can cover the load."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
