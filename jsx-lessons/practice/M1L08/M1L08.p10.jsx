import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L08","seq":10,"mechanic":"SCENE"};
const task = {
  "id": "M1L08-p10",
  "kind": "SCENE",
  "title": "Yukni tasvirlang",
  "instruction": "Uch qadamli suhbatda to'g'ri javoblarni tanlang.",
  "questionText": "Kim, nima va qayerga ekanini ayting.",
  "steps": [
    {
      "prompt": "Broker: Who gives you the load?",
      "options": [
        {
          "label": "The shipper gives it to our carrier."
        },
        {
          "label": "The receiver gives it to the POD."
        },
        {
          "label": "The rate gives us the load."
        }
      ],
      "answer": 0
    },
    {
      "prompt": "Broker: What equipment do you need for chilled food?",
      "options": [
        {
          "label": "We need a reefer."
        },
        {
          "label": "We need an invoice."
        },
        {
          "label": "We need a lumper."
        }
      ],
      "answer": 0
    },
    {
      "prompt": "Broker: Where does the freight go?",
      "options": [
        {
          "label": "It goes to the receiver at the warehouse."
        },
        {
          "label": "It goes to the RC at the rate."
        },
        {
          "label": "It goes to the detention."
        }
      ],
      "answer": 0
    }
  ],
  "hint": "People, equipment va place atamalarini o‘z o‘rnida ishlating.",
  "success": "Yukning ishtirokchilari, uskunasi va manzili to‘g‘ri tasvirlandi."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
