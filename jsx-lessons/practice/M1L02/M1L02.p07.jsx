import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L02","seq":7,"mechanic":"FIX"};
const task = {
  "id": "M1L02-p07",
  "kind": "FIX",
  "title": "Ortiqcha is",
  "instruction": "Xatoni topib, to'g'ri variantni tanlang.",
  "questionText": "She is usually works at night. To‘g‘ri shakl qaysi?",
  "options": [
    {
      "label": "She usually works at night."
    },
    {
      "label": "She is usually work at night."
    },
    {
      "label": "She usually working at night."
    }
  ],
  "answer": 0,
  "hint": "Usually odatni bildiradi; works yakka fe’l bo‘ladi.",
  "success": "She usually works at night."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
