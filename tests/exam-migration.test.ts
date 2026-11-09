import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { PGlite } from "@electric-sql/pglite";

test("exam migration backfills actual pre-migration data and deletion cascades preserve unrelated users",async()=>{
  const client=new PGlite();
  try{
    const journal=JSON.parse(readFileSync("drizzle/meta/_journal.json","utf8")) as {entries:{tag:string}[]};
    for(const entry of journal.entries.slice(0,3))await client.exec(readFileSync(`drizzle/${entry.tag}.sql`,"utf8"));
    const student="00000000-0000-4000-8000-000000000001",other="00000000-0000-4000-8000-000000000002",course="00000000-0000-4000-8000-000000000003",sectionId="00000000-0000-4000-8000-000000000004",lesson="00000000-0000-4000-8000-000000000005";
    await client.query("insert into users(id,phone,full_name,password_hash) values ($1,'+998900000011','Student','fixture'),($2,'+998900000012','Other','fixture')",[student,other]);
    await client.query("insert into courses(id,title) values ($1,'Legacy course')",[course]);
    await client.query("insert into modules(id,course_id,title) values ($1,$2,'Module')",[sectionId,course]);
    await client.query("insert into lessons(id,module_id,code,title,jsx_source,compiled_js) values ($1,$2,'M1L01','Lesson','','')",[lesson,sectionId]);
    await client.query("insert into progress(student_id,lesson_id,completed_at) values ($1,$3,now()),($2,$3,now())",[student,other,lesson]);
    await client.exec("create role anon; create role authenticated; create role service_role; alter default privileges in schema public grant all on tables to anon, authenticated, service_role;");
    for (const entry of journal.entries.slice(3)) await client.exec(readFileSync(`drizzle/${entry.tag}.sql`,"utf8"));
    const protectedTables = ['exams','exam_versions','exam_attempts','exam_retry_grants','course_learning_state','student_achievements'];
    const protectedRows = await client.query<{relname:string;relrowsecurity:boolean}>("select relname,relrowsecurity from pg_class where relnamespace='public'::regnamespace and relname = any($1)",[protectedTables]);
    assert.equal(protectedRows.rows.length,6);
    assert(protectedRows.rows.every(row=>row.relrowsecurity), "Every exam table must enable RLS");
    for (const role of ['anon','authenticated','service_role']) for (const table of protectedTables) {
      const privileges=await client.query<{allowed:boolean}>("select has_table_privilege($1,$2,'SELECT,INSERT,UPDATE,DELETE,TRUNCATE,REFERENCES,TRIGGER') as allowed",[role,table]);
      assert.equal(privileges.rows[0].allowed,false,`${role} must not bypass the application via ${table}`);
    }
    assert.equal((await client.query<{exam_policy:string}>("select exam_policy from courses")).rows[0].exam_policy,"disabled");
    assert.equal((await client.query("select * from student_achievements where student_id=$1",[student])).rows.length,2);
    await client.query("delete from users where id=$1",[student]);
    assert.equal((await client.query("select * from student_achievements where student_id=$1",[student])).rows.length,0);
    assert.equal((await client.query("select * from student_achievements where student_id=$1",[other])).rows.length,2);
  }finally{await client.close();}
});
