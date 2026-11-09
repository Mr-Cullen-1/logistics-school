import { NextRequest } from "next/server";
import { examRequest, examParams } from "@/lib/exams/http";
import { startOrResumeExam } from "@/lib/exams/attempts";

export async function POST(request:NextRequest,context:{params:Promise<{id:string}>}) {
 return examRequest(request,"student",async (user)=>{const {id}=await examParams(context);return startOrResumeExam(user.id,id);});
}
