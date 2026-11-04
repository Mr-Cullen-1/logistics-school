import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = {"type":"practice","lessonCode":"M1L07","seq":2,"mechanic":"MATCH"};
const task = {
  "id": "M1L07-p02",
  "kind": "MATCH",
  "title": "Narx atamalari",
  "instruction": "Har bir atamani mos ta'rif bilan juftlang.",
  "questionText": "Atamalarni ta'riflari bilan moslang.",
  "pairs": [
    {
      "left": "deadhead",
      "right": "yuksiz bosib o‘tilgan masofa",
      "hint": "Har bir atama narxning qaysi turini bildiradi?"
    },
    {
      "left": "flat rate",
      "right": "butun yo‘l uchun bitta narx",
      "hint": "Har bir atama narxning qaysi turini bildiradi?"
    },
    {
      "left": "lumper",
      "right": "yuk tushirish xizmati haqi",
      "hint": "Har bir atama narxning qaysi turini bildiradi?"
    },
    {
      "left": "accessorial",
      "right": "asosiy narxdan tashqari qo‘shimcha haq",
      "hint": "Har bir atama narxning qaysi turini bildiradi?"
    },
    {
      "left": "fuel surcharge",
      "right": "yoqilg‘i uchun qo‘shimcha haq",
      "hint": "Har bir atama narxning qaysi turini bildiradi?"
    },
    {
      "left": "per mile",
      "right": "har bir mil uchun narx",
      "hint": "Har bir atama narxning qaysi turini bildiradi?"
    }
  ],
  "hint": "Har bir atama narxning qaysi turini bildiradi?",
  "success": "Narx atamalari to‘g‘ri moslandi."
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
