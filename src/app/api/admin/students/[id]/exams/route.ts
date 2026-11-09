import { NextRequest } from "next/server";
import { examRequest, examParams } from "@/lib/exams/http";
import { adminStudentExams } from "@/lib/exams/queries";

export async function GET(request:NextRequest,context:{params:Promise<{id:string}>}) {
 return examRequest(request,"admin",async ()=>{const {id}=await examParams(context);return adminStudentExams(id);});
}
