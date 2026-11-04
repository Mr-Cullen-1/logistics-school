import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L06","seq":4,"mechanic":"GAP"};
const task = {
  "id": "M1L06-p04",
  "kind": "GAP",
  "title": "Majburiyat",
  "instruction": "Bo'sh joyga mos so'zni tanlang.",
  "questionText": "You ___ send the BOL before delivery.",
  "options": [
    {
      "label": "have to"
    },
    {
      "label": "could"
    },
    {
      "label": "can"
    }
  ],
  "answer": 0,
  "hint": "Bu ish talab qilinadi, tanlov emas.",
  "success": "You have to send the BOL before delivery."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
