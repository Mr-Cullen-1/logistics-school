import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L07","seq":1,"mechanic":"MC"};
const task = {
  "id": "M1L07-p01",
  "kind": "MC",
  "title": "Agar narx mos bo‘lsa",
  "instruction": "To'g'ri javobni tanlang.",
  "questionText": "If you ___ $2,400, I can book it.",
  "options": [
    {
      "label": "offer"
    },
    {
      "label": "will offer"
    },
    {
      "label": "offered"
    }
  ],
  "answer": 0,
  "hint": "If qismida Present Simple ishlatiladi.",
  "success": "If you offer $2,400, I can book it."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
