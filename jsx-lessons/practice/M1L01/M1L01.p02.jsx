import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = { type: "practice", lessonCode: "M1L01", seq: 2, mechanic: "MATCH" };
const task = {
  id: "M1L01-p02", kind: "MATCH", title: "6 ta asosiy so'z", instruction: "Har bir so'zni inglizcha ta'rifi bilan juftlang.",
  questionText: "Logistika so'zlarini ta'riflari bilan moslang.",
  pairs: [
    { left: "load", right: "goods carried by a truck", hint: "Load yukning o'zini anglatadi; jarayon yoki odam ta'rifini tanlamang." },
    { left: "pickup", right: "the place or time goods are collected", hint: "Pickup yukni olish bosqichi bilan bog'liq. Yetkazib berish bosqichidan farqlang." },
    { left: "delivery", right: "bringing goods to their destination", hint: "Delivery yuk oxirgi joyiga yetadigan bosqichni bildiradi." },
    { left: "driver", right: "a person who operates a truck", hint: "Driver odam. Ta'rif odamni anglatishini tekshiring." },
    { left: "address", right: "the location of a place", hint: "Address joylashuvni bildiradi, og'irlikni emas." },
    { left: "weight", right: "how heavy something is", hint: "Weight yukning qanchalik og'irligini bildiradi." },
  ], hint: "Odam, joy, jarayon va o'lchovni alohida ajratib ko'ring.", success: "Barcha 6 juftlik to'g'ri. Endi bu so'zlarni gaplarda ishlata olasiz.",
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
