"use client";

import Image from "next/image";
import { ChevronDown } from "lucide-react";
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
    <div className="flex min-w-[11rem] flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[10px] font-bold uppercase tracking-widest text-slate-500"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full cursor-pointer appearance-none rounded-2xl border-2 border-slate-100 bg-white/90 py-3 pl-4 pr-11 text-sm font-semibold text-slate-800 shadow-sm outline-none transition hover:border-violet-200 focus:border-[#5C65CF] focus:ring-2 focus:ring-[#5C65CF]/25"
        >
          {children}
        </select>
        <ChevronDown
          aria-hidden
          className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#5C65CF]/70"
          strokeWidth={2.5}
        />
      </div>
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
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
            <div className="relative h-12 w-[190px] shrink-0 sm:h-14 sm:w-[230px]">
              <Image
                src="/better-logo.svg"
                alt="BETTER"
                fill
                className="object-contain object-left"
                priority
                sizes="(min-width: 640px) 230px, 190px"
              />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#5C65CF]">
                Coach tools
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-800 sm:text-[1.85rem]">
                Your batch pulse
              </h1>
              <p className="mt-2 max-w-xl text-sm font-medium text-slate-600">
                Program week {weekNumber} · {phaseLabel} phase
              </p>
            </div>
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
            hint="Active members in this batch & group"
            accentClass="from-[#5C65CF] via-[#6A71E6] to-[#4750C2] border-[#4149AA]"
          />
          <KpiCard
            label="Tonight's log rate"
            value={logRate}
            suffix="%"
            hint="Members who logged their effort today"
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
