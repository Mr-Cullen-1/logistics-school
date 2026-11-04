import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L03","seq":9,"mechanic":"READ-TYPE"};
const task = {
  "id": "M1L03-p09",
  "kind": "READ-TYPE",
  "title": "Hisobotdan toping",
  "instruction": "Xabarni o'qib, kerakli ma'lumotni yozing.",
  "questionText": "Yuk qachon va qayerga yetkazildi?",
  "fields": [
    {
      "label": "Vaqt",
      "answers": [
        "11:45 AM",
        "11:45",
        "11.45 AM"
      ],
      "hint": "Delivered iborasidan keyingi ma’lumotlarga qarang."
    },
    {
      "label": "Joy",
      "answers": [
        "the Oakland warehouse",
        "Oakland warehouse",
        "Oakland"
      ],
      "hint": "Delivered iborasidan keyingi ma’lumotlarga qarang."
    }
  ],
  "hint": "Delivered iborasidan keyingi ma’lumotlarga qarang.",
  "success": "Yuk 11:45 AM da Oakland warehouse ga yetkazildi.",
  "passage": "Driver: I delivered the shipment to the Oakland warehouse at 11:45 AM. I sent the POD at noon."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
