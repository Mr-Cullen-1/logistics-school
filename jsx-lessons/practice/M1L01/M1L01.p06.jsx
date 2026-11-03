import React from "react";
import { PracticeTask } from "@coliseum/kit";

export const meta = { type: "practice", lessonCode: "M1L01", seq: 6, mechanic: "ORDER" };
const task = {
  id: "M1L01-p06", kind: "ORDER", title: "Wh-savol tuzing", instruction: "So'zlarni savol tartibida joylang.",
  questionText: "Pickup qayerda ekanini so'rang.",
  tokens: ["the", "Where", "pickup", "is", "?"],
  expected: ["Where", "is", "the", "pickup", "?"],
  hint: "Wh-so'zdan keyin is keladi, undan keyin so'ralayotgan narsa.", success: "Where is the pickup? Savolda is egadan oldin keldi.",
};
export default function Practice(props) { return <PracticeTask definition={task} {...props} />; }
