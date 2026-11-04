import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L02","seq":5,"mechanic":"GAP"};
const task = {
  "id": "M1L02-p05",
  "kind": "GAP",
  "title": "Birlikdagi fe’l",
  "instruction": "Bo'sh joyga mos so'zni tanlang.",
  "questionText": "The dispatcher ___ every truck before departure.",
  "options": [
    {
      "label": "checks"
    },
    {
      "label": "check"
    },
    {
      "label": "is check"
    }
  ],
  "answer": 0,
  "hint": "Every truck odatiy ish; ega birlikda.",
  "success": "The dispatcher checks every truck."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
