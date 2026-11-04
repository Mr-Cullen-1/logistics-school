import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L02","seq":10,"mechanic":"SCENE"};
const task = {
  "id": "M1L02-p10",
  "kind": "SCENE",
  "title": "Brokerga holatni ayting",
  "instruction": "Uch qadamli suhbatda to'g'ri javoblarni tanlang.",
  "questionText": "Odatiy ish va hozirgi ishni farqlang.",
  "steps": [
    {
      "prompt": "Broker: Do you usually load here?",
      "options": [
        {
          "label": "Yes, we load here every Tuesday."
        },
        {
          "label": "Yes, we are load here every Tuesday."
        },
        {
          "label": "Yes, we loading here every Tuesday."
        }
      ],
      "answer": 0
    },
    {
      "prompt": "Broker: What is the driver doing now?",
      "options": [
        {
          "label": "He is waiting at the scale."
        },
        {
          "label": "He waits at the scale now."
        },
        {
          "label": "He wait at the scale now."
        }
      ],
      "answer": 0
    },
    {
      "prompt": "Broker: Is the dock open at the moment?",
      "options": [
        {
          "label": "No, it is closing for maintenance now."
        },
        {
          "label": "No, it closes for maintenance now."
        },
        {
          "label": "No, it close for maintenance now."
        }
      ],
      "answer": 0
    }
  ],
  "hint": "Odat uchun Present Simple, hozir uchun am/is/are + -ing.",
  "success": "Brokerga ish tartibi va hozirgi vaziyatni tushuntirdingiz."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
