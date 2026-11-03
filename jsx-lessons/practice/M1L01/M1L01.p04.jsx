import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = { type: "practice", lessonCode: "M1L01", seq: 4, mechanic: "GAP" };
const task = {
  id: "M1L01-p04", kind: "GAP", title: "Fe'lni tanlang", instruction: "Bitta haydovchi haqida gap ketmoqda. Mos shaklni tanlang.",
  questionText: "The driver ___ the load at the dock.",
  options: [
    { label: "picks" },
    { label: "pick", feedback: "Ega birlikda: he/she/it bilan hozirgi oddiy zamonda fe'l oxirini tekshiring." },
    { label: "picking", feedback: "-ing shakli yakka o'zi kesim bo'la olmaydi. Yordamchi fe'l bor-yo'qligini tekshiring." },
  ], answer: 0,
  hint: "The driver — bitta odam. Present Simple qoidasi esingizdami?", success: "To'g'ri: the driver picks. Birlikdagi ega bilan fe'lga -s qo'shiladi.",
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
