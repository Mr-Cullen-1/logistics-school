import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L02","seq":6,"mechanic":"ORDER"};
const task = {
  "id": "M1L02-p06",
  "kind": "ORDER",
  "title": "Hozirgi jarayon",
  "instruction": "So'zlarni to'g'ri tartibda joylang.",
  "questionText": "Haydovchi hozir yuk tushiryapti.",
  "tokens": [
    ".",
    "now",
    "right",
    "unloading",
    "is",
    "driver",
    "The"
  ],
  "expected": [
    "The",
    "driver",
    "is",
    "unloading",
    "right",
    "now",
    "."
  ],
  "hint": "Present Continuous: ega + is + -ing.",
  "success": "The driver is unloading right now."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
