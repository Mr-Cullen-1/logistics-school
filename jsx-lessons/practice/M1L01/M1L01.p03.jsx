import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = { type: "practice", lessonCode: "M1L01", seq: 3, mechanic: "READ-MC" };
const task = {
  id: "M1L01-p03", kind: "READ-MC", title: "Dispatcher nimani so'radi?", instruction: "Qisqa xabarni o'qing va savol mavzusini tanlang.",
  questionText: "Dispatcher qaysi ma'lumotni so'rayapti?",
  passage: "Dispatcher: How heavy is the shipment?\nDriver: It is 24,500 pounds.",
  options: [
    { label: "Address", feedback: "Manzil uchun where yoki address ishlatilardi. Savol o'lchov haqida." },
    { label: "Time", feedback: "Vaqt uchun when yoki what time ishlatilardi. Birlikka e'tibor bering." },
    { label: "Weight" },
  ], answer: 2,
  hint: "Pounds qaysi kattalik birligi ekanini o'ylang.", success: "To'g'ri: how heavy va pounds yuk og'irligini bildiradi.",
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
