import "dotenv/config";

import { randomInt } from "node:crypto";
import assert from "node:assert/strict";
import { eq } from "drizzle-orm";

import { getDatabase, getSqlClient } from "../src/db";
import { courses, enrollments, modules, users } from "../src/db/schema";
import { SESSION_COOKIE, signSession } from "../src/lib/auth/session";

const origin = "http://localhost:3000";
const mechanics = ["MC", "GAP", "ORDER", "MATCH", "FIX", "MC", "READ-MC", "READ-TYPE", "TYPE", "SCENE"];

async function main() {
  const db = getDatabase();
  let courseId: string | undefined;
  const userIds: string[] = [];
  try {
    const seed = String(randomInt(10_000_000, 99_999_999));
    const createdUsers = await db.insert(users).values([
      { role: "super_admin", phone: `+9989${seed}`, fullName: "Lesson Flow Admin", passwordHash: "test-only", mustChangePassword: false },
      { role: "student", phone: `+9988${seed}`, fullName: "Lesson Flow Student", passwordHash: "test-only", mustChangePassword: false },
      { role: "student", phone: `+9987${seed}`, fullName: "Lesson Demo Student", passwordHash: "test-only", mustChangePassword: false },
    ]).returning({ id: users.id, role: users.role });
    userIds.push(...createdUsers.map((user) => user.id));
    const admin = createdUsers.find((user) => user.role === "super_admin")!;
    const student = createdUsers[1];
    const demoStudent = createdUsers[2];
    const [course] = await db.insert(courses).values({ title: "Lesson Flow Test", isPublished: true }).returning({ id: courses.id });
    courseId = course.id;
    const [section] = await db.insert(modules).values({ courseId, title: "Test modul" }).returning({ id: modules.id });
    await db.insert(enrollments).values({ courseId, studentId: student.id, grantedBy: admin.id });
    const adminCookie = `${SESSION_COOKIE}=${await signSession(admin.id, 1)}`;
    const studentCookie = `${SESSION_COOKIE}=${await signSession(student.id, 1)}`;
    const demoCookie = `${SESSION_COOKIE}=${await signSession(demoStudent.id, 1)}`;
    async function api(path: string, cookie: string, options: RequestInit = {}) {
      return fetch(`${origin}${path}`, { ...options, headers: { origin, cookie, ...options.headers }, cache: "no-store" });
    }
    const create = await api("/api/admin/lessons", adminCookie, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ moduleId: section.id, code: "M1L01", title: "Synthetic lesson" }) });
    assert.equal(create.status, 201, await create.clone().text());
    const { lesson } = await create.json() as { lesson: { id: string } };
    const before = await api(`/api/learn/lessons/${lesson.id}`, studentCookie);
    assert.equal(before.status, 404);
    const forbidden = await api(`/api/admin/lessons/${lesson.id}/publish`, studentCookie, { method: "POST" });
    assert.equal(forbidden.status, 403);

    const form = new FormData();
    const metadata: Record<string, string> = {};
    form.append("files", new File(['import React from "react"; export default function Lesson(){return <p>Learn</p>}'], "M1L01.learn.jsx", { type: "text/plain" }));
    for (let seq = 1; seq <= 10; seq++) {
      const name = `M1L01.p${String(seq).padStart(2, "0")}.jsx`;
      form.append("files", new File(['import React from "react"; export default function Practice(){return <p>Practice</p>}'], name, { type: "text/plain" }));
      metadata[name] = mechanics[seq - 1];
    }
    form.set("mechanics", JSON.stringify(metadata));
    const upload = await api(`/api/admin/lessons/${lesson.id}/files`, adminCookie, { method: "POST", body: form });
    const uploadBody = await upload.json() as { results?: { ok: boolean; error?: string }[]; error?: string };
    assert.equal(upload.status, 201, JSON.stringify(uploadBody));
    assert.equal(uploadBody.results?.filter((item) => item.ok).length, 11);
    const prematurePublish = await api(`/api/admin/lessons/${lesson.id}/publish`, adminCookie, { method: "POST" });
    assert.equal(prematurePublish.status, 400, await prematurePublish.clone().text());
    const adminFiles = await api(`/api/admin/lessons/${lesson.id}`, adminCookie);
    const { files: drafts } = await adminFiles.json() as { files: { id: string }[] };
    for (const draft of drafts) {
      const verified = await api(`/api/admin/lessons/${lesson.id}/files/${draft.id}/verify`, adminCookie, { method: "POST" });
      assert.equal(verified.status, 200, await verified.clone().text());
    }
    const publish = await api(`/api/admin/lessons/${lesson.id}/publish`, adminCookie, { method: "POST" });
    assert.equal(publish.status, 200, await publish.text());
    const accessible = await api(`/api/learn/lessons/${lesson.id}`, studentCookie);
    assert.equal(accessible.status, 200, await accessible.clone().text());
    const data = await accessible.json() as { files: unknown[] };
    assert.equal(data.files.length, 11);
    const introCreate = await api("/api/admin/lessons", adminCookie, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ moduleId: section.id, code: "INTRO", title: "Synthetic intro" }) });
    assert.equal(introCreate.status, 201, await introCreate.clone().text());
    const { lesson: intro } = await introCreate.json() as { lesson: { id: string } };
    const introPanel = await api("/admin/intro", adminCookie);
    assert.equal(introPanel.status, 200);
    assert.match(await introPanel.text(), /Synthetic intro/);
    const duplicateIntro = await api("/api/admin/lessons", adminCookie, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ moduleId: section.id, code: "INTRO", title: "Duplicate intro" }) });
    assert.equal(duplicateIntro.status, 409);
    const introForm = new FormData();
    introForm.append("files", new File(['import React from "react"; export default function Intro(){return <p>Intro</p>}'], "INTRO.learn.jsx", { type: "text/plain" }));
    const introUpload = await api(`/api/admin/lessons/${intro.id}/files`, adminCookie, { method: "POST", body: introForm });
    assert.equal(introUpload.status, 201, await introUpload.clone().text());
    const introPremature = await api(`/api/admin/lessons/${intro.id}/publish`, adminCookie, { method: "POST" });
    assert.equal(introPremature.status, 400);
    const introFilesResponse = await api(`/api/admin/lessons/${intro.id}`, adminCookie);
    const { files: introFiles } = await introFilesResponse.json() as { files: { id: string }[] };
    const introVerified = await api(`/api/admin/lessons/${intro.id}/files/${introFiles[0].id}/verify`, adminCookie, { method: "POST" });
    assert.equal(introVerified.status, 200, await introVerified.clone().text());
    const introPublish = await api(`/api/admin/lessons/${intro.id}/publish`, adminCookie, { method: "POST" });
    assert.equal(introPublish.status, 200, await introPublish.clone().text());
    const demoIntro = await api(`/api/learn/lessons/${intro.id}`, demoCookie);
    assert.equal(demoIntro.status, 200, await demoIntro.clone().text());
    const guestIntro = await api(`/api/learn/lessons/${intro.id}`, "");
    assert.equal(guestIntro.status, 401);
    await db.update(courses).set({ isPublished: false }).where(eq(courses.id, courseId));
    const unpublished = await api(`/api/learn/lessons/${lesson.id}`, studentCookie);
    assert.equal(unpublished.status, 404);
    const unpublishedIntro = await api(`/api/learn/lessons/${intro.id}`, demoCookie);
    assert.equal(unpublishedIntro.status, 200, await unpublishedIntro.clone().text());
    const demoDashboard = await api("/learn", demoCookie);
    assert.equal(demoDashboard.status, 200);
    assert.match(await demoDashboard.text(), /Intro darsini ochish/);
    await db.update(courses).set({ isPublished: true }).where(eq(courses.id, courseId));
    const learn = await api(`/api/learn/lessons/${lesson.id}/progress`, studentCookie, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "learn", payload: { scorePercent: 100 } }) });
    assert.equal(learn.status, 200, await learn.text());
    for (let seq = 1; seq <= 10; seq++) {
      const practice = await api(`/api/learn/lessons/${lesson.id}/progress`, studentCookie, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "practice", seq, correct: true, durationMs: 1_000 }) });
      assert.equal(practice.status, 200, `${seq}: ${await practice.text()}`);
    }
    await db.update(enrollments).set({ isActive: false }).where(eq(enrollments.studentId, student.id));
    const revoked = await api(`/api/learn/lessons/${lesson.id}`, studentCookie);
    assert.equal(revoked.status, 404);
    console.log("Lesson API oqimi o'tdi: PIN sessiya → Intro demo → kurs dostupi → publish → progress → revoke.");
  } finally {
    if (courseId) await db.delete(courses).where(eq(courses.id, courseId));
    for (const id of userIds) await db.delete(users).where(eq(users.id, id));
    await getSqlClient().end();
  }
}

main().catch((error: unknown) => { console.error(error instanceof Error ? error.stack : String(error)); process.exitCode = 1; });
