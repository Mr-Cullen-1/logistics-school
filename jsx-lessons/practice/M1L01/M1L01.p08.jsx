import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = { type: "practice", lessonCode: "M1L01", seq: 8, mechanic: "SORT" };
const task = {
  id: "M1L01-p08", kind: "SORT", title: "Darakmi yoki savolmi?", instruction: "8 ta gapni ikki guruhga ajrating. Tinish belgisi va so'z tartibini kuzating.",
  questionText: "Gaplarni Darak va Savol guruhlariga ajrating.",
  groups: [
    { label: "Darak", items: ["The broker has the paperwork.", "We need a pickup time.", "The driver is at gate three.", "Our dispatcher calls the shipper."] },
    { label: "Savol", items: ["Who has the paperwork?", "Do we need a pickup time?", "Is the driver at gate three?", "When does the dispatcher call?"] },
  ], hint: "Savol ko'pincha Wh-so'z yoki do/is bilan boshlanadi va ? bilan tugaydi.", success: "8 ta gap to'g'ri ajratildi: darak ega bilan, savol esa savol so'zi yoki yordamchi fe'l bilan boshlanadi.",
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
