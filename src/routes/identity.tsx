import { createFileRoute } from "@tanstack/react-router";
import { QrCode, ShieldCheck, UserCheck, Award, Lock, Sparkles } from "lucide-react";
import { AppShell } from "@/components/netra/AppShell";
import { Chip, Emblem, GlassCard, SectionTitle, TricolourRule } from "@/components/netra/primitives";
import { useSession } from "@/lib/netra/session";
import { guardian } from "@/lib/netra/data";

export const Route = createFileRoute("/identity")({
  head: () => ({
    meta: [
      { title: "Digital Rail Identity — NETRA-RAIL Mobile" },
      {
        name: "description",
        content: "Verified Rail Identity Card, credentials and Track Guardian status.",
      },
    ],
  }),
  component: IdentityPage,
});

export function IdentityPage() {
  const { session } = useSession();

  return (
    <AppShell
      role={session?.role ?? "passenger"}
      title="Digital Rail Identity"
      subtitle="Government of India Verified Credentials"
    >
      <div className="space-y-4">
        {/* Digital ID Card */}
        <GlassCard glow className="relative overflow-hidden p-5">
          <div className="flex items-center justify-between border-b border-hairline pb-3">
            <div className="flex items-center gap-2">
              <Emblem size={32} />
              <div>
                <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">
                  Ministry of Railways · India
                </p>
                <p className="text-[12px] font-semibold">NETRA-RAIL Credential</p>
              </div>
            </div>
            <Chip tone="live">VERIFIED</Chip>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl border border-hairline bg-surface-2">
              <UserCheck className="h-8 w-8 text-cyan" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-[17px] font-semibold tracking-tight">
                {session?.name ?? "Passenger Authorized"}
              </h2>
              <p className="text-[11px] text-muted-foreground">{session?.designation ?? "Rail Guardian"}</p>
              <p className="num mt-1 text-[10.5px] text-cyan">{session?.employeeId ?? "NR-88219-IND"}</p>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-hairline bg-surface p-2.5">
              <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Clearance</p>
              <p className="text-[12px] font-semibold text-india-green">Level 3 · Safe Grid</p>
            </div>
            <div className="rounded-xl border border-hairline bg-surface p-2.5">
              <p className="text-[9px] uppercase tracking-[0.12em] text-muted-foreground">Guardian Status</p>
              <p className="text-[12px] font-semibold text-cyan">{guardian.level}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-center rounded-xl border border-hairline bg-surface p-4">
            <div className="flex flex-col items-center gap-2 text-center">
              <QrCode className="h-28 w-28 text-foreground" />
              <p className="num text-[10px] text-muted-foreground">
                Cryptographically Signed · Hash #7F90-A8C2
              </p>
            </div>
          </div>
        </GlassCard>

        {/* Security & Verification status */}
        <GlassCard className="p-4">
          <SectionTitle
            title="Credential Verification"
            sub="Protected by DigiLocker / Railways Auth"
          />
          <div className="space-y-2.5 text-[11.5px] leading-relaxed text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-india-green shrink-0" />
              <span>Biometric SSO linked to Railway Personnel Portal</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-cyan shrink-0" />
              <span>End-to-end telemetry encryption for sensor reports</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-saffron shrink-0" />
              <span>National Rail Intelligence Network badge active</span>
            </div>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}
