import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L02","seq":4,"mechanic":"GAP"};
const task = {
  "id": "M1L02-p04",
  "kind": "GAP",
  "title": "Do yoki does?",
  "instruction": "Bo'sh joyga mos so'zni tanlang.",
  "questionText": "___ the receiver open on Sundays?",
  "options": [
    {
      "label": "Does"
    },
    {
      "label": "Do"
    },
    {
      "label": "Is"
    }
  ],
  "answer": 0,
  "hint": "The receiver birlikdagi ega.",
  "success": "Does the receiver open on Sundays?"
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
