import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Activity,
  Gauge,
  MapPin,
  Mic,
  Radar,
  ShieldCheck,
  Sparkles,
  TrainFront,
} from "lucide-react";
import { useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
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
import { delayExplainer, guardian, journey, nearbyAlerts } from "@/lib/netra/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/passenger")({
  head: () => ({
    meta: [
      { title: "Passenger Journey — NETRA-RAIL Mobile" },
      {
        name: "description",
        content:
          "Live train tracking, plain-language delay explanations and Guardian contribution — see exactly why your train is where it is.",
      },
      { property: "og:title", content: "Passenger Journey — NETRA-RAIL Mobile" },
      {
        property: "og:description",
        content: "Live journey progress, explainable delays and your Track Guardian score.",
      },
    ],
  }),
  component: PassengerHome,
});

function PassengerHome() {
  const [guardOn, setGuardOn] = useState(true);
  const droneLeft = useCountdown(delayExplainer.droneEtaSeconds);

  return (
    <AppShell role="passenger" title="Your Journey" subtitle="12951 · Mumbai Rajdhani Express" boot>
      <JourneyHero />

      <div className="mt-4 grid gap-3">
        <GlassCard glow>
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-cyan" />
                <h3 className="text-[13px] font-semibold">Why is my train late?</h3>
              </div>
              <p className="mt-1 text-[12px] font-semibold text-warn">{delayExplainer.headline}</p>
              <p className="mt-2 text-[11.5px] leading-relaxed text-muted-foreground">
                {delayExplainer.plain}
              </p>
            </div>
            <Chip tone="cyan">
              {Math.round(delayExplainer.confidence * 100)}%
            </Chip>
          </div>

          <div className="mt-3 grid gap-2">
            {delayExplainer.factors.map((f) => (
              <div key={f.label}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[11px]">{f.label}</span>
                  <span className="num shrink-0 text-[11px] text-muted-foreground">
                    {f.weight} min · {f.note}
                  </span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-surface-2">
                  <motion.div
                    className="h-full bg-live-gradient"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${(f.weight / 12) * 100}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center justify-between rounded-xl border border-hairline bg-surface px-3 py-2">
            <span className="inline-flex items-center gap-1.5 text-[11px]">
              <Radar className="h-3.5 w-3.5 text-cyan" /> Drone NR-D17 verifying Km 428
            </span>
            <span className="num text-[12px] font-semibold text-cyan">
              {formatCountdown(droneLeft)}
            </span>
          </div>
        </GlassCard>

        <GlassCard className="relative overflow-hidden">
          {guardOn && <ScanWipe />}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h3 className="text-[13px] font-semibold">Track Safety Contribution</h3>
              <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                Your phone's motion sensors help Pillar A detect track anomalies. Anonymous,
                battery-light, and it protects every train behind you.
              </p>
            </div>
            <button
              onClick={() => setGuardOn((v) => !v)}
              aria-label="Toggle track safety contribution"
              className={cn(
                "press relative h-7 w-12 shrink-0 rounded-full border transition-colors",
                guardOn ? "border-live/60 bg-live/25" : "border-hairline bg-surface-2",
              )}
            >
              <motion.span
                layout
                transition={{ type: "spring", stiffness: 600, damping: 34 }}
                className={cn(
                  "absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full",
                  guardOn ? "right-1 bg-live" : "left-1 bg-muted-foreground",
                )}
              />
            </button>
          </div>

          <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-4">
            <GuardianRing value={guardian.kmThisMonth / guardian.kmTarget} />
            <div className="min-w-0">
              <p className="text-[12px] font-semibold text-cyan">{guardian.level}</p>
              <p className="num mt-0.5 text-[11px] text-muted-foreground">
                <CountUp to={guardian.kmThisMonth} /> / {guardian.kmTarget} km monitored
              </p>
              <p className="mt-1 text-[10.5px] text-muted-foreground">
                {guardian.kmTarget - guardian.kmThisMonth} km to {guardian.nextLevel} ·{" "}
                {guardian.anomaliesFlagged} anomalies flagged
              </p>
              <p className="mt-1 inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                <ShieldCheck className="h-3 w-3 text-india-green" />
                {guardian.contributorsNearby.toLocaleString("en-IN")} guardians on this corridor
              </p>
            </div>
          </div>

          <div className="mt-3 h-28">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={guardian.history} margin={{ top: 4, right: 4, bottom: 0, left: -26 }}>
                <defs>
                  <linearGradient id="km-grad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--live)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--live)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--hairline)" vertical={false} />
                <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={9} tickLine={false} />
                <YAxis stroke="var(--muted-foreground)" fontSize={9} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    background: "var(--popover)",
                    border: "1px solid var(--hairline)",
                    borderRadius: 12,
                    fontSize: 11,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="km"
                  stroke="var(--live)"
                  strokeWidth={2}
                  fill="url(#km-grad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <div>
          <SectionTitle
            title="Around your train"
            sub="Live grid events within 60 km"
            right={<LiveDot />}
          />
          <GlassCard className="p-3">
            <div className="relative h-44 overflow-hidden rounded-xl border border-hairline bg-surface">
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage:
                    "linear-gradient(var(--hairline) 1px, transparent 1px), linear-gradient(90deg, var(--hairline) 1px, transparent 1px)",
                  backgroundSize: "26px 26px",
                }}
              />
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
                <path
                  d="M4 88 C 26 74, 34 52, 56 40 S 84 22, 96 12"
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="1.4"
                  strokeDasharray="4 4"
                  className="animate-dash"
                />
              </svg>
              {nearbyAlerts.map((a) => (
                <motion.span
                  key={a.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${a.x}%`, top: `${a.y}%` }}
                >
                  <span
                    className="block h-3 w-3 rounded-full animate-breathe"
                    style={{
                      backgroundColor:
                        a.severity === "warn"
                          ? "var(--warn)"
                          : a.severity === "ok"
                            ? "var(--live)"
                            : "var(--cyan)",
                    }}
                  />
                </motion.span>
              ))}
              <span className="absolute bottom-2 left-2 inline-flex items-center gap-1 rounded-md bg-background/70 px-2 py-1 text-[9px] text-muted-foreground">
                <MapPin className="h-3 w-3 text-cyan" /> Vadodara–Surat section
              </span>
            </div>

            <div className="mt-3 grid gap-2">
              {nearbyAlerts.map((a) => (
                <div
                  key={a.id}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-xl border border-hairline bg-surface px-3 py-2"
                >
                  <Activity
                    className="h-4 w-4"
                    style={{
                      color:
                        a.severity === "warn"
                          ? "var(--warn)"
                          : a.severity === "ok"
                            ? "var(--live)"
                            : "var(--cyan)",
                    }}
                  />
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-semibold">{a.title}</p>
                    <p className="truncate text-[10.5px] text-muted-foreground">
                      {a.location} · {a.detail}
                    </p>
                  </div>
                  <span className="num text-[9.5px] text-muted-foreground">{a.id}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <GlassCard className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[13px] font-semibold">Ask NETRA anything</h3>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              Voice assistant in 230+ Indian languages
            </p>
          </div>
          <PressButton className="shrink-0 px-4">
            <Mic className="h-4 w-4" /> Speak
          </PressButton>
        </GlassCard>

        <div className="flex justify-center pb-2">
          <VerifiedBadge text="Data verified by Indian Railways CRIS feed" />
        </div>
      </div>
    </AppShell>
  );
}

function JourneyHero() {
  return (
    <GlassCard glow className="relative overflow-hidden">
      <ScanWipe />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <TrainFront className="h-4 w-4 text-cyan" />
            <span className="num text-[12px] font-semibold">{journey.trainNo}</span>
            <LiveDot />
          </div>
          <h2 className="mt-1 truncate text-[16px] font-semibold">{journey.trainName}</h2>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Coach {journey.coach} · Seat {journey.seat}
          </p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Delay</p>
          <p className="num text-[20px] font-semibold text-warn">+{journey.delayMinutes}m</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2">
        <div>
          <p className="num text-[13px] font-semibold">{journey.from.code}</p>
          <p className="text-[9.5px] text-muted-foreground">{journey.from.name}</p>
        </div>
        <div className="relative h-1.5 rounded-full bg-surface-2">
          <motion.div
            className="absolute inset-y-0 left-0 rounded-full bg-live-gradient"
            initial={{ width: 0 }}
            animate={{ width: `${journey.progress * 100}%` }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
          <motion.span
            className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-cyan animate-breathe"
            initial={{ left: 0 }}
            animate={{ left: `calc(${journey.progress * 100}% - 6px)` }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
        <div className="text-right">
          <p className="num text-[13px] font-semibold">{journey.to.code}</p>
          <p className="text-[9.5px] text-muted-foreground">{journey.to.name}</p>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-1.5 xs:gap-2">
        <MiniStat label="ETA" value={`${Math.floor(journey.etaMinutes / 60)}h ${journey.etaMinutes % 60}m`} />
        <MiniStat label="Speed" value={`${journey.speedKmph} km/h`} icon />
        <MiniStat label="Next halt" value={journey.nextHalt.split(" ")[0] ?? journey.nextHalt} />
      </div>

      <div className="mt-4 overflow-x-auto pb-1 scrollbar-none touch-pan-x">
        <div className="flex min-w-max items-start gap-1">
          {journey.stops.map((s, i) => (
            <div key={s.code} className="flex items-start">
              <div className="w-[62px] text-center">
                <span
                  className={cn(
                    "mx-auto block h-2.5 w-2.5 rounded-full",
                    s.done ? "bg-live" : "border border-hairline bg-surface-2",
                  )}
                />
                <p className="num mt-1.5 text-[10px] font-semibold">{s.code}</p>
                <p className="num text-[9px] text-muted-foreground">{s.time}</p>
              </div>
              {i < journey.stops.length - 1 && (
                <span
                  className={cn(
                    "mt-1 h-[2px] w-3 rounded-full",
                    s.done ? "bg-live" : "bg-hairline",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </GlassCard>
  );
}

function MiniStat({ label, value, icon }: { label: string; value: string; icon?: boolean }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface px-2.5 py-2">
      <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="num mt-0.5 inline-flex items-center gap-1 text-[12.5px] font-semibold">
        {icon && <Gauge className="h-3.5 w-3.5 text-cyan" />}
        {value}
      </p>
    </div>
  );
}

function GuardianRing({ value }: { value: number }) {
  const r = 34;
  const circ = 2 * Math.PI * r;
  return (
    <div className="relative grid h-[92px] w-[92px] place-items-center">
      <svg viewBox="0 0 80 80" className="h-[92px] w-[92px] -rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" stroke="var(--surface-2)" strokeWidth="7" />
        <motion.circle
          cx="40"
          cy="40"
          r={r}
          fill="none"
          stroke="var(--live)"
          strokeWidth="7"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          whileInView={{ strokeDashoffset: circ * (1 - value) }}
          viewport={{ once: true }}
          transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
        />
      </svg>
      <span className="num absolute text-[15px] font-semibold">{Math.round(value * 100)}%</span>
    </div>
  );
}
