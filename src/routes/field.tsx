import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Clock,
  HardHat,
  MapPin,
  Navigation,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/netra/AppShell";
import {
  Chip,
  GlassCard,
  LiveDot,
  PressButton,
  ScanWipe,
  SectionTitle,
  VerifiedBadge,
} from "@/components/netra/primitives";
import { workOrders } from "@/lib/netra/data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/field")({
  head: () => ({
    meta: [
      { title: "Trackman Field Console — NETRA-RAIL Mobile" },
      {
        name: "description",
        content: "Verified work orders and GPS-triggered defect verification for track maintenance crews.",
      },
    ],
  }),
  component: FieldPage,
});

function FieldPage() {
  const [orders, setOrders] = useState(workOrders);

  const toggleStatus = (id: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id
          ? {
              ...o,
              status: o.status === "open" ? "resolved" : "open",
            }
          : o
      )
    );
  };

  return (
    <AppShell
      role="trackman"
      title="Field Work Orders"
      subtitle="Section 42 · Vadodara North Division"
      boot
    >
      <div className="space-y-4">
        {/* GPS Location & Safety Lock */}
        <GlassCard glow className="relative overflow-hidden p-4">
          <ScanWipe />
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="flex items-center gap-2">
                <HardHat className="h-4 w-4 text-cyan" />
                <span className="num text-[12px] font-semibold">GANG 14 · SENIOR SECTION ENGINEER</span>
              </div>
              <h2 className="mt-1 text-[16px] font-semibold">Active Field Patrol</h2>
              <p className="mt-0.5 inline-flex items-center gap-1 text-[11px] text-muted-foreground">
                <MapPin className="h-3 w-3 text-cyan" /> Km 428.320 · Track 2 (Up Line)
              </p>
            </div>
            <LiveDot label="GPS SYNCED" tone="live" />
          </div>

          <div className="mt-3.5 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-hairline bg-surface px-3 py-2">
              <p className="text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground">
                Assigned SLA
              </p>
              <p className="num text-[15px] font-semibold text-warn">46 min remaining</p>
            </div>
            <div className="rounded-xl border border-hairline bg-surface px-3 py-2">
              <p className="text-[9.5px] uppercase tracking-[0.12em] text-muted-foreground">
                Protection Block
              </p>
              <p className="num text-[15px] font-semibold text-live">Active (90 km/h)</p>
            </div>
          </div>
        </GlassCard>

        {/* Work Orders List */}
        <section>
          <SectionTitle
            title="Assigned Defect Orders"
            sub="Pillar C & D verified locations"
            right={<VerifiedBadge text="IRPWM Compliant" />}
          />

          <div className="space-y-3">
            {orders.map((wo, i) => (
              <GlassCard key={wo.id} delay={i * 0.05} className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <span className="num text-[11px] font-mono text-muted-foreground">{wo.id}</span>
                    <h3 className="truncate text-[14px] font-semibold">{wo.defect}</h3>
                    <p className="text-[11px] text-muted-foreground">{wo.section}</p>
                  </div>
                  <Chip
                    tone={
                      wo.status === "resolved"
                        ? "live"
                        : wo.grade === "Class 1"
                        ? "critical"
                        : wo.grade === "Class 2"
                        ? "warn"
                        : "cyan"
                    }
                  >
                    {wo.status === "resolved" ? "RESOLVED" : wo.grade.toUpperCase()}
                  </Chip>
                </div>

                <div className="mt-3 rounded-xl border border-hairline bg-surface p-3 text-[11.5px] leading-relaxed text-muted-foreground">
                  <p>
                    <span className="font-semibold text-foreground">Location: </span>
                    {wo.km} ({wo.coords})
                  </p>
                  <p className="mt-1">
                    <span className="font-semibold text-foreground">Audit Note: </span>
                    {wo.note}
                  </p>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <PressButton
                    tone={wo.status === "resolved" ? "ghost" : "primary"}
                    onClick={() => toggleStatus(wo.id)}
                    className="py-2.5 text-[12px]"
                  >
                    {wo.status === "resolved" ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-live" /> Verified Clear
                      </>
                    ) : (
                      <>
                        <Wrench className="h-4 w-4" /> Mark Actioned
                      </>
                    )}
                  </PressButton>

                  <PressButton tone="ghost" className="py-2.5 text-[12px]">
                    <Camera className="h-4 w-4 text-cyan" /> Upload Photo
                  </PressButton>
                </div>
              </GlassCard>
            ))}
          </div>
        </section>

        <p className="pb-2 text-center text-[10px] text-muted-foreground">
          Indian Railways Permanent Way Manual (IRPWM) · Safety First
        </p>
      </div>
    </AppShell>
  );
}
