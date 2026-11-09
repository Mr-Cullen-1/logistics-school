// Real Next production server, real login cookies, real PostgreSQL; no route mocks.
// Prerequisite: npm run build, plus the disposable TLS cluster used by check-exam-postgres.
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { spawn } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { setTimeout as delay } from "node:timers/promises";
import argon2 from "argon2";
import { and, eq } from "drizzle-orm";
import { chromium, type Page } from "playwright-core";
import * as s from "../src/db/schema";
import { nativeExamFixture } from "./exam-postgres-fixture";
import { backfillAchievements, lifetimeLessons } from "../src/lib/exams/achievements";
import type { ExamDefinition } from "../src/lib/exams/types";

async function main() {
  const executablePath = [process.env.CHROME_PATH, "C:/Program Files/Google/Chrome/Application/chrome.exe", "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"].find(p => p && existsSync(p));
  assert(executablePath); assert(existsSync(".next/BUILD_ID"), "Run npm run build first");
  const f = await nativeExamFixture();
  const password = `Local-QA-${randomUUID()}`;
  const origin = "http://localhost:3291";
  let server: ReturnType<typeof spawn> | undefined;
  let browser: Awaited<ReturnType<typeof chromium.launch>> | undefined;
  let serverLog = "";
  try {
    const passwordHash = await argon2.hash(password);
    await f.db.update(s.users).set({ passwordHash });
    const [admin, resetStudent] = await f.db.insert(s.users).values([
      { phone: "+998900000003", fullName: "QA regular admin", role: "admin", passwordHash, mustChangePassword: false },
      { phone: "+998900000004", fullName: "QA reset student", role: "student", passwordHash, mustChangePassword: false },
    ]).returning();
    await f.db.insert(s.studentProfiles).values([f.student, resetStudent].map(u => ({ studentId: u.id, locale: "en" })));
    await f.db.insert(s.enrollments).values({ studentId: resetStudent.id, courseId: f.course.id });
    await f.db.insert(s.lessonProgress).values(f.lessons.map(l => ({ studentId: resetStudent.id, lessonId: l.id, learnDoneAt: new Date(), practiceDoneAt: new Date() })));
    await f.db.insert(s.practiceAttempts).values(f.lessons.flatMap(l => Array.from({ length: 10 }, (_, i) => ({ studentId: resetStudent.id, lessonId: l.id, seq: i + 1, correct: true }))));
    await f.db.insert(s.progress).values(f.lessons.map(l => ({ studentId: resetStudent.id, lessonId: l.id, completedAt: new Date() })));
    // The real lesson-access route also requires the global Intro prerequisite.
    const [intro] = await f.db.insert(s.lessons).values({ moduleId: f.sections[0].id, code: "INTRO", title: "Intro", jsxSource: "", compiledJs: "", status: "published" }).returning();
    await f.db.insert(s.lessonProgress).values([f.student, resetStudent].map(u => ({ studentId: u.id, lessonId: intro.id, learnDoneAt: new Date(), practiceDoneAt: new Date() })));
    await f.db.insert(s.progress).values([f.student, resetStudent].map(u => ({ studentId: u.id, lessonId: intro.id, completedAt: new Date() })));
    await f.db.transaction(backfillAchievements);
    await f.db.delete(s.examVersions); await f.db.delete(s.exams);
    await f.db.update(s.courses).set({ examPolicy: "disabled" });
    const corpus = JSON.parse(readFileSync("jsx-lessons/exams/source-corpus.json", "utf8")) as { files: { path: string; lessonCode: string; slot: string; sha256: string }[] };
    // Published source slots establish readiness. Lesson rendering is covered separately.
    for (const file of corpus.files.filter(file => file.lessonCode !== "INTRO")) {
      const source = readFileSync(file.path, "utf8");
      await f.db.insert(s.lessonFiles).values({ lessonId: f.lessons.find(l => l.code === file.lessonCode)!.id, kind: file.slot === "learn" ? "learn" : "practice", seq: file.slot === "learn" ? 0 : Number(file.slot.slice(1)), source, compiledJs: "", sizeBytes: Buffer.byteLength(source), sha256: file.sha256, version: 1, status: "published", isCurrent: true });
    }
    server = spawn(process.execPath, ["node_modules/next/dist/bin/next", "start", "--port", "3291", "--hostname", "127.0.0.1"], {
      windowsHide: true, stdio: ["ignore", "pipe", "pipe"],
      env: { ...process.env, DATABASE_URL: f.url, SESSION_SECRET: randomUUID() + randomUUID(), NODE_ENV: "production" },
    });
    server.stdout!.on("data", chunk => { serverLog = (serverLog + chunk).slice(-12000); });
    server.stderr!.on("data", chunk => { serverLog = (serverLog + chunk).slice(-12000); });
    for (let i = 0; ; i++) {
      assert(server.exitCode === null, serverLog);
      if (serverLog.includes("Ready in")) break;
      assert(i < 150, "Next startup timeout"); await delay(200);
    }
    browser = await chromium.launch({ executablePath, headless: true });
    const errors: string[] = [];
    async function login(phone: string) {
      const page = await browser!.newPage({ viewport: { width: 1280, height: 900 } });
      page.on("pageerror", error => errors.push(error.message));
      await page.goto(`${origin}/login`);
      await page.getByLabel("Telefon raqami").fill(phone);
      await page.getByLabel("PIN yoki parol").fill(password);
      await page.getByRole("button", { name: "Kirish", exact: true }).click();
      await page.waitForURL(url => url.pathname === "/admin" || url.pathname === "/learn");
      assert((await page.context().cookies()).some(c => c.name === "coliseum_session" && c.httpOnly));
      return page;
    }
    async function request(page: Page, path: string, method = "GET", data?: unknown, expected = 200) {
      const response = await page.request.fetch(origin + path, { method, headers: { Origin: origin }, ...(data === undefined ? {} : { data }) });
      const body = await response.json();
      assert.equal(response.status(), expected, `${method} ${path}: ${JSON.stringify(body)}`);
      return body;
    }
    const superPage = await login(f.admin.phone);
    await superPage.goto(`${origin}/admin/courses/${f.course.id}`);
    const manager = superPage.getByRole("region", { name: "PK va IK boshqaruvi" });
    for (let i = 0; i < 5; i++) {
      await manager.locator("form").first().locator("select").selectOption(i === 4 ? "ik" : f.sections[i].id);
      await manager.getByRole("button", { name: "Imtihon yaratish", exact: true }).click();
      const title = i === 4 ? "IK — Final exam" : `PK — Module ${i + 1}`;
      const card = manager.locator("article").filter({ has: superPage.getByRole("heading", { name: title, exact: true }) });
      await card.locator('input[type="file"]').setInputFiles(`jsx-lessons/exams/${i === 4 ? "COURSE.ik.jsx" : `M${i + 1}.pk.jsx`}`);
      await card.locator('input[type="number"]').fill(i === 0 ? "85" : "80");
      await card.getByRole("button", { name: "Draft yuklash", exact: true }).click();
      await card.getByRole("button", { name: "Ko‘rib chiqish", exact: true }).click();
      const frame = card.frameLocator("iframe"); await frame.locator("h1").waitFor();
      await frame.getByRole("button", { name: "Yakunlash", exact: true }).click();
      await frame.getByRole("button", { name: "Natijani yuborish", exact: true }).click();
      await card.getByRole("checkbox").check();
      await card.getByRole("button", { name: "Preview OK", exact: true }).click();
      await card.getByRole("button", { name: "Nashr qilish", exact: true }).click();
      await card.getByText(`Joriy versiya: 1 · O‘tish: ${i === 0 ? 85 : 80}%`, { exact: true }).waitFor();
      await card.getByRole("button", { name: "Yopish", exact: true }).click();
      console.log(`PASS: Next super-admin JSX upload/preview/review/publish ${title}`);
    }
    await manager.getByRole("button", { name: "Imtihonlarni faollashtirish", exact: true }).click();
    await manager.getByRole("button", { name: "Yangi urinishlarni to‘xtatish", exact: true }).waitFor();
    const examRows = await f.db.select().from(s.exams);
    const pks = f.sections.map(m => examRows.find(e => e.moduleId === m.id)!);
    const ik = examRows.find(e => e.kind === "ik")!;
    const student = await login(f.student.phone), regularAdmin = await login(admin.phone), resetPage = await login(resetStudent.phone);
    await request(student, `/api/admin/courses/${f.course.id}/exams`, "POST", {}, 403);
    await request(regularAdmin, `/api/admin/courses/${f.course.id}/exams`, "POST", {}, 403);
    await request(superPage, "/api/learn/exams", "GET", undefined, 403);
    await request(student, `/api/learn/exams/${ik.id}/attempts`, "POST", undefined, 409);
    await request(student, `/api/learn/exams/${pks[1].id}/attempts`, "POST", undefined, 409);
    await request(student, `/api/learn/lessons/${f.lessons[8].id}/progress`, "POST", { type: "learn", cycle: 1, payload: { scorePercent: 100 } }, 403);
    console.log("PASS: real login cookies for three roles; super-admin boundary and PK/IK prerequisites.");

    for (const exam of pks) {
      const view = await request(student, `/api/learn/exams/${exam.id}/attempts`, "POST");
      assert(!JSON.stringify(view).includes('"grading"'));
      assert(!JSON.stringify(view).includes('"sourceRefs"'));
      const [stored] = await f.db.select().from(s.examAttempts).where(eq(s.examAttempts.id, view.id));
      const [version] = await f.db.select().from(s.examVersions).where(eq(s.examVersions.id, stored.versionId));
      const definition: ExamDefinition = version.definition;
      const answers = definition.questions.map(q => ({ questionId: q.id, value: q.type === "typed" ? q.grading.acceptedAnswers[0] : `choice-${stored.optionOrder[q.id].indexOf(q.grading.acceptedAnswers[0]) + 1}` }));
      await request(resetPage, `/api/learn/exam-attempts/${view.id}`, "GET", undefined, 404);
      await request(student, `/api/learn/exam-attempts/${view.id}/submit`, "POST", { revision: 0, answers, score: 100 }, 400);
      const result = await request(student, `/api/learn/exam-attempts/${view.id}/submit`, "POST", { revision: 0, answers });
      assert.equal(result.percent, 100); assert.equal(result.passed, true);
    }
    await student.goto(`${origin}/learn/exams/${ik.id}`);
    await student.getByRole("button", { name: "Start", exact: true }).click();
    await student.frameLocator("iframe").locator("h1").waitFor();
    let attemptId = new URL(student.url()).searchParams.get("attempt")!;
    const view = await request(student, `/api/learn/exam-attempts/${attemptId}`);
    const typed = view.exam.questions.findIndex((q: { type: string }) => q.type === "typed");
    await student.frameLocator("iframe").getByRole("navigation").getByRole("button", { name: String(typed + 1), exact: true }).click();
    await student.frameLocator("iframe").getByLabel("Your answer").fill("local saved answer");
    await student.getByRole("status").filter({ hasText: "Answers saved" }).waitFor();
    await student.reload(); await student.frameLocator("iframe").locator("h1").waitFor();
    await student.frameLocator("iframe").getByRole("navigation").getByRole("button", { name: String(typed + 1), exact: true }).click();
    assert.equal(await student.frameLocator("iframe").getByLabel("Your answer").inputValue(), "local saved answer");
    async function finishFailure() {
      const frame = student.frameLocator("iframe");
      await frame.getByRole("button", { name: "Finish", exact: true }).click();
      await frame.getByRole("button", { name: "Submit exam", exact: true }).click();
      await student.getByRole("heading", { name: "Pass mark not reached", exact: true }).waitFor();
    }
    await finishFailure();
    await student.getByRole("button", { name: "Try again", exact: true }).click();
    await student.frameLocator("iframe").locator("h1").waitFor();
    attemptId = new URL(student.url()).searchParams.get("attempt")!;
    await finishFailure();
    await student.getByText("An administrator must allow another attempt. Your progress is preserved.", { exact: true }).waitFor();
    await request(student, `/api/learn/exams/${ik.id}/attempts`, "POST", undefined, 409);
    await regularAdmin.goto(`${origin}/admin/students/${f.student.id}`);
    await regularAdmin.getByLabel("Admin amali sababi").fill("Local authenticated regression verification");
    await regularAdmin.getByRole("button", { name: "+1 urinish berish", exact: true }).click();
    await regularAdmin.getByRole("button", { name: "+1 urinish berish", exact: true }).waitFor({ state: "detached" });
    await student.goto(`${origin}/learn/exams/${ik.id}?attempt=${attemptId}`);
    await student.getByRole("button", { name: "Try again", exact: true }).click();
    await student.frameLocator("iframe").locator("h1").waitFor();
    await finishFailure();
    await student.getByText("An administrator must allow another attempt. Your progress is preserved.", { exact: true }).waitFor();
    assert.equal((await f.db.select().from(s.lessonProgress).where(eq(s.lessonProgress.studentId, f.student.id))).length, 33);
    console.log("PASS: actual student iframe autosave/reload; IK fail twice; regular-admin UI +1; historical-result retry; third failure preserves progress.");

    for (let i = 0; i < 2; i++) {
      const a = await request(resetPage, `/api/learn/exams/${pks[0].id}/attempts`, "POST");
      const result = await request(resetPage, `/api/learn/exam-attempts/${a.id}/submit`, "POST", { revision: 0, answers: [] });
      assert.equal(result.nextAction, i === 0 ? "retry" : "restart_course");
    }
    const remainingProgress = await f.db.select().from(s.lessonProgress).where(eq(s.lessonProgress.studentId, resetStudent.id));
    assert.deepEqual(remainingProgress.map(row => row.lessonId), [intro.id]);
    assert.equal(await lifetimeLessons(resetStudent.id, f.db), 33);
    await request(resetPage, `/api/learn/exams/${pks[0].id}/attempts`, "POST", undefined, 409);
    await request(resetPage, `/api/learn/lessons/${f.lessons[8].id}`, "GET", undefined, 404);
    const first = await request(resetPage, `/api/learn/lessons/${f.lessons[0].id}`);
    assert.equal(first.cycle, 2);
    await request(resetPage, `/api/learn/lessons/${f.lessons[0].id}/progress`, "POST", { type: "learn", cycle: 1, payload: { scorePercent: 100 } }, 409);
    await request(resetPage, `/api/learn/lessons/${f.lessons[0].id}/progress`, "POST", { type: "learn", payload: { scorePercent: 100 } }, 409);
    await request(resetPage, `/api/learn/lessons/${f.lessons[0].id}/progress`, "POST", { type: "learn", cycle: 2, payload: { scorePercent: 100 } });
    await f.db.update(s.enrollments).set({ isActive: false }).where(and(eq(s.enrollments.studentId, f.student.id), eq(s.enrollments.courseId, f.course.id)));
    await request(student, `/api/learn/exam-attempts/${attemptId}`, "GET", undefined, 403);
    assert.deepEqual(errors, []);
    console.log("PASS: real HTTP PK reset, first lesson cycle=2, next module denied, lifetime awards retained, revoked access denied; no browser errors.");
  } catch (error) { console.error(serverLog); throw error; }
  finally {
    await browser?.close();
    if (server && server.exitCode === null) {
      const exited = new Promise<void>(resolve => server!.once("exit", () => resolve()));
      server.kill(); await exited;
    }
    await f.close();
  }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
