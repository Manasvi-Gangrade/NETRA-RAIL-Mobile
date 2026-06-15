import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { AlertTriangle, Gauge, Hand, Plane, Radio, Train } from "lucide-react";
import { useState, useRef } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell } from "@/components/netra/AppShell";
import {
  Chip,
  CountUp,
  GlassCard,
  LiveDot,
  PressButton,
  ScanWipe,
  SectionTitle,
  VerifiedBadge,
  formatCountdown,
  useCountdown,
} from "@/components/netra/primitives";
import {
  controllerAlert,
  controllerStats,
  precedenceFeed,
  sectionThroughput,
} from "@/lib/netra/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/control")({
  head: () => ({
    meta: [
      { title: "Traffic Control — NETRA-RAIL Mobile" },
      {
        name: "description",
        content:
          "Station Master console: live precedence decisions with plain-language reasoning, section throughput, drone verification status and manual override.",
      },
      { property: "og:title", content: "Traffic Control — NETRA-RAIL Mobile" },
      {
        property: "og:description",
        content:
          "Explainable precedence feed, section throughput and override authority for station masters and traffic controllers.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ControlPage,
});

function ControlPage() {
  return (
    <AppShell
      role="controller"
      title="Section Control · Vadodara"
      subtitle="BRC–ST corridor · single-line block active"
      boot
    >
      <div className="space-y-6">
        <StatBar />
        <CriticalAlert />
        <PrecedenceFeed />
        <ThroughputChart />
        <OverridePanel />
      </div>
    </AppShell>
  );
}

function StatBar() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {controllerStats.map((s, i) => (
        <GlassCard key={s.label} delay={i * 0.05} className="p-3">
          <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{s.label}</p>
          <p className="mt-1 text-[22px] font-semibold leading-none">
            <CountUp to={s.value} decimals={s.label.includes("Delay") ? 1 : 0} />
          </p>
        </GlassCard>
      ))}
    </div>
  );
}

function CriticalAlert() {
  const left = useCountdown(controllerAlert.droneEtaSeconds);
  return (
    <GlassCard glow className="relative overflow-hidden p-4">
      <ScanWipe />
      <div className="relative">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-warn">
              <AlertTriangle className="h-3.5 w-3.5" /> Priority advisory
            </p>
            <h3 className="mt-1 text-[15px] font-semibold leading-snug">{controllerAlert.title}</h3>
          </div>
          <LiveDot label="PILLAR C" tone="warn" />
        </div>
        <p className="mt-2 text-[12px] leading-relaxed text-muted-foreground">
          {controllerAlert.detail}
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-hairline bg-surface px-3 py-2">
            <p className="inline-flex items-center gap-1 text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground">
              <Plane className="h-3 w-3" /> Drone NR-D17 ETA
            </p>
            <p className="num text-[18px] font-semibold text-primary">{formatCountdown(left)}</p>
          </div>
          <div className="rounded-xl border border-hairline bg-surface px-3 py-2">
            <p className="text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground">
              Speed cap in force
            </p>
            <p className="num text-[18px] font-semibold">90 km/h</p>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

const DECISION_TONE = {
  PASS: "live",
  HELD: "warn",
  SLOW: "primary",
} as const;

function PrecedenceFeed() {
  const [open, setOpen] = useState<string | null>(precedenceFeed[0]?.id ?? null);
  return (
    <section>
      <SectionTitle
        title="Live precedence decisions"
        sub="Every call, with its reason"
        right={<VerifiedBadge text="Audit logged" />}
      />
      <div className="space-y-2">
        {precedenceFeed.map((p, i) => (
          <GlassCard key={p.id} delay={i * 0.04} className="p-3.5">
            <button
              onClick={() => setOpen((v) => (v === p.id ? null : p.id))}
              className="grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 text-left"
            >
              <span
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-xl border border-hairline",
                  p.cls === "freight" ? "bg-surface-2" : "bg-surface",
                )}
              >
                {p.cls === "freight" ? (
                  <Radio className="h-4 w-4 text-warn" />
                ) : (
                  <Train className="h-4 w-4 text-primary" />
                )}
              </span>
              <span className="min-w-0">
                <span className="num block text-[11px] text-muted-foreground">{p.id}</span>
                <span className="block truncate text-[13px] font-semibold">{p.name}</span>
                <span className="block truncate text-[10.5px] text-muted-foreground">{p.at}</span>
              </span>
              <span className="flex shrink-0 flex-col items-end gap-1">
                <Chip tone={DECISION_TONE[p.decision]}>{p.decision}</Chip>
                <span className="num text-[10.5px] text-muted-foreground">{p.delta}</span>
              </span>
            </button>
            {open === p.id && (
              <motion.p
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-2.5 overflow-hidden border-t border-hairline pt-2.5 text-[11.5px] leading-relaxed text-muted-foreground"
              >
                <span className="font-semibold text-foreground">Reasoning: </span>
                {p.why}
              </motion.p>
            )}
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function ThroughputChart() {
  return (
    <GlassCard className="p-4">
      <SectionTitle
        title="Section throughput"
        sub="Trains cleared vs target"
        right={<LiveDot label="LIVE" tone="primary" />}
      />
      <div className="h-[196px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sectionThroughput} margin={{ top: 6, right: 6, left: -24, bottom: 0 }}>
            <CartesianGrid stroke="var(--hairline)" vertical={false} />
            <XAxis
              dataKey="t"
              tick={{ fontSize: 9.5, fill: "var(--muted-foreground)" }}
              stroke="var(--hairline)"
            />
            <YAxis
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              stroke="var(--hairline)"
            />
            <Tooltip
              contentStyle={{
                background: "var(--popover)",
                border: "1px solid var(--hairline)",
                borderRadius: 12,
                fontSize: 11,
                color: "var(--popover-foreground)",
              }}
            />
            <Line
              type="monotone"
              dataKey="target"
              stroke="var(--muted-foreground)"
              strokeDasharray="4 4"
              strokeWidth={1.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="trains"
              stroke="var(--chart-1)"
              strokeWidth={2.4}
              dot={{ r: 2.5, fill: "var(--chart-1)" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

function OverridePanel() {
  const [held, setHeld] = useState(false);
  const [done, setDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const startHold = () => {
    if (done) return;
    setHeld(true);
    timerRef.current = setTimeout(() => {
      setDone(true);
      setHeld(false);
    }, 3000);
  };

  const endHold = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setHeld(false);
  };

  return (
    <GlassCard className="p-4">
      <SectionTitle
        title="Manual override authority"
        sub="Human-in-the-loop · press and hold 3 s"
        right={<Chip tone="critical">SM AUTHORITY</Chip>}
      />
      <div className="rounded-xl border border-hairline bg-surface p-3">
        <p className="text-[11.5px] leading-relaxed text-muted-foreground">
          Overriding suspends the AI precedence plan for this section for 10 minutes. All decisions
          revert to manual and every action is recorded against your employee ID.
        </p>
      </div>
      <button
        onMouseDown={startHold}
        onMouseUp={endHold}
        onMouseLeave={endHold}
        onTouchStart={startHold}
        onTouchEnd={endHold}
        onContextMenu={(e) => e.preventDefault()}
        className="press mt-3 relative w-full overflow-hidden rounded-xl border px-4 py-3.5 text-sm font-semibold select-none touch-none"
        style={{
          borderColor: "color-mix(in oklab, var(--critical) 55%, transparent)",
          backgroundColor: "color-mix(in oklab, var(--critical) 10%, transparent)",
          color: "var(--critical)",
        }}
      >
        <motion.span
          className="absolute inset-y-0 left-0"
          style={{ backgroundColor: "color-mix(in oklab, var(--critical) 25%, transparent)" }}
          animate={{ width: held ? "100%" : "0%" }}
          transition={{ duration: held ? 3 : 0.2, ease: "linear" }}
        />
        <span className="relative inline-flex items-center justify-center gap-2">
          <Hand className="h-4 w-4" />
          {done ? "Manual control engaged · 10:00" : held ? "Keep holding..." : "Hold to take manual control"}
        </span>
      </button>
      <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          <Gauge className="h-3 w-3 text-primary" /> AI plan confidence 0.96
        </span>
        <span>Overrides today: 2</span>
      </div>
      <PressButton tone="ghost" className="mt-3 w-full py-2.5 text-[12px]">
        View decision audit trail
      </PressButton>
    </GlassCard>
  );
}
