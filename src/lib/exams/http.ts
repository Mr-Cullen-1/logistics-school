import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { currentUser } from "@/lib/auth/current-user";
import { sameOrigin } from "@/lib/auth/request";
import { SESSION_COOKIE } from "@/lib/auth/session";
import { ExamError } from "./db";

type User = NonNullable<Awaited<ReturnType<typeof currentUser>>>;
export function authorizeExamUser(user:Pick<User,"role"|"mustChangePassword"|"isActive">|null,role:"student"|"admin"|"super_admin") {
  if(!user||!user.isActive)throw new ExamError(401,"Kirish talab qilinadi");
  if(user.mustChangePassword||(role==="admin"?user.role==="student":user.role!==role))throw new ExamError(403,"Ruxsat yo‘q");
}
export async function examRequest(request:NextRequest,role:"student"|"admin"|"super_admin",run:(user:User)=>Promise<unknown>) {
  try {
    if(request.method!=="GET"&&!sameOrigin(request))throw new ExamError(403,"So‘rov rad etildi");
    const user=await currentUser(request.cookies.get(SESSION_COOKIE)?.value);
    authorizeExamUser(user,role);
    if(!user)throw new ExamError(401,"Kirish talab qilinadi");
    return NextResponse.json(await run(user),{headers:{"Cache-Control":"private, no-store"}});
  }catch(error){
    if(error instanceof ExamError)return NextResponse.json({error:error.message},{status:error.status});
    if(error instanceof z.ZodError)return NextResponse.json({error:"Ma’lumotlarni tekshiring",issues:error.issues.map(i=>i.path.join("."))},{status:400});
    console.error("Exam request failed",error instanceof Error?error.message:"unknown");
    return NextResponse.json({error:"Imtihonni saqlashda xatolik. Qayta urinib ko‘ring."},{status:500});
  }
}
export async function examParams<T extends Record<string,string>>(context:{params:Promise<T>}):Promise<T> {
  const params=await context.params;
  for(const value of Object.values(params))if(!z.uuid().safeParse(value).success)throw new ExamError(404,"Topilmadi");
  return params;
}
export async function readExamJson(request:Request,maxBytes=262144) {
  if(Number(request.headers.get("content-length"))>maxBytes)throw new ExamError(413,"Yuklama juda katta");
  const reader=request.body?.getReader();if(!reader)throw new ExamError(400,"Ma’lumot yo‘q");
  const chunks:Uint8Array[]=[];let size=0;
  for(;;){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>maxBytes){await reader.cancel();throw new ExamError(413,"Yuklama juda katta");}chunks.push(value);}
  try{return JSON.parse(Buffer.concat(chunks).toString("utf8"));}catch{throw new ExamError(400,"JSON noto‘g‘ri");}
}
export const answerInput=z.object({revision:z.number().int().nonnegative(),answers:z.array(z.object({questionId:z.string().min(1).max(80),value:z.string().max(2000)}).strict()).max(100)}).strict();
