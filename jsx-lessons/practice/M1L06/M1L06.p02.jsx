import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L06","seq":2,"mechanic":"MATCH"};
const task = {
  "id": "M1L06-p02",
  "kind": "MATCH",
  "title": "Modal ma’nolari",
  "instruction": "Har bir atamani mos ta'rif bilan juftlang.",
  "questionText": "Atamalarni ta'riflari bilan moslang.",
  "pairs": [
    {
      "left": "can",
      "right": "imkoniyat yoki ruxsat",
      "hint": "Modal fe’lning ish vaziyatidagi ma’nosini tanlang."
    },
    {
      "left": "could",
      "right": "muloyim iltimos",
      "hint": "Modal fe’lning ish vaziyatidagi ma’nosini tanlang."
    },
    {
      "left": "should",
      "right": "maslahat",
      "hint": "Modal fe’lning ish vaziyatidagi ma’nosini tanlang."
    },
    {
      "left": "have to",
      "right": "majburiyat",
      "hint": "Modal fe’lning ish vaziyatidagi ma’nosini tanlang."
    },
    {
      "left": "must",
      "right": "qat’iy talab",
      "hint": "Modal fe’lning ish vaziyatidagi ma’nosini tanlang."
    },
    {
      "left": "would",
      "right": "muloyim taklif yoki istak",
      "hint": "Modal fe’lning ish vaziyatidagi ma’nosini tanlang."
    }
  ],
  "hint": "Modal fe’lning ish vaziyatidagi ma’nosini tanlang.",
  "success": "Modallar to‘g‘ri moslandi."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
