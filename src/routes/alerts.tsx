import { createFileRoute } from "@tanstack/react-router";
import { Bell, Check, ShieldAlert, Sparkles, Filter } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/netra/AppShell";
import { Chip, GlassCard, LiveDot, SectionTitle } from "@/components/netra/primitives";
import { notifications } from "@/lib/netra/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/alerts")({
  head: () => ({
    meta: [
      { title: "Network Alerts — NETRA-RAIL Mobile" },
      {
        name: "description",
        content: "Real-time alerts, safety advisories and operational updates across the NETRA-RAIL grid.",
      },
    ],
  }),
  component: AlertsPage,
});

export function AlertsPage() {
  const [filter, setFilter] = useState<"all" | "critical" | "operational">("all");
  const [items, setItems] = useState(notifications);

  const filtered = items.filter((n) => filter === "all" || n.tier === filter);

  return (
    <AppShell
      role="passenger"
      title="Alert Center"
      subtitle="Grid advisories & rail telemetry feed"
    >
      <div className="space-y-4">
        {/* Filter bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {(["all", "critical", "operational"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={cn(
                "press min-h-[36px] rounded-xl border px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider transition-colors",
                filter === t
                  ? "border-cyan/60 bg-surface-2 text-cyan font-semibold"
                  : "border-hairline bg-surface text-muted-foreground"
              )}
            >
              {t === "all" ? "All Alerts" : t}
            </button>
          ))}
        </div>

        <SectionTitle
          title="Live Network Bulletins"
          sub="Auto-dispatched by Pillar A-D agents"
          right={<LiveDot label="FEED ACTIVE" tone="live" />}
        />

        <div className="space-y-2.5">
          {filtered.map((n, i) => (
            <GlassCard key={n.id} delay={i * 0.04} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex gap-3">
                  <div
                    className={cn(
                      "mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl border border-hairline",
                      n.tier === "critical"
                        ? "bg-critical/15 text-critical border-critical/30"
                        : "bg-surface text-cyan"
                    )}
                  >
                    {n.tier === "critical" ? (
                      <ShieldAlert className="h-4.5 w-4.5" />
                    ) : (
                      <Bell className="h-4.5 w-4.5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="truncate text-[13.5px] font-semibold">{n.title}</h3>
                      <Chip
                        tone={
                          n.tier === "critical"
                            ? "critical"
                            : n.tier === "operational"
                            ? "warn"
                            : "cyan"
                        }
                      >
                        {n.tier.toUpperCase()}
                      </Chip>
                    </div>
                    <p className="mt-1 text-[12px] leading-relaxed text-muted-foreground">
                      {n.body}
                    </p>
                    <span className="num mt-2 block text-[10px] text-muted-foreground">
                      {n.time} · Netra Safety Protocol
                    </span>
                  </div>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </AppShell>
  );
}
