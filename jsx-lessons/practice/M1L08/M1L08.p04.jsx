import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L08","seq":4,"mechanic":"SORT"};
const task = {
  "id": "M1L08-p04",
  "kind": "SORT",
  "title": "Atamalarni guruhlang",
  "instruction": "Har bir gap yoki atamani mos guruhga ajrating.",
  "questionText": "Elementlarni mos guruhga ajrating.",
  "groups": [
    {
      "label": "Equipment",
      "items": [
        "dry van",
        "reefer",
        "flatbed"
      ]
    },
    {
      "label": "Documents",
      "items": [
        "BOL",
        "RC",
        "POD"
      ]
    },
    {
      "label": "Money",
      "items": [
        "rate",
        "detention",
        "lumper"
      ]
    },
    {
      "label": "People",
      "items": [
        "shipper",
        "receiver",
        "broker"
      ]
    }
  ],
  "hint": "Uskuna, hujjat, pul va odamni ajrating.",
  "success": "12 ta atama mos guruhlarga ajratildi."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
