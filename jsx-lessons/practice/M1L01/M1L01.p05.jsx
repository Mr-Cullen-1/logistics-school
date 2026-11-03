import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = { type: "practice", lessonCode: "M1L01", seq: 5, mechanic: "ORDER" };
const task = {
  id: "M1L01-p05", kind: "ORDER", title: "Darak gap tuzing", instruction: "So'zlarni bosing. Kim → nima qiladi → nimani tartibini saqlang.",
  questionText: "Haydovchiga kerakli manzil haqida darak gap tuzing.",
  tokens: ["needs", "The", "address", "driver", "the"],
  expected: ["The", "driver", "needs", "the", "address"],
  hint: "Avval ega: kim? Keyin fe'l: nima qiladi? Oxirida nimani?", success: "The driver needs the address. Ega, fe'l va to'ldiruvchi joyida.",
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
