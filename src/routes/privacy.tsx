import { createFileRoute } from "@tanstack/react-router";
import { Lock, ShieldCheck, EyeOff, Radio, Smartphone, Database } from "lucide-react";
import { useState } from "react";
import { AppShell } from "@/components/netra/AppShell";
import { Chip, GlassCard, SectionTitle, PressButton } from "@/components/netra/primitives";
import { useSession } from "@/lib/netra/session";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy & Data Protection — NETRA-RAIL Mobile" },
      {
        name: "description",
        content: "Data protection standards, Pillar A sensing preferences and telemetry privacy controls.",
      },
    ],
  }),
  component: PrivacyPage,
});

export function PrivacyPage() {
  const { session } = useSession();
  const [telemetry, setTelemetry] = useState(true);
  const [anonymize, setAnonymize] = useState(true);
  const [locationPillar, setLocationPillar] = useState(true);

  return (
    <AppShell
      role={session?.role ?? "passenger"}
      title="Privacy & Security"
      subtitle="DPDP Act 2023 & Government Data Security"
    >
      <div className="space-y-4">
        <GlassCard glow className="p-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-india-green" />
            <div>
              <h2 className="text-[14.5px] font-semibold">Zero Personal Tracking</h2>
              <p className="text-[11px] text-muted-foreground">
                Your journey safety contribution is 100% anonymized.
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between gap-3 border-t border-hairline pt-3">
              <div>
                <p className="text-[13px] font-medium">Pillar A Vibration Sensing</p>
                <p className="text-[10.5px] text-muted-foreground">
                  Uses accelerometer to flag track roughness for Pillar C.
                </p>
              </div>
              <button
                onClick={() => setTelemetry((v) => !v)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  telemetry ? "bg-live" : "bg-surface-2"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                    telemetry ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-hairline pt-3">
              <div>
                <p className="text-[13px] font-medium">Differential Privacy Noise</p>
                <p className="text-[10.5px] text-muted-foreground">
                  Injects cryptographic noise to prevent reverse-location tracking.
                </p>
              </div>
              <button
                onClick={() => setAnonymize((v) => !v)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  anonymize ? "bg-live" : "bg-surface-2"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                    anonymize ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-hairline pt-3">
              <div>
                <p className="text-[13px] font-medium">Corridor Weather Telemetry</p>
                <p className="text-[10.5px] text-muted-foreground">
                  Shares localized barometric & rain indicators with dispatch.
                </p>
              </div>
              <button
                onClick={() => setLocationPillar((v) => !v)}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
                  locationPillar ? "bg-live" : "bg-surface-2"
                }`}
              >
                <span
                  className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${
                    locationPillar ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Data Rights */}
        <GlassCard className="p-4">
          <SectionTitle
            title="Digital Personal Data Protection"
            sub="DPDP Act 2023 Compliance Guarantee"
          />
          <div className="space-y-2 text-[11.5px] leading-relaxed text-muted-foreground">
            <p>
              • Sensor telemetry is processed locally on device (Edge AI) before transmitting compressed spatial gradients.
            </p>
            <p>
              • No audio, camera, or personal contact data is ever accessed by NETRA-RAIL sensing loops.
            </p>
            <p>
              • All stored audit logs are encrypted using ISO/IEC 27001 certified Railway Data Vaults.
            </p>
          </div>
        </GlassCard>
      </div>
    </AppShell>
  );
}
