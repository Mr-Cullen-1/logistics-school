import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L08","seq":8,"mechanic":"TYPE"};
const task = {
  "id": "M1L08-p08",
  "kind": "TYPE",
  "title": "Atamalarni yozing",
  "instruction": "Javobni inglizcha yozing.",
  "questionText": "Ta’riflarga mos inglizcha atamalarni yozing.",
  "fields": [
    {
      "label": "Harorat nazoratli treyler",
      "answers": [
        "reefer"
      ],
      "hint": "Equipment, document va money atamalarini eslang."
    },
    {
      "label": "Yetkazish dalili",
      "answers": [
        "POD"
      ],
      "hint": "Equipment, document va money atamalarini eslang."
    },
    {
      "label": "Yuksiz masofa",
      "answers": [
        "deadhead"
      ],
      "hint": "Equipment, document va money atamalarini eslang."
    }
  ],
  "hint": "Equipment, document va money atamalarini eslang.",
  "success": "Reefer, POD va deadhead to‘g‘ri yozildi."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
