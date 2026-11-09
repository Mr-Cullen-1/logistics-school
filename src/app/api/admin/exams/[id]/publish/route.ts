import { NextRequest } from "next/server";
import { z } from "zod";
import { examRequest, examParams, readExamJson } from "@/lib/exams/http";
import { publishExam } from "@/lib/exams/admin";

export async function POST(request:NextRequest,context:{params:Promise<{id:string}>}) {
 return examRequest(request,"super_admin",async (user)=>{const {id}=await examParams(context);const b=z.object({versionId:z.uuid()}).strict().parse(await readExamJson(request));return publishExam(id,b.versionId,user.id);});
}
