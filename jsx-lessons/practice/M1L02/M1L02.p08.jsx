import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L02","seq":8,"mechanic":"SORT"};
const task = {
  "id": "M1L02-p08",
  "kind": "SORT",
  "title": "Odat va hozir",
  "instruction": "Har bir gap yoki atamani mos guruhga ajrating.",
  "questionText": "Elementlarni mos guruhga ajrating.",
  "groups": [
    {
      "label": "Odat",
      "items": [
        "The scale opens at six.",
        "Drivers park here every evening.",
        "She usually checks the appointment.",
        "We load trucks on Fridays."
      ]
    },
    {
      "label": "Hozir",
      "items": [
        "The scale is opening now.",
        "The driver is parking at the yard.",
        "She is checking the appointment now.",
        "We are loading a truck at the dock."
      ]
    }
  ],
  "hint": "Usually, every va haftalik vaqt odatni; is/are + -ing hozirni bildiradi.",
  "success": "8 ta gap to‘g‘ri ajratildi."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
