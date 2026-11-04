import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L02","seq":9,"mechanic":"READ-TYPE"};
const task = {
  "id": "M1L02-p09",
  "kind": "READ-TYPE",
  "title": "Xabardagi holat",
  "instruction": "Xabarni o'qib, kerakli ma'lumotni yozing.",
  "questionText": "The driver is ___ .",
  "fields": [
    {
      "label": "Hozirgi ish",
      "answers": [
        "parking"
      ],
      "hint": "Parking at the yard iborasiga qarang."
    }
  ],
  "hint": "Xabardagi -ing fe’lni yozing.",
  "success": "The driver is parking.",
  "passage": "Driver: I am parking at the yard now. I will check in after that."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
