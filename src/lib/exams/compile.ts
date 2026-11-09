import { createHash } from "node:crypto";
import { parse } from "@babel/parser";
import { examDefinitionSchema, validateExamDefinition } from "./definition";
import type { ExamDefinition } from "./types";
import { ExamError } from "./db";

const wrapper = `import React from "react";
import { ExamScreen } from "@coliseum/kit";
export default function Exam(props) { return <ExamScreen {...props} />; }`;

function syntax(value: unknown): unknown {
  if(Array.isArray(value))return value.map(syntax);
  if(value && typeof value === "object") return Object.fromEntries(Object.entries(value).filter(([key])=>!["start","end","loc","extra","leadingComments","trailingComments","innerComments","comments"].includes(key)).map(([key,v])=>[key,syntax(v)]));
  return value;
}
export function examJsxSource(definition:ExamDefinition) {
  return `export const examDefinition = ${JSON.stringify(definition,null,2)};\n\n${wrapper}\n`;
}
export function parseExamUpload(filename:string,source:string) {
  if(Buffer.byteLength(source,"utf8")>1_500_000)throw new ExamError(413,"JSX 1.5 MBdan oshmasin");
  const match=/^(M[1-4]\.pk|COURSE\.ik)\.jsx$/.exec(filename);
  if(!match)throw new ExamError(400,"M1.pk.jsx–M4.pk.jsx yoki COURSE.ik.jsx kerak");
  try {
    const ast=parse(source,{sourceType:"module",plugins:["jsx"]});
    const exports=ast.program.body.filter(n=>n.type==="ExportNamedDeclaration");
    if(exports.length!==1 || ast.program.directives.length)throw new Error("Bitta examDefinition eksporti kerak");
    const declaration=exports[0].declaration;
    if(declaration?.type!=="VariableDeclaration"||declaration.kind!=="const"||declaration.declarations.length!==1)throw new Error("Statik const kerak");
    const variable=declaration.declarations[0];
    if(variable.id.type!=="Identifier"||variable.id.name!=="examDefinition"||variable.init?.type!=="ObjectExpression")throw new Error("examDefinition JSON obyekt bo‘lsin");
    const rest=ast.program.body.filter(n=>n!==exports[0]);
    if(JSON.stringify(syntax(rest))!==JSON.stringify(syntax(parse(wrapper,{sourceType:"module",plugins:["jsx"]}).program.body)))throw new Error("Faqat standart ExamScreen JSX komponentiga ruxsat");
    const raw=JSON.parse(source.slice(variable.init.start!,variable.init.end!));
    const errors=validateExamDefinition(raw);
    if(errors.length)throw new Error(errors.slice(0,8).join("; "));
    const definition=examDefinitionSchema.parse(raw);
    if(filename!== (definition.kind==="pk"?`${definition.moduleCode}.pk.jsx`:"COURSE.ik.jsx"))throw new Error("Fayl nomi va tur/modul mos emas");
    return {definition,sha256:createHash("sha256").update(source).digest("hex"),sizeBytes:Buffer.byteLength(source,"utf8")};
  }catch(error){if(error instanceof ExamError)throw error;throw new ExamError(400,error instanceof Error?error.message:"JSX noto‘g‘ri");}
}
