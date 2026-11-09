import { and, eq } from "drizzle-orm";
import { NextRequest } from "next/server";
import { getDatabase } from "@/db";
import { examVersions } from "@/db/schema";
import { examRequest, examParams } from "@/lib/exams/http";
import { ExamError } from "@/lib/exams/db";
import { toPublicExam } from "@/lib/exams/public";

export async function GET(request:NextRequest,context:{params:Promise<{id:string;versionId:string}>}) {
  return examRequest(request,"super_admin",async()=>{
    const {id,versionId}=await examParams(context);
    const [version]=await getDatabase().select().from(examVersions).where(and(eq(examVersions.id,versionId),eq(examVersions.examId,id)));
    if(!version)throw new ExamError(404,"Versiya topilmadi");
    return {definition:version.definition,exam:toPublicExam(version.definition),sha256:version.sha256};
  });
}
