import type { Batch, EngagementDay, GroupId, Student } from "./types";

export const MOCK_BATCHES: Batch[] = [
  { id: "jan-2026", label: "Batch Jan 2026", startMonday: "2026-01-05" },
  { id: "dec-2025", label: "Batch Dec 2025", startMonday: "2025-12-01" },
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

/** Fictional IN-style numbers for demos: 91 + 10 digits beginning with 01555… */
function fakeWhatsappNational10(index: number, studentId: string): string {
  const n =
    (index * 104_729 + Math.floor(hash01(`${studentId}-wa`) * 100_000)) %
    100_000;
  const tail = String(10_000 + n).slice(-5);
  return `01555${tail}`;
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
  const batchId = i < 20 ? "jan-2026" : "dec-2025";
  const group = i % 2 === 0 ? "A" : "B";
  const weekLogged = weekPattern(id, i);
  const loggedToday =
    weekLogged[weekLogged.length - 1] ?? hash01(`${id}-today`) > 0.35;
  const contextualMetToday =
    loggedToday && hash01(`${id}-ctx`) > (group === "A" ? 0.4 : 0.45);
  const national10 = fakeWhatsappNational10(i, id);

  return {
    id,
    name,
    batchId,
    group,
    whatsappDigits: `91${national10}`,
    loggedToday,
    weekLogged: weekLogged.map((v, j) => (j === 6 ? loggedToday : v)),
    contextualMetToday,
  };
});

export function filterStudents(batchId: string, group: GroupId): Student[] {
  return MOCK_STUDENTS.filter(
    (s) => s.batchId === batchId && s.group === group,
  );
}

export function engagementTrend(
  batchId: string,
  group: GroupId,
): EngagementDay[] {
  const shift = Math.round(hash01(`${batchId}-${group}`) * 6);
  const labels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  return labels.map((label, i) => ({
    label,
    rate: Math.round(
      55 + 38 * Math.sin((i + shift) / 1.2) + (i === 5 ? -12 : 0) + i * 2,
    ),
  }));
}
