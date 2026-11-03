import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = { type: "practice", lessonCode: "M1L01", seq: 10, mechanic: "SCENE" };
const task = {
  id: "M1L01-p10", kind: "SCENE", title: "Broker bilan suhbat", instruction: "Uch qadamda kerakli load ma'lumotlarini oling. Har to'g'ri javob suhbatni davom ettiradi.",
  questionText: "Brokerdan weight, pickup va rate haqida so'rang.",
  steps: [
    { prompt: "Broker: I have a new load for your truck. Og'irlikni so'rang.", options: [
      { label: "What is the weight?" },
      { label: "Who is the weight?", feedback: "Og'irlik odam emas. Narsaning qiymatini so'raydigan Wh-so'zni tanlang." },
      { label: "Weight is what?", feedback: "Savolda Wh-so'z oldinda, is undan keyin kelishi kerak." },
    ], answer: 0 },
    { prompt: "Broker: It is 28,000 pounds. Pickup joyini so'rang.", options: [
      { label: "Where is the pickup?" },
      { label: "Where the pickup is?", feedback: "Wh-savolda is egadan oldin keladi." },
      { label: "When is the pickup?", feedback: "When vaqtni so'raydi. Bu yerda joy kerak." },
    ], answer: 0 },
    { prompt: "Broker: Pickup is at 417 Harbor Road. Narxni so'rang.", options: [
      { label: "How much is the rate?" },
      { label: "How much the rate is?", feedback: "Wh-so'zdan keyin is, keyin the rate keladi." },
      { label: "Who is the rate?", feedback: "Rate narxni bildiradi. Odamni so'raydigan so'z mos emas." },
    ], answer: 0 },
  ], hint: "Wh-so'z + is + so'ralayotgan narsa tartibini saqlang.", success: "Suhbat yakunlandi: weight, pickup manzili va rate haqida to'g'ri savol berdingiz.",
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
