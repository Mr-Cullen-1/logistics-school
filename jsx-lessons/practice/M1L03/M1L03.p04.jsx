import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L03","seq":4,"mechanic":"GAP"};
const task = {
  "id": "M1L03-p04",
  "kind": "GAP",
  "title": "Didn’t bilan fe’l",
  "instruction": "Bo'sh joyga mos so'zni tanlang.",
  "questionText": "He ___ pick up the load yesterday.",
  "options": [
    {
      "label": "didn't"
    },
    {
      "label": "doesn't"
    },
    {
      "label": "wasn't"
    }
  ],
  "answer": 0,
  "hint": "Past Simple inkorida did not + asosiy fe’l ishlatiladi.",
  "success": "He didn't pick up the load yesterday."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
