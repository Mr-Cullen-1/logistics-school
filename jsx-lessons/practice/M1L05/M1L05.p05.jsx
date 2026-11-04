import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L05","seq":5,"mechanic":"GAP"};
const task = {
  "id": "M1L05-p05",
  "kind": "GAP",
  "title": "Kelishilgan delivery",
  "instruction": "Bo'sh joyga mos so'zni tanlang.",
  "questionText": "We ___ delivering at 9 tomorrow.",
  "options": [
    {
      "label": "are"
    },
    {
      "label": "will"
    },
    {
      "label": "is"
    }
  ],
  "answer": 0,
  "hint": "Present Continuous: we are + -ing.",
  "success": "We are delivering at 9 tomorrow."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
