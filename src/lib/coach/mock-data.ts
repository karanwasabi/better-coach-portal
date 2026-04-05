import type { Batch, EngagementDay, GroupId, Student } from "./types";

export const MOCK_BATCHES: Batch[] = [
  { id: "apr-2026", label: "April 2026", startMonday: "2026-04-13" },
  { id: "jul-2026", label: "July 2026", startMonday: "2026-07-06" },
];

/** Deterministic pseudo-random 0..1 from string id */
function hash01(seed: string): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  return (Math.abs(h) % 997) / 997;
}

function weekPattern(studentId: string, offset: number): boolean[] {
  return Array.from({ length: 7 }, (_, i) => {
    const r = hash01(`${studentId}-d${i + offset}`);
    return r > 0.28;
  });
}

/** Indian names — 40 students so each batch × group has exactly 10. */
const NAMES = [
  "Aarav Sharma",
  "Ananya Iyer",
  "Vikram Reddy",
  "Priya Menon",
  "Rohan Patel",
  "Kavya Nair",
  "Arjun Singh",
  "Diya Kapoor",
  "Siddharth Joshi",
  "Meera Krishnan",
  "Karan Mehta",
  "Sanya Gupta",
  "Aditya Rao",
  "Riya Choudhury",
  "Nikhil Verma",
  "Ishita Das",
  "Rahul Malhotra",
  "Pooja Agarwal",
  "Varun Khanna",
  "Neha Bose",
  "Kunal Shah",
  "Tanvi Deshmukh",
  "Manish Pillai",
  "Shruti Srinivasan",
  "Dev Chatterjee",
  "Anjali Banerjee",
  "Sameer Khan",
  "Lakshmi Subramanian",
  "Harsh Thakur",
  "Swati Mishra",
  "Suresh Venkatesh",
  "Kavitha Raman",
  "Girish Nambiar",
  "Deepa Sundaram",
  "Rajesh Iyengar",
  "Fatima Sheikh",
  "Imran Qureshi",
  "Sanjay Dubey",
  "Rekha Tiwari",
  "Amitabh Bandyopadhyay",
];

/** Indices 0–19 → Jan 2026; 20–39 → Dec 2025. Even → Group A, odd → Group B. */
export const MOCK_STUDENTS: Student[] = NAMES.map((name, i) => {
  const id = `stu-${i + 1}`;
  const batchId = i < 20 ? "apr-2026" : "jul-2026";
  const group = i % 2 === 0 ? "A" : "B";
  const weekCheckedIn = weekPattern(id, i);
  const checkedInToday =
    weekCheckedIn[weekCheckedIn.length - 1] ?? hash01(`${id}-today`) > 0.35;
  const contextualMetToday =
    checkedInToday && hash01(`${id}-ctx`) > (group === "A" ? 0.4 : 0.45);
  return {
    id,
    name,
    batchId,
    group,
    checkedInToday,
    weekCheckedIn: weekCheckedIn.map((v, j) => (j === 6 ? checkedInToday : v)),
    contextualMetToday,
  };
});

export function filterStudents(batchId: string, group: GroupId): Student[] {
  return MOCK_STUDENTS.filter(
    (s) => s.batchId === batchId && s.group === group,
  );
}

/**
 * Recomputes per-day check-in flags and today's status for a selected week.
 * This keeps the dashboard interactive when coaches switch week context.
 */
export function projectStudentsForWeek(
  students: Student[],
  week: number,
): Student[] {
  const safeWeek = Math.min(12, Math.max(1, week));
  return students.map((s, i) => {
    const weekCheckedIn = Array.from({ length: 7 }, (_, day) => {
      const r = hash01(`${s.id}-w${safeWeek}-d${day}`);
      return r > 0.3;
    });
    const checkedInToday = weekCheckedIn[6] ?? false;
    const contextualThreshold = s.group === "A" ? 0.42 : 0.47;
    const contextualMetToday =
      checkedInToday &&
      hash01(`${s.id}-ctx-w${safeWeek}-${i}`) > contextualThreshold;

    return {
      ...s,
      checkedInToday,
      weekCheckedIn,
      contextualMetToday,
    };
  });
}

export function engagementTrend(
  batchId: string,
  group: GroupId,
  week: number,
  batchStartMonday: string,
): EngagementDay[] {
  const shift = Math.round(hash01(`${batchId}-${group}-w${week}`) * 6);
  const start = new Date(`${batchStartMonday}T00:00:00.000Z`);
  const weekStart = new Date(start.getTime() + (week - 1) * 7 * 86400000);
  const weekdayFmt = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    timeZone: "UTC",
  });
  const shortDateFmt = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  });
  const fullDateFmt = new Intl.DateTimeFormat("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(weekStart.getTime() + i * 86400000);
    return {
      label: weekdayFmt.format(day),
      dateLabel: shortDateFmt.format(day),
      fullDateLabel: fullDateFmt.format(day),
      rate: Math.round(
        55 + 38 * Math.sin((i + shift) / 1.2) + (i === 5 ? -12 : 0) + i * 2,
      ),
    };
  });
}
