import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L05","seq":3,"mechanic":"READ-MC"};
const task = {
  "id": "M1L05-p03",
  "kind": "READ-MC",
  "title": "ETA ni toping",
  "instruction": "Xabarni o'qib, to'g'ri javobni tanlang.",
  "questionText": "Haydovchining ETA si qachon?",
  "options": [
    {
      "label": "4:20 PM"
    },
    {
      "label": "3:00 PM"
    },
    {
      "label": "5:15 PM"
    }
  ],
  "answer": 0,
  "hint": "ETA so‘zidan keyingi vaqtga qarang.",
  "success": "ETA — 4:20 PM.",
  "passage": "Dispatcher: Pickup window starts at 3:00 PM.\nDriver: Traffic is slow. My ETA is 4:20 PM.\nBroker: The dock closes at 5:15 PM."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
