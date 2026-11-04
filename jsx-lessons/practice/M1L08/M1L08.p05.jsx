import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L08","seq":5,"mechanic":"GAP"};
const task = {
  "id": "M1L08-p05",
  "kind": "GAP",
  "title": "Yukni kim jo‘natadi?",
  "instruction": "Bo'sh joyga mos so'zni tanlang.",
  "questionText": "The ___ gives the freight to the carrier at pickup.",
  "options": [
    {
      "label": "shipper"
    },
    {
      "label": "receiver"
    },
    {
      "label": "broker"
    }
  ],
  "answer": 0,
  "hint": "Pickupda yukni beradigan tomon kim?",
  "success": "The shipper gives the freight to the carrier."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
