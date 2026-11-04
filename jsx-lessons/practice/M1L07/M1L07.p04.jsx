import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L07","seq":4,"mechanic":"GAP"};
const task = {
  "id": "M1L07-p04",
  "kind": "GAP",
  "title": "Ob-havo sharti",
  "instruction": "Bo'sh joyga mos so'zni tanlang.",
  "questionText": "If it ___, we will reschedule.",
  "options": [
    {
      "label": "rains"
    },
    {
      "label": "will rain"
    },
    {
      "label": "rained"
    }
  ],
  "answer": 0,
  "hint": "If qismida hozirgi oddiy zamon.",
  "success": "If it rains, we will reschedule."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
