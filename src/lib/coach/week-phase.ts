import type { WeekPhase } from "./types";

const BUILD_WEEKS = new Set([1, 2, 4, 6, 8]);
const QUIET_WEEKS = new Set([3, 5, 7, 9]);

export function getWeekNumber(batchStartMonday: Date, now: Date): number {
  const start = startOfUtcDay(batchStartMonday.getTime());
  const end = startOfUtcDay(now.getTime());
  if (end < start) return 1;
  const days = Math.floor((end - start) / 86400000);
  const week = Math.floor(days / 7) + 1;
  return Math.min(12, Math.max(1, week));
}

export function getWeekPhase(week: number): WeekPhase {
  if (week >= 10) return "challenge";
  if (BUILD_WEEKS.has(week)) return "build";
  if (QUIET_WEEKS.has(week)) return "quiet";
  return "quiet";
}

export function contextualTileCopy(phase: WeekPhase): {
  title: string;
  description: string;
} {
  switch (phase) {
    case "build":
      return {
        title: "Action completion",
        description: "Members who completed today’s action",
      };
    case "quiet":
      return {
        title: "Habit adherence",
        description: "Members who completed baseline habits",
      };
    case "challenge":
      return {
        title: "Challenge success",
        description: "Members who scored between floor & ceiling today",
      };
  }
}

function startOfUtcDay(ms: number): number {
  const d = new Date(ms);
  return Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
}
