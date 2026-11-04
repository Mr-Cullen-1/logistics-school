import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L04","seq":9,"mechanic":"READ-TYPE"};
const task = {
  "id": "M1L04-p09",
  "kind": "READ-TYPE",
  "title": "Holatdagi fe’l",
  "instruction": "Xabarni o'qib, kerakli ma'lumotni yozing.",
  "questionText": "Has the truck ___ ?",
  "fields": [
    {
      "label": "Yetishmayotgan fe’l",
      "answers": [
        "arrived"
      ],
      "hint": "Has + V3 shaklini xabardan oling."
    }
  ],
  "hint": "Has + V3 shaklini xabardan oling.",
  "success": "Has the truck arrived?",
  "passage": "Broker: Has the truck arrived?\nDispatcher: No, it has not arrived yet."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
