"use client";

import { useEffect, useRef, useState } from "react";
import type { EngagementDay } from "@/lib/coach/types";
import {
  Area,
  ComposedChart,
  CartesianGrid,
  Line,
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

function TrendTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload?: EngagementDay }>;
}) {
  if (!active || !payload?.length || !payload[0]?.payload) return null;
  const row = payload[0].payload;
  return (
    <div className="rounded-2xl bg-white px-4 py-2.5 shadow-xl shadow-[#5C65CF]/20">
      <p className="text-[11px] font-semibold text-slate-600">
        {row.fullDateLabel}
      </p>
      <p className="mt-1 text-sm font-bold text-slate-800">
        {row.rate}% log rate
      </p>
    </div>
  );
}

export function EngagementTrendChart({
  data,
  subtitle,
}: {
  data: EngagementDay[];
  subtitle: string;
}) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const [chartWidth, setChartWidth] = useState(0);

  useEffect(() => {
    if (!wrapperRef.current) return;
    const el = wrapperRef.current;
    const updateWidth = () => {
      const next = Math.floor(el.getBoundingClientRect().width);
      if (next > 0) setChartWidth(next);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

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
        <p className="text-xs font-medium text-slate-500">{subtitle}</p>
      </div>
      <div ref={wrapperRef} className="h-[260px] w-full min-w-0">
        {chartWidth > 0 ? (
          <ComposedChart
            data={data}
            width={chartWidth}
            height={260}
            margin={{ top: 8, right: 8, left: 8, bottom: 4 }}
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
              dataKey="dateLabel"
              tick={{ fill: "#64748b", fontSize: 12, fontWeight: 500 }}
              axisLine={false}
              tickLine={false}
              dy={8}
            />
            <YAxis
              domain={[0, 100]}
              width={44}
              tickFormatter={(v) => `${v}%`}
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickMargin={8}
            />
            <Tooltip
              cursor={{ stroke: BRAND, strokeWidth: 1, strokeDasharray: "4 4" }}
              content={<TrendTooltip />}
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
        ) : (
          <div className="h-[260px] w-full rounded-2xl bg-slate-100/70" />
        )}
      </div>
    </div>
  );
}
