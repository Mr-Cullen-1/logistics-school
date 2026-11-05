// Fictional training cases: all operational constraints belong to the stated case.
export const rule = (heading, explanation, steps, points, example, translation, wrong, why) => ({kind:'theory',heading,explanation,steps,points,example,translation,wrong,right:example,why});
export const q = (stem, right, wrong1, wrong2, why, hints, theoryRefs) => ({kind:'choice',stem,options:[right,wrong1,wrong2],answer:0,why,hints:['',...hints],theoryRefs});
export const typed = (stem, answerText, accept, why, hint, theoryRefs) => ({kind:'type',stem,answerText,accept,why,hint,theoryRefs});
export const build = (answer, parts) => ({answer,parts});
export const doc = (title, rows, note) => ({title,rows,note});
export const field = (label, answer, accept = [], hint = 'Manbadagi tegishli detal va tasdiq holatini tekshiring.') => ({label,answer,accept,hint});
