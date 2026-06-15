import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { ShieldCheck } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/* --------- tricolour hairline (official seal of the app) --------- */
export function TricolourRule({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className={cn("tricolour-rule h-[2px] w-full origin-left opacity-90", className)}
    />
  );
}

/* --------- glass panel --------- */
export function GlassCard({
  children,
  className,
  delay = 0,
  glow,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  glow?: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn("glass rounded-2xl p-4", glow && "glow-ring", className)}
    >
      {children}
    </motion.div>
  );
}

export function SectionTitle({
  title,
  sub,
  right,
}: {
  title: string;
  sub?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
      <div className="min-w-0">
        <h2 className="truncate text-[15px] font-semibold tracking-tight">{title}</h2>
        {sub ? <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{sub}</p> : null}
      </div>
      {right ? <div className="shrink-0">{right}</div> : null}
    </div>
  );
}

/* --------- live badge with breathing dot --------- */
export function LiveDot({ label = "LIVE", tone = "live" }: { label?: string; tone?: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-hairline bg-surface px-2 py-0.5 text-[10px] font-semibold tracking-[0.14em]">
      <span className="relative flex h-1.5 w-1.5">
        <span
          className="absolute inline-flex h-full w-full rounded-full animate-pulse-ring"
          style={{ backgroundColor: `var(--${tone})` }}
        />
        <span
          className="relative inline-flex h-1.5 w-1.5 rounded-full animate-breathe"
          style={{ backgroundColor: `var(--${tone})` }}
        />
      </span>
      <span style={{ color: `var(--${tone})` }}>{label}</span>
    </span>
  );
}

export function VerifiedBadge({ text = "Government Certified Data Source" }: { text?: string }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-hairline px-2 py-0.5 text-[10px] text-muted-foreground">
      <ShieldCheck className="h-3 w-3 text-india-green" />
      {text}
    </span>
  );
}

export function Chip({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: "muted" | "live" | "warn" | "critical" | "cyan" | "saffron" | "india-green" | "primary";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-semibold tracking-wide",
        className,
      )}
      style={
        tone === "muted"
          ? undefined
          : {
              color: `var(--${tone})`,
              borderColor: `color-mix(in oklab, var(--${tone}) 45%, transparent)`,
              backgroundColor: `color-mix(in oklab, var(--${tone}) 12%, transparent)`,
            }
      }
    >
      {children}
    </span>
  );
}

/* --------- animated count-up --------- */
export function CountUp({
  to,
  decimals = 0,
  duration = 1.4,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  decimals?: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-30px" });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { duration: duration * 1000, bounce: 0 });
  const [text, setText] = useState("0");

  useEffect(() => {
    if (inView) mv.set(to);
  }, [inView, to, mv]);

  useEffect(
    () =>
      spring.on("change", (v) =>
        setText(
          v.toLocaleString("en-IN", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          }),
        ),
      ),
    [spring, decimals],
  );

  return (
    <span ref={ref} className={cn("num", className)}>
      {prefix}
      {text}
      {suffix}
    </span>
  );
}

/* --------- stat tile --------- */
export function StatTile({
  label,
  value,
  unit,
  decimals = 0,
  tone = "cyan",
  delay = 0,
}: {
  label: string;
  value: number;
  unit?: string;
  decimals?: number;
  tone?: string;
  delay?: number;
}) {
  return (
    <GlassCard delay={delay} className="p-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </span>
        <span
          className="h-1.5 w-1.5 rounded-full animate-breathe"
          style={{ backgroundColor: `var(--${tone})` }}
        />
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <CountUp
          to={value}
          decimals={decimals}
          className="text-[22px] font-semibold leading-none"
        />
        {unit ? <span className="text-[11px] text-muted-foreground">{unit}</span> : null}
      </div>
    </GlassCard>
  );
}

/* --------- skeleton --------- */
export function Shimmer({ className }: { className?: string }) {
  return <div className={cn("skeleton-shimmer rounded-lg", className)} />;
}

/* --------- press-able button with glow ripple --------- */
export function PressButton({
  children,
  onClick,
  className,
  tone = "primary",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  tone?: "primary" | "ghost" | "critical" | "live";
  type?: "button" | "submit";
}) {
  const tones: Record<string, string> = {
    primary: "bg-live-gradient text-primary-foreground glow-ring",
    ghost: "bg-surface-2 text-foreground border border-hairline",
    critical: "text-critical border",
    live: "text-live border",
  };
  const accented = tone === "critical" || tone === "live";
  const style = accented
    ? {
        borderColor: `color-mix(in oklab, var(--${tone}) 55%, transparent)`,
        backgroundColor: `color-mix(in oklab, var(--${tone}) 14%, transparent)`,
      }
    : {};
  return (
    <motion.button
      type={type}
      onClick={() => onClick?.()}
      whileTap={{ scale: 0.955 }}
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className={cn(
        "relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-xl px-4 py-3 text-sm font-semibold",
        tones[tone],
        className,
      )}
      style={style}
    >
      {children}
    </motion.button>
  );
}


/* --------- NETRA emblem: High-Speed Locomotive Train Animation --------- */
export function Emblem({ size = 96, sweep = true }: { size?: number; sweep?: boolean }) {
  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      {sweep &&
        [0, 1].map((i) => (
          <span
            key={i}
            className="absolute inset-0 rounded-full border animate-pulse-ring"
            style={{
              borderColor: "var(--cyan)",
              animationDelay: `${i * 1.1}s`,
            }}
          />
        ))}
      <svg viewBox="0 0 100 100" width={size} height={size} className="relative">
        {/* Outer Circular Track Ring */}
        <circle cx="50" cy="50" r="47" fill="none" stroke="var(--hairline)" strokeWidth="1" />
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke="var(--cyan)"
          strokeWidth="2.2"
          strokeDasharray="8 6"
          className={sweep ? "animate-radar origin-center" : ""}
          style={{ transformOrigin: "50% 50%", animationDuration: "10s" }}
        />

        {/* Inner Solid Circle Base */}
        <circle cx="50" cy="50" r="38" fill="#0b1329" stroke="var(--hairline)" strokeWidth="1.5" />

        {/* High-Speed Locomotive Front Nose */}
        <g transform="translate(25, 24) scale(0.52)">
          {/* Animated Track Line beneath train */}
          <line
            x1="8"
            y1="82"
            x2="92"
            y2="82"
            stroke="var(--cyan)"
            strokeWidth="3.5"
            strokeDasharray="8 5"
            className="animate-dash"
          />

          {/* Aerodynamic Train Body */}
          <path
            d="M 20 72 L 20 38 Q 20 16 50 16 Q 80 16 80 38 L 80 72 Z"
            fill="oklch(0.34 0.08 250)"
            stroke="var(--cyan)"
            strokeWidth="2.5"
          />

          {/* Driver Windshield */}
          <path
            d="M 28 40 Q 50 25 72 40 L 69 48 Q 50 38 31 48 Z"
            fill="var(--cyan)"
          />

          {/* Tri-Colour Stripes on Nose */}
          <rect x="23" y="54" width="54" height="2.5" fill="var(--saffron)" />
          <rect x="23" y="57" width="54" height="2.5" fill="#ffffff" />
          <rect x="23" y="60" width="54" height="2.5" fill="var(--emerald)" />

          {/* Train Headlights */}
          <circle cx="33" cy="67" r="3.5" fill="#fef08a" className="animate-pulse" />
          <circle cx="67" cy="67" r="3.5" fill="#fef08a" className="animate-pulse" />

          {/* Center Emblem Dot */}
          <circle cx="50" cy="67" r="2.5" fill="var(--cyan)" />
        </g>
      </svg>
    </div>
  );
}

/* --------- scan-line "system reconfiguring" overlay --------- */
export function ScanWipe() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
      <div className="absolute inset-x-0 h-1 bg-cyan opacity-80 shadow-[0_0_8px_var(--cyan)] animate-scanline" />
    </div>
  );
}

export function formatCountdown(totalSeconds: number) {
  const m = Math.floor(Math.max(totalSeconds, 0) / 60);
  const s = Math.max(totalSeconds, 0) % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export function useCountdown(initial: number) {
  const [left, setLeft] = useState(initial);
  useEffect(() => {
    const t = setInterval(() => setLeft((v) => (v > 0 ? v - 1 : 0)), 1000);
    return () => clearInterval(t);
  }, []);
  return left;
}
