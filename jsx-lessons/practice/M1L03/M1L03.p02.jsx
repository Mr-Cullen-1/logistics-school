import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L03","seq":2,"mechanic":"MATCH"};
const task = {
  "id": "M1L03-p02",
  "kind": "MATCH",
  "title": "Noto‘g‘ri fe’llar",
  "instruction": "Har bir atamani mos ta'rif bilan juftlang.",
  "questionText": "Atamalarni ta'riflari bilan moslang.",
  "pairs": [
    {
      "left": "go",
      "right": "went",
      "hint": "O‘tgan zamon shakllarini yodga oling."
    },
    {
      "left": "get",
      "right": "got",
      "hint": "O‘tgan zamon shakllarini yodga oling."
    },
    {
      "left": "send",
      "right": "sent",
      "hint": "O‘tgan zamon shakllarini yodga oling."
    },
    {
      "left": "leave",
      "right": "left",
      "hint": "O‘tgan zamon shakllarini yodga oling."
    },
    {
      "left": "take",
      "right": "took",
      "hint": "O‘tgan zamon shakllarini yodga oling."
    },
    {
      "left": "bring",
      "right": "brought",
      "hint": "O‘tgan zamon shakllarini yodga oling."
    }
  ],
  "hint": "O‘tgan zamon shakllarini yodga oling.",
  "success": "Olti fe’lning Past Simple shakli topildi."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
