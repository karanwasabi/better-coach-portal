"use client";

import dynamic from "next/dynamic";

const CoachDashboard = dynamic(
  () =>
    import("@/components/coach/CoachDashboard").then((m) => m.CoachDashboard),
  {
    ssr: false,
    loading: () => (
      <div className="flex min-h-screen items-center justify-center font-sans text-sm font-medium text-slate-600">
        Loading dashboard…
      </div>
    ),
  },
);

export function HomeClient() {
  return <CoachDashboard />;
}
