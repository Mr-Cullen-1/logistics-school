import { NextRequest } from "next/server";
import { z } from "zod";
import { examRequest, examParams, readExamJson } from "@/lib/exams/http";
import { uploadExam } from "@/lib/exams/admin";

export async function POST(request:NextRequest,context:{params:Promise<{id:string}>}) {
 return examRequest(request,"super_admin",async (user)=>{const {id}=await examParams(context);const b=z.object({filename:z.string(),source:z.string(),passPercent:z.number().int().min(1).max(100)}).strict().parse(await readExamJson(request,2_000_000));return uploadExam(id,b.filename,b.source,b.passPercent,user.id);});
}
