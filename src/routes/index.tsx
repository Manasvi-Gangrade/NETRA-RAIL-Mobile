import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, ChevronLeft, Fingerprint, IdCard, ShieldCheck, Train } from "lucide-react";
import { useState } from "react";
import { ROLES, networkStats, type Role } from "@/lib/netra/data";
import { DEFAULT_IDENTITY, writeSession } from "@/lib/netra/session";
import { FlywheelCard } from "@/components/netra/Flywheel";
import {
  Chip,
  Emblem,
  GlassCard,
  LiveDot,
  PressButton,
  SectionTitle,
  StatTile,
  TricolourRule,
  VerifiedBadge,
} from "@/components/netra/primitives";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NETRA-RAIL Mobile — National Rail Intelligence Network" },
      {
        name: "description",
        content:
          "Official companion app for NETRA-RAIL, India's autonomous multi-agent railway intelligence platform. Four role logins: Passenger, Freight, Traffic Control, Trackman.",
      },
      { property: "og:title", content: "NETRA-RAIL Mobile — National Rail Intelligence Network" },
      {
        property: "og:description",
        content:
          "Live journeys, explainable delays, freight corridors, precedence decisions and field work orders — one intelligent rail grid.",
      },
    ],
  }),
  component: Landing,
});

const ROLE_ORDER: Role[] = ["passenger", "freight", "controller", "trackman"];

function Landing() {
  const [selected, setSelected] = useState<Role | null>(null);

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[520px] px-3.5 sm:px-4 pb-16 pt-[max(1.5rem,env(safe-area-inset-top,0px))]">
      {/* Header section with Emblem & Title */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center"
      >
        <Emblem size={104} />
        <p className="mt-4 text-[10px] uppercase tracking-[0.24em] text-muted-foreground font-semibold">
          Ministry of Railways · Government of India
        </p>
        <h1 className="mt-1 text-[26px] font-bold leading-tight tracking-tight">
          NETRA-RAIL <span className="text-gradient-live">Mobile</span>
        </h1>
        <p className="num mt-1 text-[10.5px] tracking-[0.12em] text-muted-foreground font-semibold">
          National Enterprise Traffic, Routing &amp; Autonomous Rail-Grid
        </p>
        <TricolourRule className="mt-4 w-24 rounded-full" />
        <p className="mt-4 max-w-[42ch] text-[12.5px] leading-relaxed text-muted-foreground font-medium">
          One autonomous multi-agent grid watching 68,000 km of track — sensing anomalies,
          re-routing trains and explaining every decision in your language.
        </p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
          <LiveDot label="GRID LIVE" />
          <VerifiedBadge />
        </div>
      </motion.div>

      {/* 1. LOGIN OPTIONS MOVED UP RIGHT AFTER HEADER */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.12 }}
        className="mt-6"
      >
        <SectionTitle title="Choose your role" sub="The app adapts entirely to who you are" />
        <div className="grid gap-2.5">
          {ROLE_ORDER.map((r, i) => (
            <RoleCard key={r} role={r} delay={i * 0.05} onSelect={() => setSelected(r)} />
          ))}
        </div>
      </motion.div>

      {/* 2. SYSTEM METRICS & STATS (Moved Below Login) */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="mt-7"
      >
        <SectionTitle title="Live Grid Metrics" sub="Real-time synchronized telemetry across India" />
        <div className="grid grid-cols-2 gap-2.5">
          {networkStats.map((s, i) => (
            <StatTile key={s.label} label={s.label} value={s.value} unit={s.unit} delay={i * 0.05} />
          ))}
        </div>
      </motion.div>

      {/* 3. HOW THE GRID THINKS (Flywheel Card) */}
      <motion.div 
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.35 }}
        className="mt-7"
      >
        <SectionTitle title="How the grid thinks" sub="Four pillars, one continuous learning loop" />
        <FlywheelCard />
      </motion.div>

      <AnimatePresence>
        {selected && <AuthSheet role={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}

function RoleCard({
  role,
  delay,
  onSelect,
}: {
  role: Role;
  delay: number;
  onSelect: () => void;
}) {
  const meta = ROLES[role];
  return (
    <GlassCard delay={delay} className="p-0 overflow-hidden hover:border-cyan/50 transition-all duration-300">
      <button
        onClick={onSelect}
        className="press grid min-h-[56px] w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 p-3.5 text-left group"
      >
        <span className="grid h-11 w-11 place-items-center rounded-xl border border-hairline bg-surface-2 group-hover:bg-cyan/15 group-hover:border-cyan/40 transition-colors">
          {meta.authKind === "otp" ? (
            <Train className="h-5 w-5 text-cyan animate-pulse" />
          ) : (
            <IdCard className="h-5 w-5 text-cyan" />
          )}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-[14px] font-bold text-foreground group-hover:text-cyan transition-colors">
            {meta.label}
          </span>
          <span className="mt-0.5 block truncate text-[11px] text-muted-foreground font-medium">
            {meta.tagline}
          </span>
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          <Chip tone={meta.authKind === "otp" ? "live" : "cyan"}>
            {meta.authKind === "otp" ? "OTP" : "SSO"}
          </Chip>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-cyan group-hover:translate-x-1 transition-all" />
        </div>
      </button>
    </GlassCard>
  );
}

function AuthSheet({ role, onClose }: { role: Role; onClose: () => void }) {
  const meta = ROLES[role];
  const navigate = useNavigate();
  const [step, setStep] = useState<"input" | "otp">("input");
  const [value, setValue] = useState("");
  const [pin, setPin] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const signIn = () => {
    setBusy(true);
    setTimeout(() => {
      writeSession({ role, ...DEFAULT_IDENTITY[role], lang: "en" });
      navigate({ to: meta.home });
    }, 700);
  };

  const submit = () => {
    setError("");
    if (meta.authKind === "otp") {
      if (step === "input") {
        if (value.replace(/\D/g, "").length < 10) {
          setError("Enter a valid 10-digit mobile number");
          return;
        }
        setStep("otp");
        return;
      }
      if (otp.replace(/\D/g, "").length !== 6) {
        setError("Enter the 6-digit OTP (any digits work in this demo)");
        return;
      }
      signIn();
      return;
    }
    if (value.trim().length < 4 || pin.replace(/\D/g, "").length < 4) {
      setError("Employee ID and 4-digit PIN required");
      return;
    }
    signIn();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-end bg-background/80 backdrop-blur-md"
    >
      <motion.div
        initial={{ y: 340 }}
        animate={{ y: 0 }}
        exit={{ y: 340 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        onClick={(e) => e.stopPropagation()}
        className="glass mx-auto max-h-[88vh] overflow-y-auto w-full max-w-[520px] rounded-t-3xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))]"
      >
        <TricolourRule className="mb-4 w-16 rounded-full" />
        <div className="flex items-center gap-2">
          {step === "otp" && (
            <button onClick={() => setStep("input")} aria-label="Back" className="press">
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            </button>
          )}
          <h2 className="text-[15px] font-bold text-foreground">{meta.label}</h2>
          <Chip tone="cyan">{meta.authKind === "otp" ? "OTP LOGIN" : "EMPLOYEE SSO"}</Chip>
        </div>
        <p className="mt-1 text-[11px] text-muted-foreground font-medium">{meta.tagline}</p>

        <div className="mt-4 grid gap-2.5">
          {meta.authKind === "otp" ? (
            step === "input" ? (
              <Field
                label="Mobile number"
                placeholder="98XXXXXXXX"
                value={value}
                onChange={setValue}
                mode="numeric"
              />
            ) : (
              <Field
                label={`6-digit OTP sent to ${value.slice(-4).padStart(10, "•")}`}
                placeholder="••••••"
                value={otp}
                onChange={setOtp}
                mode="numeric"
              />
            )
          ) : (
            <>
              <Field
                label="Employee ID"
                placeholder="e.g. TC-10287"
                value={value}
                onChange={setValue}
              />
              <Field
                label="Secure PIN"
                placeholder="••••"
                value={pin}
                onChange={setPin}
                mode="numeric"
                secret
              />
            </>
          )}
        </div>

        {error ? (
          <motion.p
            initial={{ x: -6 }}
            animate={{ x: 0 }}
            className="mt-2 text-[11px] font-semibold text-critical"
          >
            {error}
          </motion.p>
        ) : null}

        <PressButton onClick={submit} className="mt-4 w-full">
          {busy ? (
            "Establishing secure channel…"
          ) : (
            <>
              <Fingerprint className="h-4 w-4" />
              {meta.authKind === "otp" && step === "input" ? "Send OTP" : "Authenticate"}
            </>
          )}
        </PressButton>

        <p className="mt-3 flex items-center justify-center gap-1 text-[10px] text-muted-foreground font-medium">
          <ShieldCheck className="h-3 w-3 text-india-green" /> Authenticated via Indian Railways SSO Network
        </p>
      </motion.div>
    </motion.div>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  mode,
  secret,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  mode?: "numeric";
  secret?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground font-semibold">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={mode}
        type={secret ? "password" : "text"}
        className="num mt-1 w-full rounded-xl border border-hairline bg-surface px-3 py-3 text-[14px] font-semibold outline-none placeholder:text-muted-foreground focus:border-cyan/60"
      />
    </label>
  );
}
