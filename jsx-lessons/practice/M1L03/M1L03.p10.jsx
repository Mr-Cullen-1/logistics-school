import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L03","seq":10,"mechanic":"SCENE"};
const task = {
  "id": "M1L03-p10",
  "kind": "SCENE",
  "title": "Kunlik hisobot",
  "instruction": "Uch qadamli suhbatda to'g'ri javoblarni tanlang.",
  "questionText": "Uchta voqeani Past Simple da ayting.",
  "steps": [
    {
      "prompt": "Dispatcher: When did you leave the terminal?",
      "options": [
        {
          "label": "I left at 6 AM."
        },
        {
          "label": "I leave at 6 AM yesterday."
        },
        {
          "label": "I did left at 6 AM."
        }
      ],
      "answer": 0
    },
    {
      "prompt": "Dispatcher: Did you pick up the load?",
      "options": [
        {
          "label": "Yes, I picked it up at eight."
        },
        {
          "label": "Yes, I pick it up at eight yesterday."
        },
        {
          "label": "Yes, I did picked it up."
        }
      ],
      "answer": 0
    },
    {
      "prompt": "Dispatcher: What happened after delivery?",
      "options": [
        {
          "label": "I sent the POD."
        },
        {
          "label": "I send the POD yesterday."
        },
        {
          "label": "I did sent the POD."
        }
      ],
      "answer": 0
    }
  ],
  "hint": "O‘tgan voqea uchun Past Simple; did dan keyin asosiy fe’l.",
  "success": "Uch voqeadan iborat hisobot tayyor."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
