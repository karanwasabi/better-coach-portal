"use client";

import { useMemo } from "react";
import { Check, MessageCircle, Minus } from "lucide-react";
import type { Student } from "@/lib/coach/types";

const DAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export function RosterTable({ students }: { students: Student[] }) {
  const rows = useMemo(
    () => [...students].sort((a, b) => a.name.localeCompare(b.name)),
    [students],
  );

  return (
    <div className="rounded-[2rem] border-b-[6px] border-slate-200/80 bg-white/90 px-4 py-6 shadow-xl shadow-slate-200/60 backdrop-blur-sm sm:px-8">
      <div className="mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
          Roster
        </p>
        <h2 className="text-xl font-semibold tracking-tight text-slate-800 sm:text-[1.35rem]">
          Your crew this week
        </h2>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-100">
        <table className="w-full min-w-[640px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/90">
              <th className="rounded-tl-2xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                Student
              </th>
              <th className="px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                This week
              </th>
              <th className="rounded-tr-2xl px-4 py-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                Nudge
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s) => (
              <tr
                key={s.id}
                className="border-b border-slate-100 last:border-b-0 hover:bg-violet-50/40"
              >
                <td className="px-4 py-4">
                  <span className="font-semibold text-slate-800">{s.name}</span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex gap-1.5">
                    {DAYS.map((d, i) => (
                      <div
                        key={`${s.id}-${i}`}
                        className="flex h-9 w-9 flex-col items-center justify-center rounded-xl border border-slate-100 bg-white shadow-sm"
                        title={`${d} ${s.weekLogged[i] ? "logged" : "missed"}`}
                      >
                        <span className="text-[9px] font-bold text-slate-400">
                          {d}
                        </span>
                        {s.weekLogged[i] ? (
                          <Check
                            className="h-3.5 w-3.5 text-emerald-500"
                            strokeWidth={3}
                            aria-label="Logged"
                          />
                        ) : (
                          <Minus
                            className="h-3.5 w-3.5 text-slate-300"
                            strokeWidth={2.5}
                            aria-label="Missed"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <a
                    href={`https://wa.me/${s.whatsappDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-[1.25rem] border-b-[4px] border-[#128C7E] bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-600/25 transition hover:brightness-105 active:translate-y-0.5 active:border-b-[2px]"
                  >
                    <MessageCircle className="h-4 w-4" strokeWidth={2} />
                    WhatsApp
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {rows.length === 0 ? (
        <p className="mt-4 text-center text-sm text-slate-500">
          No students in this batch and group yet.
        </p>
      ) : null}
    </div>
  );
}
