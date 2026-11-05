type SequenceLesson = {
  id: string;
  status: string;
  learnDoneAt: unknown;
  practiceDoneAt: unknown;
};

/** Input follows curriculum order across all modules, including unpublished gaps. */
export function lessonSequence<T extends SequenceLesson>(ordered: T[], introDone: boolean) {
  let prerequisitesDone = introDone;
  return ordered.map((lesson) => {
    const completed = Boolean(lesson.learnDoneAt && lesson.practiceDoneAt);
    const unlocked = prerequisitesDone && lesson.status === "published";
    prerequisitesDone = prerequisitesDone && completed && lesson.status === "published";
    return { ...lesson, completed, unlocked };
  });
}
