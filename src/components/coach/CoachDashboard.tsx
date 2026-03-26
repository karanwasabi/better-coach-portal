"use client";

import { useMemo, useState } from "react";
import {
  MOCK_BATCHES,
  engagementTrend,
  filterStudents,
} from "@/lib/coach/mock-data";
import {
  contextualTileCopy,
  getWeekNumber,
  getWeekPhase,
} from "@/lib/coach/week-phase";
import type { GroupId } from "@/lib/coach/types";
import {
  percentContextualAmongLogged,
  percentLoggedToday,
} from "@/lib/coach/metrics";
import { EngagementTrendChart } from "./EngagementTrendChart";
import { RosterTable } from "./RosterTable";

function KpiCard({
  label,
  value,
  suffix,
  hint,
  accentClass,
}: {
  label: string;
  value: string | number;
  suffix?: string;
  hint: string;
  accentClass: string;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-[2rem] border-b-[8px] bg-gradient-to-br p-6 text-white shadow-xl ${accentClass}`}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest text-white/80">
        {label}
      </p>
      <p className="mt-2 font-semibold tabular-nums tracking-tight text-[2rem] leading-none sm:text-[2.25rem]">
        {value}
        {suffix ? (
          <span className="text-2xl font-semibold text-white/90">{suffix}</span>
        ) : null}
      </p>
      <p className="mt-3 max-w-[14rem] text-xs font-medium leading-snug text-white/85">
        {hint}
      </p>
    </div>
  );
}

function SquarcleSelect({
  id,
  label,
  value,
  onChange,
  children,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-[10rem] flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[10px] font-bold uppercase tracking-widest text-slate-500"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none rounded-2xl border-2 border-slate-100 bg-white/90 px-4 py-3 text-sm font-semibold text-slate-800 shadow-sm outline-none transition hover:border-violet-200 focus:border-[#5C65CF] focus:ring-2 focus:ring-[#5C65CF]/25"
      >
        {children}
      </select>
    </div>
  );
}

export function CoachDashboard() {
  const [batchId, setBatchId] = useState(MOCK_BATCHES[0]!.id);
  const [group, setGroup] = useState<GroupId>("A");

  const batch = MOCK_BATCHES.find((b) => b.id === batchId) ?? MOCK_BATCHES[0]!;

  const weekNumber = useMemo(() => {
    const start = new Date(`${batch.startMonday}T12:00:00.000Z`);
    return getWeekNumber(start, new Date());
  }, [batch.startMonday]);

  const phase = getWeekPhase(weekNumber);
  const contextual = contextualTileCopy(phase);
  const phaseLabel =
    phase === "build"
      ? "Build"
      : phase === "quiet"
        ? "Implementation"
        : "Challenge";

  const students = useMemo(
    () => filterStudents(batchId, group),
    [batchId, group],
  );

  const total = students.length;
  const logRate = percentLoggedToday(students);
  const contextualRate = percentContextualAmongLogged(students);
  const trend = useMemo(
    () => engagementTrend(batchId, group),
    [batchId, group],
  );

  const thirdAccent =
    phase === "build"
      ? "from-[#84CC16] via-[#4ADE80] to-[#16A34A] border-[#3F6212]"
      : phase === "quiet"
        ? "from-[#0EA5E9] via-[#38BDF8] to-[#0284C7] border-[#0369A1]"
        : "from-[#F43F5E] via-[#FB7185] to-[#DB2777] border-[#9F1239]";

  return (
    <div className="min-h-screen pb-16">
      <header className="border-b border-white/50 bg-white/40 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-8">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#5C65CF]">
              SBM Better
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-800 sm:text-[1.85rem]">
              Coach dashboard
            </h1>
            <p className="mt-2 max-w-xl text-sm font-medium text-slate-600">
              Program week {weekNumber} · {phaseLabel} phase
            </p>
          </div>
          <div className="flex flex-wrap items-end gap-4">
            <SquarcleSelect
              id="batch"
              label="Batch"
              value={batchId}
              onChange={setBatchId}
            >
              {MOCK_BATCHES.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.label}
                </option>
              ))}
            </SquarcleSelect>
            <SquarcleSelect
              id="group"
              label="Group"
              value={group}
              onChange={(v) => setGroup(v as GroupId)}
            >
              <option value="A">Group A</option>
              <option value="B">Group B</option>
            </SquarcleSelect>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-8 px-5 py-10 sm:px-8">
        <section className="grid gap-4 md:grid-cols-3">
          <KpiCard
            label="Total students"
            value={total}
            hint="Active learners in this batch & group"
            accentClass="from-[#5C65CF] via-[#6A71E6] to-[#4750C2] border-[#4149AA]"
          />
          <KpiCard
            label="Tonight's log rate"
            value={logRate}
            suffix="%"
            hint="% who finished their 20-second nightly log"
            accentClass="from-[#FF9F1C] via-[#FFB347] to-[#E88A0C] border-[#C2740E]"
          />
          <KpiCard
            label={contextual.title}
            value={contextualRate}
            suffix="%"
            hint={contextual.description}
            accentClass={thirdAccent}
          />
        </section>

        <EngagementTrendChart data={trend} />

        <RosterTable students={students} />
      </main>
    </div>
  );
}
