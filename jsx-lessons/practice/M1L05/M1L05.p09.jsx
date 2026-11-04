import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L05","seq":9,"mechanic":"READ-TYPE"};
const task = {
  "id": "M1L05-p09",
  "kind": "READ-TYPE",
  "title": "Yangi appointment",
  "instruction": "Xabarni o'qib, kerakli ma'lumotni yozing.",
  "questionText": "Qayta rejalangan sana va vaqtni yozing.",
  "fields": [
    {
      "label": "Sana",
      "answers": [
        "May 18",
        "18 May"
      ],
      "hint": "Rescheduled for iborasini toping."
    },
    {
      "label": "Vaqt",
      "answers": [
        "7:30 AM",
        "7:30",
        "07:30 AM"
      ],
      "hint": "Rescheduled for iborasini toping."
    }
  ],
  "hint": "Rescheduled for iborasini toping.",
  "success": "Appointment May 18, 7:30 AM ga ko‘chirildi.",
  "passage": "Broker: The May 17 pickup is canceled. We have rescheduled the appointment for May 18 at 7:30 AM."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
