# 5-bosqich: JSX dars platformasi — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Super admin JSX Learn/Practice fayllarini xavfsiz yuklaydi va nashr qiladi; ruxsatli o‘quvchi ularni sandbox ichida bajaradi, natija saqlanadi.

**Architecture:** Mavjud kurs → modul modeliga kodli dars va versiyali fayllar qo‘shiladi. Server barcha rol/dostup va nashr shartlarini tekshiradi; JSX faqat izolyatsiyalangan iframe ichida ishlaydi. Bu etap faqat platforma kodi uchun: 353 ta dars fayli, dialog/audio yozish, placement savollari va sertifikatlar kirmaydi.

**Tech Stack:** Next.js 16 App Router, TypeScript, Drizzle/PostgreSQL (Supabase session pooler), Sucrase, React, Zod.

**Spec:** [`new docs/PLAN.md`](../../../new%20docs/PLAN.md) §3.3, §5, §7, §11 (5-bosqich); [`new docs/JSX_CONTRACT.md`](../../../new%20docs/JSX_CONTRACT.md) §3–7; [`new docs/COURSE.md`](../../../new%20docs/COURSE.md) §0–4.

## Global Constraints

- Faqat `super_admin` dars yaratadi, JSX yuklaydi, almashtiradi va nashr qiladi. `admin` ko‘rishi mumkin, o‘zgartira olmaydi.
- Nomlar: `INTRO.learn.jsx`, `M1L01.learn.jsx`, `M1L01.p01.jsx` … `p10.jsx`. Har Practice fayli bitta topshiriq. Intro uchun Practice talab qilinmaydi.
- Learn ≤ 1.5 MB, Practice ≤ 300 KB; default export majburiy; import allowlist Learn uchun `react`, `react-dom`, `@coliseum/kit`, Practice uchun `react`, `@coliseum/kit`.
- Oddiy dars nashri: 1 Learn va uzluksiz p01–p10. Intro nashri: 1 Learn. Draft yoki yarim yuklangan dars o‘quvchiga chiqmaydi.
- JSX iframe `sandbox="allow-scripts"` bilan ishlaydi; `allow-same-origin` yo‘q. Cookie/token iframe ga berilmaydi. CSP `connect-src 'none'` bo‘lishi kerak.
- `onFinished` Learn yakunini, `onReady` / `registerCheck` / `onSubmit` Practice holatini bildiradi. `Tekshirish` tugmasi platformada bo‘ladi. `lang` profilning `uz|ru|en` qiymatidan keladi.
- Oddiy Learn Rapid test o‘tish chegarasi 60%, `M1L08`/`M2L08`/`M3L08`/`M4L08` checkpointlari 70%; Intro ballsiz. Platforma threshold ni dars kodidan belgilaydi, kelgan `passed` qiymatiga ko‘r-ko‘rona tayanmaydi.
- Intro barcha login qilgan o‘quvchilarga demo sifatida, enrollment va kurs nashr holatidan mustaqil ochiq; oddiy darslarda faol enrollment va kurs/dars nashr holati serverda tekshiriladi. Login/PIN qoidasi o‘zgarmaydi.
- `COURSE.md` dagi 5 xil mexanika, 2 READ-MC/READ-TYPE, 1 FIX, p10 SCENE qoidalari nashr oldi tekshiruviga kiradi. Kurs ovozsiz. `meta` bo‘lmagan eski fayl draft sifatida qabul qilinishi mumkin; mexanika admin formasida to‘ldirilmaguncha nashr qilinmaydi. Learn gaplarining takrorlanmasligi va izohlar sifati tahririy tekshiruvdir.
- Next.js kodi yozishdan oldin `AGENTS.md` talabiga ko‘ra `node_modules/next/dist/docs/` dagi tegishli yo‘riqnoma o‘qilsin.

## Hozirgi koddan farq

- `src/db/schema.ts` dagi `lessons` bitta `jsxSource`/`compiledJs` juftligini saqlaydi; `lesson_files`, `practice_attempts` va Learn/Practice progressi hali yo‘q. Migratsiya mavjud dars/progress yozuvlarini yo‘qotmasligi kerak.
- `src/app/learn/[courseId]/page.tsx` hozir faqat modullarni ko‘rsatadi; dars route/player yo‘q.
- Mavjud `superAdminAccess`, `sameOrigin`, `activeCourseAccess` va `auditLog` andozalaridan foydalanilsin.
- `JSX_CONTRACT.md` dagi eski `Dars01.jsx` / `D01_01.jsx` misollari sinov fixturelari; production nom qoidasi yangi `M1L01.*.jsx` shakli.

## Review Focus

1. Admin yoki student upload/publish API ga to‘g‘ridan-to‘g‘ri so‘rov yuborsa `403`; eski draft ochilmaydi.
2. Oddiy darsda enrollment tugasa, bekor qilinsa yoki kurs/dars unpublished bo‘lsa, URL/API orqali compiled JS qaytmaydi. Intro istisno: login qilgan o‘quvchiga nashrdagi Intro kurs dasturisiz beriladi.
3. Bir nechta fayl yuklashda bittasi xato bo‘lsa, xato aynan shu faylda ko‘rinadi; oldingi published versiya ishlashda davom etadi.
4. Iframe dan soxta `postMessage` kelsa, host `event.source` va bir martalik nonce tekshiruvisiz qabul qilmaydi.
5. JSX cheksiz sikl, katta fayl, tashqi import yoki tarmoq chaqiruvini o‘z ichiga olsa, server jarayoni va maxfiy env ga kira olmaydi; aniq xato qaytadi.

---

### Task 1: Dars va fayl modeli

**Files:** `src/db/schema.ts`; yangi `drizzle/*.sql`; `tests/lesson-model.test.ts`.

**Interfaces:** `lessons.code` (`INTRO|M[1-4]L0[1-8]`), `lesson_files` (`lesson_id`, `kind`, `seq`, `mechanic`, `source`, `compiled_js`, `size_bytes`, `sha256`, `version`, `status`, `uploaded_by`, `uploaded_at`), `lesson_progress` va `practice_attempts`. Bir slotda ko‘p versiya saqlanadi; `(lesson_id, kind, seq, version)` unique, bitta joriy published versiya. Existing `progress` ma’lumotlari ko‘chiriladi yoki compatibility o‘qilishi bilan saqlanadi.

- [ ] Migratsiya testi: eski `lessons` va `progress` yozuvlari migratsiyadan keyin yo‘qolmasin; `INTRO`, dars kodi va versiya/slot cheklovlari tekshirilsin.
- [ ] Drizzle schema va migratsiyani qo‘shing; eski `jsxSource`/`compiledJs` ni o‘chirishdan oldin mavjud qiymatlarni `lesson_files` ga ko‘chiring.
- [ ] `npm.cmd run db:generate`, `npm.cmd run typecheck`, `npm.cmd test` natijalarini tekshiring; migratsiyani test DB da sinang. Production DB ga avtomatik migratsiya qilmang.

### Task 2: JSX tekshirish, versiyali upload va publish

**Files:** `src/lib/lessons/filename.ts`, `validate.ts`, `compile.ts`, `publish.ts`; `src/app/api/admin/lessons/route.ts`, `[id]/files/route.ts`, `[id]/publish/route.ts`; `tests/lesson-files.test.ts`.

**Interfaces:** `parseLessonFilename(name)` → `{code, kind, seq}`; `validateAndCompileLesson({name, source, kind})` → `{compiledJs, sha256, sizeBytes, meta}` yoki fayl/qator/sabab xatosi; `getPublishReadiness(lessonId)` → yetishmayotgan slotlar va mexanika qoidalari. Upload draft versiyani yaratadi, publish esa bir tranzaksiyada joriy versiyalarni almashtiradi va `auditLog` yozadi.

- [ ] Nom/tur mosligi, hajm, default export, allowlist, taqiqlangan API lar va sintaksis uchun testlar yozing; xato matnida fayl nomi va imkon qadar qator bo‘lsin.
- [ ] Sucrase kompilyatsiya va sandbox iframe ichida browser smoke qo‘shing. Yuklangan kodni Next server jarayonida erkin `vm` sifatida ishga tushirmang; preview xato qilsa yoki tasdiqlanmasa nashr bloklansin.
- [ ] `superAdminAccess` + `sameOrigin` bilan batch upload, draft versiyalash, eski versiyani qaytarish, audit va publish API larini yozing.
- [ ] Oddiy darsda p01–p10, 5 mexanika, 2 READ-MC/READ-TYPE, 1 FIX, p10 SCENE; Intro da faqat Learn nashr shartini test qiling. Publish tranzaksiyasi xatoda eski published holatni saqlasin.
- [ ] `npm.cmd test`, `npm.cmd run lint`, `npm.cmd run typecheck` o‘tsin.

### Task 3: Super admin boshqaruv ekrani

**Files:** `src/app/admin/courses/[id]/page.tsx`; `src/app/admin/lessons/[id]/page.tsx`; `src/components/admin/lesson-manager.tsx`; kerakli CSS.

**Interfaces:** Mavjud kurs → modul ichida dars yaratish va tartibini ko‘rish; dars ekranida ko‘p fayl drag & drop, har fayl natijasi, p01–p10 yig‘ilish holati, draft/published versiya, iframe preview va publish sababi ko‘rinadi.

- [ ] Super admin fayllarni yuklab preview va publish qila olishini; admin tahrir tugmalarini ko‘rmasligini tekshiring.
- [ ] Intro holatida p01–p10 talabi chiqmasin; boshqa darsda yetishmayotgan fayl/mexanika aniq ko‘rinsin.
- [ ] Dars ichki admin shell ichida ochilsin; responsive va klaviatura bilan ishlashini tekshiring.

### Task 4: Izolyatsiyalangan runtime va o‘quvchi playeri

**Files:** `src/app/lesson-frame/[id]/page.tsx`; `src/lib/lessons/runtime/*`; `src/app/learn/[courseId]/[lessonId]/page.tsx`; `src/components/learn/lesson-player.tsx`; `src/app/api/learn/lessons/[id]/route.ts`; `src/app/learn/[courseId]/page.tsx`.

**Interfaces:** Ota sahifa faqat ruxsatli published faylni oladi; iframe `postMessage` orqali `init`, `check` yuboradi va `ready`, `submit`, `finished`, `height` qabul qiladi. Learn `onFinished` dan keyin Practice p01–p10 tartibda; noto‘g‘ri javobda qayta urinish, to‘g‘rida `Keyingisi`. Minimal `@coliseum/kit`: MC, GAP, ORDER; standalone JSX ham ishlaydi.

- [ ] Ruxsatsiz, muddati tugagan, draft va boshqa student so‘rovlarida compiled JS berilmasligini test qiling.
- [ ] `sandbox="allow-scripts"` va CSP ni qo‘shing; `allow-same-origin` bo‘lmasin. `event.source` + nonce bilan xabarni tekshiring; iframe ga cookie/token yubormang.
- [ ] Practice `registerCheck(fn)` iframe ichida saqlansin; host `Tekshirish` tugmasi faqat `onReady(true)` da yoqilsin. `mode='review'` javobni qulflasin.
- [ ] Kurs sahifasida published darslar va holati ko‘rinsin; `/learn` dan barcha login qilgan studentlar Intro demo ga kira olsin.

### Task 5: Progress va yakuniy oqim tekshiruvi

**Files:** `src/app/api/learn/lessons/[id]/progress/route.ts`; `src/lib/lessons/progress.ts`; `tests/lesson-progress.test.ts`; `scripts/check-lessons-flow.ts`.

**Interfaces:** `onFinished` payloadi `lesson_progress.learn_payload` ga bir marta/idempotent saqlanadi; har Practice uchun urinishlar, birinchi urinish to‘g‘riligi va vaqt saqlanadi. Oddiy dars yakuni Learn `passed` + 10 ta to‘g‘ri Practice bilan; Intro yakuni Learn `onFinished` bilan. Natija client JSX dan kelgani sabab server uni **client-reported** deb saqlaydi, rasmiy imtihon bahosi sifatida qabul qilmaydi.

- [ ] Takroriy callback, noto‘g‘ri `seq`, boshqa student, bekor qilingan enrollment va draft dars progressi uchun testlar yozing.
- [ ] 60% oddiy dars, 70% checkpoint va ballsiz Intro uchun progress hisobini test qiling.
- [ ] Serverda auth/dostup va Zod payload tekshiruvini qo‘shing; Practice p02 ni p01 to‘g‘ri bo‘lmasdan yozishga yo‘l qo‘ymang.
- [ ] Sintetik `M1L01` (1 Learn + 10 sodda Practice) bilan upload → preview → publish → student yechish → progress oqimini test DB da sinang. 353 ta real kontent bu sinovga kirmaydi.
- [ ] `npm.cmd run lint`, `npm.cmd run typecheck`, `npm.cmd test`, `npm.cmd run build` o‘tsin; natijalarni va qolgan cheklovlarni qayd eting.
