import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L04","seq":6,"mechanic":"ORDER"};
const task = {
  "id": "M1L04-p06",
  "kind": "ORDER",
  "title": "Hozirgina jo‘nadi",
  "instruction": "So'zlarni to'g'ri tartibda joylang.",
  "questionText": "Haydovchi hozirgina ketganini bildiring.",
  "tokens": [
    ".",
    "left",
    "just",
    "has",
    "driver",
    "The"
  ],
  "expected": [
    "The",
    "driver",
    "has",
    "just",
    "left",
    "."
  ],
  "hint": "Ega + has + just + V3.",
  "success": "The driver has just left."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
