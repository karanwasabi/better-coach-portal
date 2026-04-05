export type GroupId = "A" | "B";

export type WeekPhase = "build" | "quiet" | "challenge";

export interface Batch {
  id: string;
  label: string;
  /** Monday ISO date string cohort week 1 starts */
  startMonday: string;
}

export interface Student {
  id: string;
  name: string;
  batchId: string;
  group: GroupId;
  checkedInToday: boolean;
  /** Index 0 = Monday … 6 = Sunday for the roster row */
  weekCheckedIn: boolean[];
  /** Used when contextual tile is action / habit / challenge */
  contextualMetToday: boolean;
}

export interface EngagementDay {
  /** Short date for x-axis, e.g. 13 Apr */
  dateLabel: string;
  /** Full date for tooltip, e.g. Mon, 13 Apr 2026 */
  fullDateLabel: string;
  label: string;
  rate: number;
}
