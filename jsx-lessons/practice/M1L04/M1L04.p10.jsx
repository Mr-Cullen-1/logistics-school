import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L04","seq":10,"mechanic":"SCENE"};
const task = {
  "id": "M1L04-p10",
  "kind": "SCENE",
  "title": "Brokerga status",
  "instruction": "Uch qadamli suhbatda to'g'ri javoblarni tanlang.",
  "questionText": "Uchta holat savoliga javob bering.",
  "steps": [
    {
      "prompt": "Broker: Has the rate been confirmed?",
      "options": [
        {
          "label": "Yes, we have confirmed it."
        },
        {
          "label": "Yes, we confirmed it tomorrow."
        },
        {
          "label": "Yes, we have confirm it."
        }
      ],
      "answer": 0
    },
    {
      "prompt": "Broker: Has the driver arrived yet?",
      "options": [
        {
          "label": "No, he has not arrived yet."
        },
        {
          "label": "No, he have not arrived yet."
        },
        {
          "label": "No, he not arrived yet."
        }
      ],
      "answer": 0
    },
    {
      "prompt": "Broker: Have you sent the BOL?",
      "options": [
        {
          "label": "Yes, I have just sent it."
        },
        {
          "label": "Yes, I just send it."
        },
        {
          "label": "Yes, I has sent it."
        }
      ],
      "answer": 0
    }
  ],
  "hint": "Have/has + V3 bilan hozirgi holatni ayting.",
  "success": "Brokerga uchta status aniq yetkazildi."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
