import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L03","seq":6,"mechanic":"TYPE"};
const task = {
  "id": "M1L03-p06",
  "kind": "TYPE",
  "title": "Fe’llarni o‘zgartiring",
  "instruction": "Javobni inglizcha yozing.",
  "questionText": "Fe’llarning Past Simple shaklini yozing.",
  "fields": [
    {
      "label": "leave",
      "answers": [
        "left"
      ],
      "hint": "Har biri noto‘g‘ri fe’l."
    },
    {
      "label": "send",
      "answers": [
        "sent"
      ],
      "hint": "Har biri noto‘g‘ri fe’l."
    },
    {
      "label": "get",
      "answers": [
        "got"
      ],
      "hint": "Har biri noto‘g‘ri fe’l."
    },
    {
      "label": "take",
      "answers": [
        "took"
      ],
      "hint": "Har biri noto‘g‘ri fe’l."
    }
  ],
  "hint": "Har biri noto‘g‘ri fe’l.",
  "success": "left, sent, got, took — hammasi to‘g‘ri."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
