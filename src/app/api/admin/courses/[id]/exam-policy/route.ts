import { NextRequest } from "next/server";
import { z } from "zod";
import { examRequest, examParams, readExamJson } from "@/lib/exams/http";
import { setExamPolicy } from "@/lib/exams/admin";

export async function PATCH(request:NextRequest,context:{params:Promise<{id:string}>}) {
 return examRequest(request,"super_admin",async (user)=>{const {id}=await examParams(context);const b=z.object({policy:z.enum(["enabled","paused"])}).strict().parse(await readExamJson(request));return setExamPolicy(id,b.policy,user.id);});
}
