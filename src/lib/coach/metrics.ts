import type { Student } from "./types";

export function percentLoggedToday(students: Student[]): number {
  if (students.length === 0) return 0;
  const n = students.filter((s) => s.loggedToday).length;
  return Math.round((100 * n) / students.length);
}

/** % of logging students who met contextual criterion (PRD tile 3). */
export function percentContextualAmongLogged(students: Student[]): number {
  const logged = students.filter((s) => s.loggedToday);
  if (logged.length === 0) return 0;
  const met = logged.filter((s) => s.contextualMetToday).length;
  return Math.round((100 * met) / logged.length);
}
