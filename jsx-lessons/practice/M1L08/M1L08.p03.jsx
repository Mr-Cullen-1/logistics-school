import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L08","seq":3,"mechanic":"READ-MC"};
const task = {
  "id": "M1L08-p03",
  "kind": "READ-MC",
  "title": "Uskunani tanlang",
  "instruction": "Xabarni o'qib, to'g'ri javobni tanlang.",
  "questionText": "Muzlatilgan mahsulot uchun qaysi treyler kerak?",
  "options": [
    {
      "label": "Reefer"
    },
    {
      "label": "Dry van"
    },
    {
      "label": "Flatbed"
    }
  ],
  "answer": 0,
  "hint": "Harorat nazorati muhim.",
  "success": "Muzlatilgan yuk uchun reefer kerak.",
  "passage": "Shipper: The frozen food must stay at -5°F during the trip. Please send a temperature-controlled trailer."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
