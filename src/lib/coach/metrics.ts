import type { Student } from "./types";

export function percentCheckedInToday(students: Student[]): number {
  if (students.length === 0) return 0;
  const n = students.filter((s) => s.checkedInToday).length;
  return Math.round((100 * n) / students.length);
}

/** % of students who checked in today who met contextual criterion (PRD tile 3). */
export function percentContextualAmongCheckedIn(students: Student[]): number {
  const withCheckIn = students.filter((s) => s.checkedInToday);
  if (withCheckIn.length === 0) return 0;
  const met = withCheckIn.filter((s) => s.contextualMetToday).length;
  return Math.round((100 * met) / withCheckIn.length);
}
