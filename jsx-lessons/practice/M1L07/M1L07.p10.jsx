import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L07","seq":10,"mechanic":"SCENE"};
const task = {
  "id": "M1L07-p10",
  "kind": "SCENE",
  "title": "Uch raundli muzokara",
  "instruction": "Uch qadamli suhbatda to'g'ri javoblarni tanlang.",
  "questionText": "Taklif, shart va kelishuvni bildiring.",
  "steps": [
    {
      "prompt": "Broker: The rate is $1,900. Qarshi taklif bering.",
      "options": [
        {
          "label": "If you can offer $2,200, I can take it."
        },
        {
          "label": "If you will offer $2,200, I take it."
        },
        {
          "label": "Offer me more!"
        }
      ],
      "answer": 0
    },
    {
      "prompt": "Broker: I can do $2,100. Deadheadni shart qiling.",
      "options": [
        {
          "label": "If you cover the deadhead, we can accept $2,100."
        },
        {
          "label": "If you will cover deadhead, we accept."
        },
        {
          "label": "You must cover deadhead!"
        }
      ],
      "answer": 0
    },
    {
      "prompt": "Broker: I will cover it. Kelishuvni tasdiqlang.",
      "options": [
        {
          "label": "Great. If you send the RC, I will confirm the truck."
        },
        {
          "label": "Great. If you will send the RC, I confirm."
        },
        {
          "label": "Great. You sending RC."
        }
      ],
      "answer": 0
    }
  ],
  "hint": "If qismida Present Simple, natijada can yoki will.",
  "success": "Narx va deadhead bo‘yicha kelishuvga erishdingiz."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
