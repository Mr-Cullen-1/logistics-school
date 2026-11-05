# Module 4 Learn implementation plan

**Goal:** Create eight upload-ready theory lessons from the approved Module 4 content, upload them, commit and push to the usual main branch.
**Architecture:** Standalone React JSX generated from scoped content, a Module 4 renderer extension and CSS. Reuse stable lesson navigation, theory sequencing and callbacks; add mixed written/choice assessment without changing earlier modules or the shared runtime.
**Tech stack:** JSX/React, local CSS/SVG 2D and CSS 3D, existing compiler and sandbox, production admin API.
**Spec:** `new docs/MODULE4_CONTENT.md`.

- [x] Author 73 theory explanations and lesson-specific cases, distractors and written assessment prompts across eight lessons. Use independent content tasks under subagent-driven-development; no agent commits or publishes.
- [x] Build emerald/graphite, platinum and amber Module 4 scenes, compact responsive layout, reduced motion, pause/replay and mixed assessments. Content appears in meaningful stages; no duplicate title kicker.
- [x] Generate eight standalone JSX files; check all compile and content invariants. Run focused sandbox flow/layout tests and failure/retry tests for new assessment behavior; inspect representative desktop/mobile renders.
- [x] Upload each Learn to its matching Module 4 lesson through existing admin APIs; verify hashes/current versions. Preserve readiness rules: Learn can be current while the lesson remains draft until its ten Practice files exist.
- [x] Update authoring/release docs, review changes, commit and push origin/main. Report actual publication state without implying missing Practice exists.

## Decisions

- Design: dark emerald control desk, amber decision markers, platinum text; 3D decision console and 2D evidence signals. Existing navigation dimensions and voice-free behavior retained.
- Ordinary Learn tests: six questions including written items; final: twelve including four written items. First-attempt scoring, 60% / 70%, no finish below threshold.
- Content-only files from the previous approved turn are included in the final commit. No standalone Practice files in this task.
- User authorized uploads and push; no further approval gate. Stay on the usual main branch as previously requested.

## Verification and release

- All eight files compiled and uploaded through production admin APIs; Learn v1 current/published and SHA-256 matched. Lessons remain draft with zero Practice files.
- M4L01 and M4L08 sandbox flows passed, including motion and mixed final failure/retry.
- All eight desktop layouts inspected at three sizes; four 7px overflows corrected, affected slides passed focused rerun. Mobile sample inspected.
- Independent review corrections: persist assessment attempts across back navigation, tolerate clause commas, target L07 hints, use one continuous L08 final load history.
- Final handoff: commit and push main as authorized.
