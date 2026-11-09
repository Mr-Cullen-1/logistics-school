import { NextRequest } from "next/server";
import { z } from "zod";
import { examRequest, examParams, readExamJson } from "@/lib/exams/http";
import { voidAttempt } from "@/lib/exams/admin";

export async function POST(request:NextRequest,context:{params:Promise<{id:string}>}) {
 return examRequest(request,"admin",async (user)=>{const {id}=await examParams(context);const b=z.object({reason:z.string().min(3).max(1000)}).strict().parse(await readExamJson(request));return voidAttempt(user.id,id,b.reason);});
}
