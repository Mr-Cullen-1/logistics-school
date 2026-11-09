import { NextRequest } from "next/server";
import { examRequest, examParams } from "@/lib/exams/http";
import { getAttemptView } from "@/lib/exams/attempts";

export async function GET(request:NextRequest,context:{params:Promise<{id:string}>}) {
 return examRequest(request,"student",async (user)=>{const {id}=await examParams(context);return getAttemptView(user.id,id);});
}
