import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L08","seq":9,"mechanic":"READ-TYPE"};
const task = {
  "id": "M1L08-p09",
  "kind": "READ-TYPE",
  "title": "Load xabarini tahlil qiling",
  "instruction": "Xabarni o'qib, kerakli ma'lumotni yozing.",
  "questionText": "Xabardagi beshta atamani yozing.",
  "fields": [
    {
      "label": "Uskuna",
      "answers": [
        "dry van"
      ],
      "hint": "Har bir so‘zni xabardan aynan ko‘chirib yozing."
    },
    {
      "label": "Jo‘natuvchi",
      "answers": [
        "shipper"
      ],
      "hint": "Har bir so‘zni xabardan aynan ko‘chirib yozing."
    },
    {
      "label": "Qabul qiluvchi",
      "answers": [
        "receiver"
      ],
      "hint": "Har bir so‘zni xabardan aynan ko‘chirib yozing."
    },
    {
      "label": "Narx hujjati",
      "answers": [
        "RC"
      ],
      "hint": "Har bir so‘zni xabardan aynan ko‘chirib yozing."
    },
    {
      "label": "Yetkazish dalili",
      "answers": [
        "POD"
      ],
      "hint": "Har bir so‘zni xabardan aynan ko‘chirib yozing."
    }
  ],
  "hint": "Har bir so‘zni xabardan aynan ko‘chirib yozing.",
  "success": "Besh asosiy atama topildi.",
  "passage": "Broker: This load needs a dry van. The shipper is Northgate Foods and the receiver is Westport Market. I will send the RC now. Please return the signed POD after delivery."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
