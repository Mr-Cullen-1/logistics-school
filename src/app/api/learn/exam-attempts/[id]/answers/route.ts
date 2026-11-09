import { NextRequest } from "next/server";
import { examRequest, examParams, readExamJson, answerInput } from "@/lib/exams/http";
import { saveExamAnswers } from "@/lib/exams/attempts";

export async function PUT(request:NextRequest,context:{params:Promise<{id:string}>}) {
 return examRequest(request,"student",async (user)=>{const {id}=await examParams(context);const b=answerInput.parse(await readExamJson(request));return saveExamAnswers(user.id,id,b.revision,b.answers);});
}
