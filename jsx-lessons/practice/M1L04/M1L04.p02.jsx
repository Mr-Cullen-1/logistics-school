import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L04","seq":2,"mechanic":"MATCH"};
const task = {
  "id": "M1L04-p02",
  "kind": "MATCH",
  "title": "Holat so‘zlari",
  "instruction": "Har bir atamani mos ta'rif bilan juftlang.",
  "questionText": "Atamalarni ta'riflari bilan moslang.",
  "pairs": [
    {
      "left": "yet",
      "right": "hali; savol yoki inkorda",
      "hint": "So‘zning ma’nosi va gapdagi vazifasini solishtiring."
    },
    {
      "left": "already",
      "right": "allaqachon; tasdiqda",
      "hint": "So‘zning ma’nosi va gapdagi vazifasini solishtiring."
    },
    {
      "left": "just",
      "right": "hozirgina; yangi natija",
      "hint": "So‘zning ma’nosi va gapdagi vazifasini solishtiring."
    },
    {
      "left": "still",
      "right": "hali ham; davom etayotgan holat",
      "hint": "So‘zning ma’nosi va gapdagi vazifasini solishtiring."
    },
    {
      "left": "since",
      "right": "...dan beri; boshlanish nuqtasi",
      "hint": "So‘zning ma’nosi va gapdagi vazifasini solishtiring."
    },
    {
      "left": "for",
      "right": "... davomida; vaqt oralig‘i",
      "hint": "So‘zning ma’nosi va gapdagi vazifasini solishtiring."
    }
  ],
  "hint": "So‘zning ma’nosi va gapdagi vazifasini solishtiring.",
  "success": "Holat so‘zlari to‘g‘ri moslandi."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
