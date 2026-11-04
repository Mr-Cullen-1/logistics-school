import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L05","seq":10,"mechanic":"SCENE"};
const task = {
  "id": "M1L05-p10",
  "kind": "SCENE",
  "title": "Pickupni qayta rejalang",
  "instruction": "Uch qadamli suhbatda to'g'ri javoblarni tanlang.",
  "questionText": "So‘rang, kelishing va tasdiqlang.",
  "steps": [
    {
      "prompt": "Broker: The 6 AM window is full. Boshqa vaqtni so‘rang.",
      "options": [
        {
          "label": "Could we move pickup to 8 AM?"
        },
        {
          "label": "We moving pickup 8 AM?"
        },
        {
          "label": "Will we to move pickup?"
        }
      ],
      "answer": 0
    },
    {
      "prompt": "Broker: 8 AM is available. Javob bering.",
      "options": [
        {
          "label": "Great, we are picking up at 8 AM."
        },
        {
          "label": "Great, we picking up at 8 AM."
        },
        {
          "label": "Great, we will to picking up."
        }
      ],
      "answer": 0
    },
    {
      "prompt": "Broker: Please confirm with the driver. Va’da bering.",
      "options": [
        {
          "label": "I will confirm it now."
        },
        {
          "label": "I will to confirm it now."
        },
        {
          "label": "I am confirm it now."
        }
      ],
      "answer": 0
    }
  ],
  "hint": "So‘rov, kelishilgan reja va va’dani farqlang.",
  "success": "Yangi pickup vaqti kelishildi va tasdiqlandi."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
