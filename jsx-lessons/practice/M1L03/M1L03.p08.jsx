import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L03","seq":8,"mechanic":"REPLY"};
const task = {
  "id": "M1L03-p08",
  "kind": "REPLY",
  "title": "POD haqida javob",
  "instruction": "Vaziyatga mos javobni tanlang.",
  "questionText": "Dispatcher: Did you get the POD?",
  "options": [
    {
      "label": "Yes, I got it after delivery."
    },
    {
      "label": "Yes, I get it yesterday."
    },
    {
      "label": "Yes, I did got it."
    }
  ],
  "answer": 0,
  "hint": "Did savoliga javobda voqea o‘tgan zamonda ifodalanadi.",
  "success": "Yes, I got it after delivery."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
