import { NextRequest } from "next/server";
import { z } from "zod";
import { examRequest, examParams, readExamJson } from "@/lib/exams/http";
import { grantIkRetry } from "@/lib/exams/attempts";

export async function POST(request:NextRequest,context:{params:Promise<{id:string;examId:string}>}) {
 return examRequest(request,"admin",async (user)=>{const {id,examId}=await examParams(context);const b=z.object({reason:z.string().min(3).max(1000),requestId:z.uuid()}).strict().parse(await readExamJson(request));return grantIkRetry(user.id,id,examId,b.reason,b.requestId);});
}
