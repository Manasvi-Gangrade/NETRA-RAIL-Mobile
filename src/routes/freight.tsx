import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Anchor, IndianRupee, Search, Ship, Sparkles, Train } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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
  SectionTitle,
  StatTile,
  VerifiedBadge,
} from "@/components/netra/primitives";
import {
  corridorThroughput,
  dispatchQueue,
  freightStats,
  ports,
  queryPlaceholders,
  vesselFeed,
} from "@/lib/netra/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/freight")({
  head: () => ({
    meta: [
      { title: "Freight Control — NETRA-RAIL Mobile" },
      {
        name: "description",
        content:
          "Live port-to-plant freight intelligence: vessel discharge feed, AI dispatch windows, demurrage risk and corridor throughput on the NETRA-RAIL grid.",
      },
      { property: "og:title", content: "Freight Control — NETRA-RAIL Mobile" },
      {
        property: "og:description",
        content:
          "Vessel feed, AI-allotted rake windows and corridor throughput for freight and logistics coordinators.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: FreightPage,
});

function FreightPage() {
  return (
    <AppShell
      role="freight"
      title="Freight & Logistics Control"
      subtitle="Port-to-plant corridor intelligence"
      boot
    >
      <div className="space-y-6">
        <PortStrip />
        <div className="grid grid-cols-2 gap-2">
          {freightStats.map((s, i) => (
            <StatTile
              key={s.label}
              label={s.label}
              value={s.value}
              unit={s.unit}
              decimals={s.label.includes("Demurrage") ? 1 : 0}
              tone={s.tone === "primary" ? "primary" : s.tone}
              delay={i * 0.06}
            />
          ))}
        </div>
        <AskNetra />
        <VesselFeed />
        <DispatchQueue />
        <ThroughputChart />

        <GlassCard className="flex items-center justify-between p-3.5">
          <div>
            <h3 className="text-[12.5px] font-bold text-foreground">Shift Handover Audit</h3>
            <p className="text-[10.5px] text-muted-foreground">Export shift log with all AI overrides & vessel discharge state</p>
          </div>
          <PressButton 
            tone="ghost" 
            className="text-[11.5px] py-2 px-3 shrink-0"
            onClick={() => alert("Shift Handover Report generated & saved as PDF/JSON audit log.")}
          >
            Export Report
          </PressButton>
        </GlassCard>

        <p className="pb-2 text-center text-[10px] text-muted-foreground">
          Dedicated Freight Corridor Corporation of India · data mirrored from NETRA-RAIL core
        </p>
      </div>
    </AppShell>
  );
}

function PortStrip() {
  const [active, setActive] = useState(ports[0]);
  return (
    <div className="-mx-4 overflow-x-auto px-4 scrollbar-none touch-pan-x">
      <div className="flex min-w-max items-center gap-2 pb-0.5">
        {ports.map((p) => (
          <button
            key={p}
            onClick={() => setActive(p)}
            className={cn(
              "press inline-flex min-h-[36px] items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-[11px] font-semibold transition-colors",
              active === p
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-hairline bg-surface text-muted-foreground",
            )}
          >
            <Anchor className="h-3.5 w-3.5" />
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}

function AskNetra() {
  const [i, setI] = useState(0);
  const [q, setQ] = useState("");
  const [answered, setAnswered] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % queryPlaceholders.length), 2600);
    return () => clearInterval(t);
  }, []);

  return (
    <GlassCard className="p-4">
      <SectionTitle
        title="Ask NETRA"
        sub="Natural-language corridor queries · 230+ languages"
        right={<LiveDot label="AGENT" tone="primary" />}
      />
      <div className="flex items-center gap-2 rounded-xl border border-hairline bg-surface px-3 py-2.5">
        <Search className="h-4 w-4 shrink-0 text-primary" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={queryPlaceholders[i]}
          className="min-w-0 flex-1 bg-transparent text-[12.5px] outline-none placeholder:text-muted-foreground"
        />
        <PressButton className="px-3 py-1.5 text-[11px]" onClick={() => setAnswered(true)}>
          Ask
        </PressButton>
      </div>
      {answered && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 rounded-xl border border-hairline bg-surface p-3"
        >
          <p className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.14em] text-primary">
            <Sparkles className="h-3 w-3" /> Reasoned answer
          </p>
          <p className="mt-1.5 text-[12.5px] leading-relaxed">
            Mundra–Vadodara ICD currently carries a 25 min planned hold on rake FR-4482 to avoid the
            Km 428 slow zone. Net demurrage exposure drops from ₹8.1L to ₹1.7L. Earliest alternate
            path is 23:05, already allotted.
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Chip tone="primary">Confidence 0.93</Chip>
            <Chip tone="live">Saving ₹6.4L</Chip>
            <Chip>Pillar B · Traffic Brain</Chip>
          </div>
        </motion.div>
      )}
    </GlassCard>
  );
}

function VesselFeed() {
  return (
    <section>
      <SectionTitle
        title="Vessel discharge feed"
        sub="Berth-side status synced every 40 s"
        right={<LiveDot />}
      />
      <div className="space-y-2">
        {vesselFeed.map((v, i) => (
          <GlassCard key={v.id} delay={i * 0.05} className="p-3.5">
            <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-3">
              <span className="mt-0.5 grid h-9 w-9 place-items-center rounded-xl border border-hairline bg-surface">
                <Ship className="h-4 w-4 text-primary" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold">{v.name}</p>
                <p className="truncate text-[11px] text-muted-foreground">{v.cargo}</p>
                <p className="mt-0.5 truncate text-[10.5px] text-muted-foreground">{v.berth}</p>
              </div>
              <Chip tone={v.state === "done" ? "live" : v.state === "active" ? "primary" : "muted"}>
                {v.etaLabel}
              </Chip>
            </div>
            <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-surface-2">
              <motion.div
                className="h-full rounded-full bg-live-gradient"
                initial={{ width: 0 }}
                whileInView={{ width: `${v.progress * 100}%` }}
                viewport={{ once: true }}
                transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function DispatchQueue() {
  const [accepted, setAccepted] = useState<string[]>([]);
  return (
    <section>
      <SectionTitle
        title="AI dispatch queue"
        sub="Rake windows allotted by Pillar B"
        right={<VerifiedBadge text="Explainable" />}
      />
      <div className="space-y-2">
        {dispatchQueue.map((d, i) => (
          <GlassCard key={d.id} delay={i * 0.05} className="p-3.5">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="num text-[11px] text-muted-foreground">{d.id}</p>
                <p className="truncate text-[13px] font-semibold">{d.corridor}</p>
                <p className="truncate text-[11px] text-muted-foreground">{d.rake}</p>
              </div>
              <Chip tone={d.risk === "low" ? "live" : d.risk === "medium" ? "warn" : "critical"}>
                {d.risk.toUpperCase()} RISK
              </Chip>
            </div>
            <div className="mt-2.5 grid grid-cols-2 gap-2">
              <div className="rounded-xl border border-hairline bg-surface px-3 py-2">
                <p className="text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground">
                  Path window
                </p>
                <p className="num text-[13px] font-semibold">{d.window}</p>
              </div>
              <div className="rounded-xl border border-hairline bg-surface px-3 py-2">
                <p className="text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground">
                  Demurrage saved
                </p>
                <p className="num inline-flex items-baseline text-[13px] font-semibold text-live">
                  <IndianRupee className="h-3 w-3" />
                  <CountUp to={d.saving} decimals={1} suffix="L" />
                </p>
              </div>
            </div>
            <p className="mt-2.5 text-[11.5px] leading-relaxed text-muted-foreground">
              <span className="font-semibold text-foreground">Why: </span>
              {d.aiNote}
            </p>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <PressButton
                tone={accepted.includes(d.id) ? "live" : "primary"}
                onClick={() => setAccepted((a) => (a.includes(d.id) ? a : [...a, d.id]))}
                className="py-2.5 text-[12px]"
              >
                <Train className="h-3.5 w-3.5" />
                {accepted.includes(d.id) ? "Slot confirmed" : "Accept slot"}
              </PressButton>
              <PressButton tone="ghost" className="py-2.5 text-[12px]">
                Request re-plan
              </PressButton>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function ThroughputChart() {
  return (
    <GlassCard className="p-4">
      <SectionTitle title="Corridor throughput" sub="Rakes cleared per 4-hour block · today" />
      <div className="h-[196px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={corridorThroughput} margin={{ top: 4, right: 4, left: -22, bottom: 0 }}>
            <CartesianGrid stroke="var(--hairline)" vertical={false} />
            <XAxis
              dataKey="t"
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
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
            <Legend wrapperStyle={{ fontSize: 10 }} />
            <Bar dataKey="planned" name="Planned" fill="var(--chart-2)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="actual" name="Actual" fill="var(--chart-1)" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}
