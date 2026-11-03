import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = { type: "practice", lessonCode: "M1L01", seq: 1, mechanic: "MC" };
const task = {
  id: "M1L01-p01", kind: "MC", title: "Kim kim?", instruction: "Logistika jamoasidagi vazifani aniqlang.",
  questionText: "Who arranges the truck for a load?",
  options: [
    { label: "Dispatcher" },
    { label: "Broker", feedback: "Broker yukni taklif qiladi. Haydovchini kim boshqarishini eslang." },
    { label: "Receiver", feedback: "Receiver yukni qabul qiladi. Mashinani kim tashkil etishini o'ylang." },
  ], answer: 0,
  hint: "Haydovchi bilan ishlaydigan jamoa a'zosini tanlang.", success: "To'g'ri: dispatcher haydovchi va mashinani yukga yo'naltiradi.",
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
