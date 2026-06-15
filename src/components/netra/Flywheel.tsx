import { motion } from "motion/react";
import { PILLARS } from "@/lib/netra/data";

/**
 * Flywheel Pulse Widget — 4 pillars connected by flowing dashed lines with
 * light packets continuously travelling around the loop.
 */
export function Flywheel({ size = 148 }: { size?: number }) {
  const r = 40;
  const c = 50;
  const nodes = PILLARS.map((p, i) => {
    const a = (-90 + i * 90) * (Math.PI / 180);
    return { ...p, x: c + r * Math.cos(a), y: c + r * Math.sin(a) };
  });

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg viewBox="0 0 100 100" width={size} height={size}>
        <defs>
          <linearGradient id="fw-grad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--primary)" />
            <stop offset="100%" stopColor="var(--cyan)" />
          </linearGradient>
        </defs>
        <circle cx={c} cy={c} r={r} fill="none" stroke="var(--hairline)" strokeWidth="6" />
        <circle
          id="fw-path"
          cx={c}
          cy={c}
          r={r}
          fill="none"
          stroke="url(#fw-grad)"
          strokeWidth="1.6"
          strokeDasharray="6 6"
          className="animate-dash"
        />
        {[0, 1, 2, 3].map((i) => (
          <circle key={i} r="2.4" fill="var(--cyan)">
            <animateMotion
              dur="6s"
              begin={`${i * 1.5}s`}
              repeatCount="indefinite"
              path={`M ${c} ${c - r} A ${r} ${r} 0 1 1 ${c - 0.01} ${c - r} Z`}
            />
          </circle>
        ))}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r="9" fill="var(--background)" stroke="var(--cyan)" strokeWidth="1.2" />
            <text
              x={n.x}
              y={n.y + 3.4}
              textAnchor="middle"
              fontSize="9"
              fontWeight="700"
              fill="var(--cyan)"
            >
              {n.id}
            </text>
          </g>
        ))}
        <text x={c} y={c - 2} textAnchor="middle" fontSize="8" fill="var(--muted-foreground)">
          FLYWHEEL
        </text>
        <text x={c} y={c + 8} textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--foreground)">
          LIVE
        </text>
      </svg>
      <motion.span
        className="absolute inset-0 rounded-full"
        animate={{ boxShadow: ["0 0 0 0 transparent", "0 0 34px -6px var(--primary)", "0 0 0 0 transparent"] }}
        transition={{ duration: 3.4, repeat: Infinity }}
      />
    </div>
  );
}

export function FlywheelCard() {
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-4">
      <div className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3">
        <Flywheel size={124} />
        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold">The NETRA Flywheel</h3>
          <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
            Sensing (A) feeds the Traffic Brain (B), which triggers Track Health (C) and Drone
            Verification (D) — then learns from the outcome. You are part of this loop.
          </p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PILLARS.map((p) => (
              <span
                key={p.id}
                className="rounded-md border border-hairline bg-surface px-1.5 py-0.5 text-[9px] text-muted-foreground"
              >
                {p.id} · {p.role}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
