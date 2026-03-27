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
  loggedToday: boolean;
  /** Index 0 = Monday … 6 = Sunday for the roster row */
  weekLogged: boolean[];
  /** Used when contextual tile is action / habit / challenge */
  contextualMetToday: boolean;
}

export interface EngagementDay {
  label: string;
  rate: number;
}
