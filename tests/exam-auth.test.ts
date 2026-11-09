import assert from "node:assert/strict";
import { test } from "node:test";
import { authorizeExamUser, readExamJson, answerInput } from "../src/lib/exams/http";

test("exam role boundaries: students cannot author/grant; admins cannot author; inactive and password-reset sessions rejected",()=>{
  const ready={isActive:true,mustChangePassword:false};
  authorizeExamUser({...ready,role:"student"},"student");
  authorizeExamUser({...ready,role:"admin"},"admin");
  authorizeExamUser({...ready,role:"super_admin"},"admin");
  authorizeExamUser({...ready,role:"super_admin"},"super_admin");
  assert.throws(()=>authorizeExamUser({...ready,role:"student"},"admin"));
  assert.throws(()=>authorizeExamUser({...ready,role:"student"},"super_admin"));
  assert.throws(()=>authorizeExamUser({...ready,role:"admin"},"super_admin"));
  assert.throws(()=>authorizeExamUser({...ready,role:"admin"},"student"));
  assert.throws(()=>authorizeExamUser({...ready,role:"student",isActive:false},"student"));
  assert.throws(()=>authorizeExamUser({...ready,role:"super_admin",mustChangePassword:true},"super_admin"));
  assert.throws(()=>authorizeExamUser(null,"student"));
});
test("exam JSON limits streamed bodies even without content-length",async()=>{
  assert.equal(answerInput.safeParse({revision:0,answers:[],scorePercent:100,passed:true}).success,false);
  await assert.rejects(readExamJson(new Request("http://localhost",{method:"POST",body:JSON.stringify({text:"x".repeat(100)})}),32));
  await assert.rejects(readExamJson(new Request("http://localhost",{method:"POST",body:"{"})));
});
