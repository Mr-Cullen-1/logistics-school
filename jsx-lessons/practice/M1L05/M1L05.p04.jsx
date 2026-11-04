import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L05","seq":4,"mechanic":"GAP"};
const task = {
  "id": "M1L05-p04",
  "kind": "GAP",
  "title": "Tirbandlik bashorati",
  "instruction": "Bo'sh joyga mos so'zni tanlang.",
  "questionText": "Look at the traffic. He ___ be late.",
  "options": [
    {
      "label": "is going to"
    },
    {
      "label": "will to"
    },
    {
      "label": "going"
    }
  ],
  "answer": 0,
  "hint": "Ko‘rinib turgan dalilga asoslangan bashorat: is going to.",
  "success": "He is going to be late."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
