import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L06","seq":9,"mechanic":"READ-TYPE"};
const task = {
  "id": "M1L06-p09",
  "kind": "READ-TYPE",
  "title": "Iltimosdagi so‘z",
  "instruction": "Xabarni o'qib, kerakli ma'lumotni yozing.",
  "questionText": "___ you send it again?",
  "fields": [
    {
      "label": "Birinchi so‘z",
      "answers": [
        "Could"
      ],
      "hint": "Xabardagi iltimosning boshidagi modalni yozing."
    }
  ],
  "hint": "Xabardagi iltimosning boshidagi modalni yozing.",
  "success": "Could you send it again?",
  "passage": "Dispatcher: Could you send it again? The attachment did not open.\nBroker: Sure, I will resend it."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
