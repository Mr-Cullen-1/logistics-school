import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L03","seq":7,"mechanic":"FIX"};
const task = {
  "id": "M1L03-p07",
  "kind": "FIX",
  "title": "Didn’t dan keyin",
  "instruction": "Xatoni topib, to'g'ri variantni tanlang.",
  "questionText": "The driver didn't arrived on time. To‘g‘ri shakl qaysi?",
  "options": [
    {
      "label": "The driver didn't arrive on time."
    },
    {
      "label": "The driver doesn't arrived on time."
    },
    {
      "label": "The driver didn't arriving on time."
    }
  ],
  "answer": 0,
  "hint": "Didn’t dan keyin fe’lning asosiy shakli keladi.",
  "success": "The driver didn't arrive on time."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
