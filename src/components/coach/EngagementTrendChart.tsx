"use client";

import type { EngagementDay } from "@/lib/coach/types";
import {
  Area,
  ComposedChart,
  CartesianGrid,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const BRAND = "#5C65CF";

function HollowDot(props: { cx?: number; cy?: number; stroke?: string }) {
  const { cx = 0, cy = 0, stroke = BRAND } = props;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={7}
      fill="white"
      stroke={stroke}
      strokeWidth={3}
    />
  );
}

export function EngagementTrendChart({ data }: { data: EngagementDay[] }) {
  return (
    <div className="rounded-[2rem] border-b-[6px] border-[#4149AA]/35 bg-white/85 px-4 py-6 shadow-xl shadow-[#5C65CF]/15 backdrop-blur-sm sm:px-8">
      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
            Pulse
          </p>
          <h2 className="text-xl font-semibold tracking-tight text-slate-800 sm:text-[1.35rem]">
            7-day engagement
          </h2>
        </div>
        <p className="text-xs font-medium text-slate-500">
          Daily log rate · last 7 days
        </p>
      </div>
      <div className="h-[260px] w-full min-w-0">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            margin={{ top: 8, right: 8, left: -18, bottom: 4 }}
          >
            <defs>
              <linearGradient id="engagementFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={BRAND} stopOpacity={0.35} />
                <stop offset="92%" stopColor={BRAND} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 8"
              stroke="#e2e8f0"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              domain={[0, 100]}
              width={36}
              tickFormatter={(v) => `${v}%`}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ stroke: BRAND, strokeWidth: 1, strokeDasharray: "4 4" }}
              contentStyle={{
                borderRadius: 16,
                border: "none",
                boxShadow: "0 12px 40px rgb(92 101 207 / 0.2)",
              }}
              formatter={(value) => [
                `${typeof value === "number" ? value : Number(value) || 0}%`,
                "Log rate",
              ]}
            />
            <Area
              type="monotone"
              dataKey="rate"
              stroke="none"
              fill="url(#engagementFill)"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="rate"
              stroke={BRAND}
              strokeWidth={3}
              dot={<HollowDot />}
              activeDot={{ r: 9, fill: "white", stroke: BRAND, strokeWidth: 3 }}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
