import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L06","seq":10,"mechanic":"SCENE"};
const task = {
  "id": "M1L06-p10",
  "kind": "SCENE",
  "title": "Telefonda ma’lumot oling",
  "instruction": "Uch qadamli suhbatda to'g'ri javoblarni tanlang.",
  "questionText": "Uchta muloyim iltimos bering.",
  "steps": [
    {
      "prompt": "Broker: I have the rate. Qayta aytishni so‘rang.",
      "options": [
        {
          "label": "Could you repeat the rate, please?"
        },
        {
          "label": "Repeat the rate now!"
        },
        {
          "label": "You must repeat me."
        }
      ],
      "answer": 0
    },
    {
      "prompt": "Broker: It is $2,100. Manzilni harflab aytishni so‘rang.",
      "options": [
        {
          "label": "Could you spell the street name?"
        },
        {
          "label": "Spell street!"
        },
        {
          "label": "You can spelling the street?"
        }
      ],
      "answer": 0
    },
    {
      "prompt": "Broker: It is Cedar Road. Hujjatni yuborishni so‘rang.",
      "options": [
        {
          "label": "Would you send the BOL, please?"
        },
        {
          "label": "You must to send the BOL!"
        },
        {
          "label": "Send BOL now!"
        }
      ],
      "answer": 0
    }
  ],
  "hint": "Could you yoki Would you bilan iltimos qiling.",
  "success": "Kerakli ma’lumotni muloyim so‘rovlar bilan oldingiz."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
