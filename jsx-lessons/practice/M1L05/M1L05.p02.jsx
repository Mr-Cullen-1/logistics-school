import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L05","seq":2,"mechanic":"MATCH"};
const task = {
  "id": "M1L05-p02",
  "kind": "MATCH",
  "title": "Kelajak shakllari",
  "instruction": "Har bir atamani mos ta'rif bilan juftlang.",
  "questionText": "Atamalarni ta'riflari bilan moslang.",
  "pairs": [
    {
      "left": "Hozirgi va’da",
      "right": "will: suhbat paytida berilgan va’da",
      "hint": "Va’da, avvalgi reja va kelishilgan uchrashuvni farqlang."
    },
    {
      "left": "Oldindan tuzilgan reja",
      "right": "going to: avvaldan rejalangan ish",
      "hint": "Va’da, avvalgi reja va kelishilgan uchrashuvni farqlang."
    },
    {
      "left": "Kelishilgan uchrashuv",
      "right": "Present Continuous: kelishilgan appointment",
      "hint": "Va’da, avvalgi reja va kelishilgan uchrashuvni farqlang."
    },
    {
      "left": "Bir zumdagi qaror",
      "right": "will: shu lahzada qilingan qaror",
      "hint": "Va’da, avvalgi reja va kelishilgan uchrashuvni farqlang."
    },
    {
      "left": "Rejalangan yo‘nalish",
      "right": "going to: oldindan tanlangan yo‘nalish",
      "hint": "Va’da, avvalgi reja va kelishilgan uchrashuvni farqlang."
    },
    {
      "left": "Tasdiqlangan appointment",
      "right": "Present Continuous: tasdiqlangan kelajak uchrashuvi",
      "hint": "Va’da, avvalgi reja va kelishilgan uchrashuvni farqlang."
    }
  ],
  "hint": "Va’da, avvalgi reja va kelishilgan uchrashuvni farqlang.",
  "success": "Kelajak shakllari vaziyatlarga moslandi."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
