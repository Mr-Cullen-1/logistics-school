import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = { type: "practice", lessonCode: "M1L01", seq: 9, mechanic: "READ-TYPE" };
const task = {
  id: "M1L01-p09", kind: "READ-TYPE", title: "Xabardan topib yozing", instruction: "Xabarni o'qing. Faqat raqamlarni yozing.",
  questionText: "Yuk og'irligi va manzil raqami nechchi?",
  passage: "Broker: The shipment weighs 28,000 pounds. Please send the truck to 417 Harbor Road before 9 AM.",
  fields: [
    { label: "Weight (pounds)", answers: ["28000", "28,000", "28 000"], hint: "Og'irlik weighs so'zidan keyin, pounds oldida turibdi." },
    { label: "Address number", answers: ["417"], hint: "Manzil raqamini Harbor Road oldidan toping; vaqt raqamini kiritmang." },
  ], hint: "Raqamlarni vazifasiga qarab ajrating: og'irlik, manzil, vaqt.", success: "To'g'ri: 28,000 pounds va 417 Harbor Road.",
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
