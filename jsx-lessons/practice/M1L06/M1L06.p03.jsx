import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L06","seq":3,"mechanic":"READ-MC"};
const task = {
  "id": "M1L06-p03",
  "kind": "READ-MC",
  "title": "Qo‘ng‘iroq ohangi",
  "instruction": "Xabarni o'qib, to'g'ri javobni tanlang.",
  "questionText": "Qaysi javob qo‘pol buyruq hisoblanadi?",
  "options": [
    {
      "label": "Send it now!"
    },
    {
      "label": "Could you resend it, please?"
    },
    {
      "label": "Would you mind checking it?"
    }
  ],
  "answer": 0,
  "hint": "Please yoki could/would bo‘lmagan buyruqqa qarang.",
  "success": "Send it now! — qo‘pol buyruq.",
  "passage": "Dispatcher: Could you resend the BOL, please?\nBroker: Sure.\nDriver: Send it now!"
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
