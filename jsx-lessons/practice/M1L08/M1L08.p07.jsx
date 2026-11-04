import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L08","seq":7,"mechanic":"FIX"};
const task = {
  "id": "M1L08-p07",
  "kind": "FIX",
  "title": "Atamani tuzating",
  "instruction": "Xatoni topib, to'g'ri variantni tanlang.",
  "questionText": "The receiver picked up the freight from the shipper. Odatdagi rollar bo‘yicha to‘g‘ri gap qaysi?",
  "options": [
    {
      "label": "The carrier picked up the freight from the shipper."
    },
    {
      "label": "The POD picked up the freight from the shipper."
    },
    {
      "label": "The rate picked up the freight from the shipper."
    }
  ],
  "answer": 0,
  "hint": "Yukni tashuvchi tomon carrier.",
  "success": "The carrier picked up the freight from the shipper."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
