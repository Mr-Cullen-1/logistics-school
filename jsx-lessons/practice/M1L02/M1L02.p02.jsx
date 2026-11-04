import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L02","seq":2,"mechanic":"MATCH"};
const task = {
  "id": "M1L02-p02",
  "kind": "MATCH",
  "title": "Vaqt belgilari",
  "instruction": "Har bir atamani mos ta'rif bilan juftlang.",
  "questionText": "Atamalarni ta'riflari bilan moslang.",
  "pairs": [
    {
      "left": "usually",
      "right": "odatda; takrorlanadigan ish",
      "hint": "Odat belgisi Present Simple, ayni payt belgisi Present Continuous bilan keladi."
    },
    {
      "left": "now",
      "right": "hozir; ayni paytdagi ish",
      "hint": "Odat belgisi Present Simple, ayni payt belgisi Present Continuous bilan keladi."
    },
    {
      "left": "every day",
      "right": "har kuni; odatiy ish",
      "hint": "Odat belgisi Present Simple, ayni payt belgisi Present Continuous bilan keladi."
    },
    {
      "left": "at the moment",
      "right": "ayni damda; davom etayotgan ish",
      "hint": "Odat belgisi Present Simple, ayni payt belgisi Present Continuous bilan keladi."
    },
    {
      "left": "on Mondays",
      "right": "dushanba kunlari; odat",
      "hint": "Odat belgisi Present Simple, ayni payt belgisi Present Continuous bilan keladi."
    },
    {
      "left": "right now",
      "right": "hozirning o‘zida; davom etayotgan ish",
      "hint": "Odat belgisi Present Simple, ayni payt belgisi Present Continuous bilan keladi."
    }
  ],
  "hint": "Odat belgisi Present Simple, ayni payt belgisi Present Continuous bilan keladi.",
  "success": "Vaqt belgilarini to‘g‘ri ajratdingiz."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
