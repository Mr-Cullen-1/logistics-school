import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L03","seq":3,"mechanic":"READ-MC"};
const task = {
  "id": "M1L03-p03",
  "kind": "READ-MC",
  "title": "Yetkazish vaqti",
  "instruction": "Xabarni o'qib, to'g'ri javobni tanlang.",
  "questionText": "Yuk qachon topshirildi?",
  "options": [
    {
      "label": "2:15 PM"
    },
    {
      "label": "9:00 AM"
    },
    {
      "label": "4:30 PM"
    }
  ],
  "answer": 0,
  "hint": "Delivered so‘zidan keyingi vaqtni toping.",
  "success": "Yuk 2:15 PM da topshirilgan.",
  "passage": "Driver: I left the yard at 9:00 AM. I delivered the load at 2:15 PM and sent the POD at 4:30 PM."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
