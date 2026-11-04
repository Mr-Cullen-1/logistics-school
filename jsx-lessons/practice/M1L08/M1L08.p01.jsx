import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L08","seq":1,"mechanic":"MATCH"};
const task = {
  "id": "M1L08-p01",
  "kind": "MATCH",
  "title": "Equipment atamalari",
  "instruction": "Har bir atamani mos ta'rif bilan juftlang.",
  "questionText": "Atamalarni ta'riflari bilan moslang.",
  "pairs": [
    {
      "left": "dry van",
      "right": "sovutishsiz yopiq treyler",
      "hint": "Uskunaning tuzilishi va vazifasiga qarang."
    },
    {
      "left": "reefer",
      "right": "harorat nazoratli treyler",
      "hint": "Uskunaning tuzilishi va vazifasiga qarang."
    },
    {
      "left": "flatbed",
      "right": "usti ochiq platformali treyler",
      "hint": "Uskunaning tuzilishi va vazifasiga qarang."
    },
    {
      "left": "box truck",
      "right": "bir korpusli kichikroq yuk mashinasi",
      "hint": "Uskunaning tuzilishi va vazifasiga qarang."
    },
    {
      "left": "power only",
      "right": "faqat traktor bilan tashish",
      "hint": "Uskunaning tuzilishi va vazifasiga qarang."
    },
    {
      "left": "step deck",
      "right": "pastki qismi tushirilgan platforma",
      "hint": "Uskunaning tuzilishi va vazifasiga qarang."
    }
  ],
  "hint": "Uskunaning tuzilishi va vazifasiga qarang.",
  "success": "Olti equipment atamasi to‘g‘ri topildi."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
