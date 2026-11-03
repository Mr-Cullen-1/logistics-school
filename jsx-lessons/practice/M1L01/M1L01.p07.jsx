import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = { type: "practice", lessonCode: "M1L01", seq: 7, mechanic: "FIX" };
const task = {
  id: "M1L01-p07", kind: "FIX", title: "Savolni tuzating", instruction: "Berilgan gapdagi so'z tartibini tekshiring.",
  questionText: "Where the delivery is? → qaysi tuzatish to'g'ri?",
  options: [
    { label: "Where is the delivery?" },
    { label: "Where the is delivery?", feedback: "Yordamchi fe'l joyini tekshiring: Wh-so'zdan keyin kelishi kerak." },
    { label: "Is where the delivery?", feedback: "Wh-so'z savolning boshida turadi. Fe'l uning ortidan keladi." },
  ], answer: 0,
  hint: "Savol tartibi: Where + is + the delivery?", success: "To'g'ri: Where is the delivery? Savolda is egadan oldin turadi.",
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
