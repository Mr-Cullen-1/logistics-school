import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L04","seq":3,"mechanic":"READ-MC"};
const task = {
  "id": "M1L04-p03",
  "kind": "READ-MC",
  "title": "Broker savoli",
  "instruction": "Xabarni o'qib, to'g'ri javobni tanlang.",
  "questionText": "Broker aynan nimani bilmoqchi?",
  "options": [
    {
      "label": "Haydovchi yetib kelgan-kelmaganini"
    },
    {
      "label": "BOL yuborilgan-yuborilmaganini"
    },
    {
      "label": "Narx tasdiqlanganini"
    }
  ],
  "answer": 0,
  "hint": "Has the driver arrived yet? gapiga qarang.",
  "success": "Broker haydovchining yetib kelganini so‘rayapti.",
  "passage": "Broker: Has the driver arrived at the warehouse yet?\nDispatcher: Not yet. The driver is still in transit."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
