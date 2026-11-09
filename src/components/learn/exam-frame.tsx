"use client";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { lessonFrameDocument } from "@/lib/lessons/frame";
import type { ExamAnswer, PublicExam } from "@/lib/exams/types";

export function ExamFrame({exam,answers,lang,onChange,onSubmit,onError}:{exam:PublicExam;answers:ExamAnswer[];lang:"uz"|"ru"|"en";onChange:(a:ExamAnswer[])=>void;onSubmit:(a:ExamAnswer[])=>void;onError:(error:string)=>void}) {
  const frame=useRef<HTMLIFrameElement>(null),nonce=useRef("");
  const callbacks=useRef({onChange,onSubmit,onError});
  useEffect(()=>{callbacks.current={onChange,onSubmit,onError};},[onChange,onSubmit,onError]);
  const origin=useSyncExternalStore(()=>()=>{},()=>window.location.origin,()=>"");
  useEffect(()=>{
    let mounted=false;
    const timer=setTimeout(()=>{if(!mounted)callbacks.current.onError("Imtihon 15 soniyada ochilmadi. Sahifani qayta yuklang.");},15000);
    function receive(event:MessageEvent){
      if(event.source!==frame.current?.contentWindow||event.data?.nonce!==nonce.current)return;
      if(event.data.type==="mounted"){mounted=true;clearTimeout(timer);}
      if(event.data.type==="error")callbacks.current.onError(String(event.data.payload));
      if(!["exam_answers","exam_submit"].includes(event.data.type))return;
      const a=event.data.payload;
      if(!Array.isArray(a)||a.length>100||a.some(v=>!v||typeof v.questionId!=="string"||typeof v.value!=="string"||v.value.length>2000))return;
      if(event.data.type==="exam_answers")callbacks.current.onChange(a);else callbacks.current.onSubmit(a);
    }
    window.addEventListener("message",receive);return()=>{clearTimeout(timer);window.removeEventListener("message",receive);};
  },[]);
  function initialize(){nonce.current ||= crypto.randomUUID();frame.current?.contentWindow?.postMessage({type:"init",nonce:nonce.current,kind:"exam",compiledJs:'module.exports.default = require("@coliseum/kit").ExamScreen;',props:{exam,savedAnswers:answers,lang}},"*");}
  return <iframe ref={frame} title="PK / IK" sandbox="allow-scripts" referrerPolicy="no-referrer" srcDoc={origin?lessonFrameDocument(origin):""} onLoad={initialize} style={{width:"100%",height:"calc(100dvh - 110px)",minHeight:500,border:0,borderRadius:14}}/>;
}
