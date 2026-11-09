import { NextRequest } from "next/server";
import { examRequest } from "@/lib/exams/http";
import { studentExams } from "@/lib/exams/queries";
export async function GET(request:NextRequest){return examRequest(request,"student",async user=>studentExams(user.id));}
