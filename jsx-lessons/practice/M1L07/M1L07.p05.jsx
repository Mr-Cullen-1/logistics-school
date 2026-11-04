import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L07","seq":5,"mechanic":"GAP"};
const task = {
  "id": "M1L07-p05",
  "kind": "GAP",
  "title": "Unless ma’nosi",
  "instruction": "Bo'sh joyga mos so'zni tanlang.",
  "questionText": "I can't book it ___ the rate goes up.",
  "options": [
    {
      "label": "unless"
    },
    {
      "label": "if"
    },
    {
      "label": "because"
    }
  ],
  "answer": 0,
  "hint": "Unless = agar ... bo‘lmasa.",
  "success": "I can't book it unless the rate goes up."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
