import { NextRequest } from "next/server";
import { z } from "zod";
import { examRequest, examParams, readExamJson } from "@/lib/exams/http";
import { createExam } from "@/lib/exams/admin";

export async function POST(request:NextRequest,context:{params:Promise<{id:string}>}) {
 return examRequest(request,"super_admin",async (user)=>{const {id}=await examParams(context);const input=z.object({kind:z.enum(["pk","ik"]),moduleId:z.uuid().optional(),title:z.string().min(1).max(200),passPercent:z.number().int().min(1).max(100).default(80)}).strict().refine(v=>v.kind!=="pk"||!!v.moduleId).parse(await readExamJson(request));return createExam(id,input,user.id);});
}
