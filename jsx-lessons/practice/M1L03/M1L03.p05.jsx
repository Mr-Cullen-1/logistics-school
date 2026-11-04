import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L03","seq":5,"mechanic":"ORDER"};
const task = {
  "id": "M1L03-p05",
  "kind": "ORDER",
  "title": "Yetkazish hisoboti",
  "instruction": "So'zlarni to'g'ri tartibda joylang.",
  "questionText": "3 PM dagi voqeani darak gap qilib yozing.",
  "tokens": [
    ".",
    "PM",
    "3",
    "at",
    "load",
    "the",
    "delivered",
    "We"
  ],
  "expected": [
    "We",
    "delivered",
    "the",
    "load",
    "at",
    "3",
    "PM",
    "."
  ],
  "hint": "O‘tgan zamon fe’li delivered.",
  "success": "We delivered the load at 3 PM."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
