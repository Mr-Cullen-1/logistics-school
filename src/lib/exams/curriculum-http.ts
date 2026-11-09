import { NextResponse } from "next/server";
import { ExamError } from "./db";

export function curriculumRequest<Args extends unknown[]>(run:(...args:Args)=>Promise<NextResponse>) {
  return async(...args:Args)=>{try{return await run(...args);}catch(error){if(error instanceof ExamError)return NextResponse.json({error:error.message},{status:error.status});throw error;}};
}
