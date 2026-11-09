import { NextRequest } from "next/server";
import { z } from "zod";
import { examRequest, examParams, readExamJson } from "@/lib/exams/http";
import { reviewExam } from "@/lib/exams/admin";

export async function POST(request:NextRequest,context:{params:Promise<{id:string;versionId:string}>}) {
 return examRequest(request,"super_admin",async (user)=>{const {id,versionId}=await examParams(context);const b=z.object({sha256:z.string().length(64),reviewed:z.literal(true)}).strict().parse(await readExamJson(request));return reviewExam(id,versionId,b.sha256,user.id);});
}
