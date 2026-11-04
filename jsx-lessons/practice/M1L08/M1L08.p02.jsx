import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L08","seq":2,"mechanic":"MATCH"};
const task = {
  "id": "M1L08-p02",
  "kind": "MATCH",
  "title": "Hujjatlar vazifasi",
  "instruction": "Har bir atamani mos ta'rif bilan juftlang.",
  "questionText": "Atamalarni ta'riflari bilan moslang.",
  "pairs": [
    {
      "left": "BOL",
      "right": "yuk qabul qilinganini qayd etuvchi hujjat",
      "hint": "Hujjat qaysi bosqichda kerakligini eslang."
    },
    {
      "left": "RC",
      "right": "narx va shartlarni tasdiqlovchi hujjat",
      "hint": "Hujjat qaysi bosqichda kerakligini eslang."
    },
    {
      "left": "POD",
      "right": "yetkazib berilganini tasdiqlovchi hujjat",
      "hint": "Hujjat qaysi bosqichda kerakligini eslang."
    },
    {
      "left": "invoice",
      "right": "to‘lov uchun hisob-faktura",
      "hint": "Hujjat qaysi bosqichda kerakligini eslang."
    },
    {
      "left": "packing list",
      "right": "qadoqlar tarkibi ro‘yxati",
      "hint": "Hujjat qaysi bosqichda kerakligini eslang."
    },
    {
      "left": "insurance certificate",
      "right": "sug‘urta qoplamasini tasdiqlovchi hujjat",
      "hint": "Hujjat qaysi bosqichda kerakligini eslang."
    }
  ],
  "hint": "Hujjat qaysi bosqichda kerakligini eslang.",
  "success": "Olti hujjatning vazifasi moslandi."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
