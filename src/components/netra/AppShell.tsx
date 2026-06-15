import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Bell, Globe, Home, IdCard, LogOut, ShieldCheck, Lock, Train } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { LANGUAGES, ROLES, notifications, type Role } from "@/lib/netra/data";
import { clearSession, useSession, writeSession } from "@/lib/netra/session";
import { Emblem, ScanWipe, TricolourRule } from "@/components/netra/primitives";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/alerts", label: "Alerts", icon: Bell },
  { to: "/identity", label: "Identity", icon: IdCard },
  { to: "/privacy", label: "Privacy", icon: Lock },
];

export function AppShell({
  role,
  title,
  subtitle,
  children,
  boot = false,
}: {
  role: Role;
  title: string;
  subtitle?: string;
  children: ReactNode;
  boot?: boolean;
}) {
  const { session, ready } = useSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [langOpen, setLangOpen] = useState(false);
  const [lang, setLang] = useState("en");
  const [configuring, setConfiguring] = useState(boot);

  useEffect(() => {
    if (ready && !session) navigate({ to: "/" });
    if (session) setLang(session.lang ?? "en");
  }, [ready, session, navigate]);

  useEffect(() => {
    if (!boot) return;
    const t = setTimeout(() => setConfiguring(false), 1600);
    return () => clearTimeout(t);
  }, [boot]);

  const home = ROLES[role].home;
  const critical = notifications.filter((n) => n.tier === "critical").length;

  return (
    <div className="relative mx-auto min-h-screen w-full max-w-[520px] pb-[calc(5.5rem+env(safe-area-inset-bottom,0px))]">
      <header className="sticky top-0 z-30 backdrop-blur-xl">
        <div className="border-b border-hairline bg-background/85 px-4 pb-2.5 pt-[max(0.75rem,env(safe-area-inset-top,0px))]">
          <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5">
            <Link to={home} className="press shrink-0 flex items-center justify-center p-1 -m-1">
              <Emblem size={34} />
            </Link>
            <div className="min-w-0">
              <p className="truncate text-[9px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                NETRA-RAIL · National Rail Grid
              </p>
              <h1 className="truncate text-[15px] font-semibold leading-tight">{title}</h1>
              {subtitle ? (
                <p className="truncate text-[10px] text-muted-foreground">{subtitle}</p>
              ) : null}
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              <button
                onClick={() => setLangOpen(true)}
                aria-label="Change language"
                className="press grid h-10 w-10 place-items-center rounded-xl border border-hairline bg-surface"
              >
                <Globe className="h-4.5 w-4.5 text-cyan" />
              </button>
              <Link
                to="/alerts"
                aria-label="Notifications"
                className="press relative grid h-10 w-10 place-items-center rounded-xl border border-hairline bg-surface"
              >
                <Bell className="h-4.5 w-4.5" />
                {critical > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-critical text-[9px] font-bold text-foreground">
                    {critical}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
        <TricolourRule />
      </header>

      <AnimatePresence>
        {configuring && (
          <motion.div
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0b1329]/95 backdrop-blur-xl p-6"
          >
            <ScanWipe />
            <div className="flex flex-col items-center gap-5 px-6 text-center max-w-sm">
              {/* Animated Moving Train Emblem Showcase */}
              <div className="relative flex items-center justify-center w-28 h-28 rounded-full border border-cyan/30 bg-surface/60 p-2 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
                <Emblem size={96} sweep={true} />
              </div>

              <div>
                <h2 className="text-[17px] font-bold tracking-tight text-foreground">
                  NETRA-RAIL <span className="text-gradient-live">Grid Sync</span>
                </h2>
                <p className="mt-1 num text-[11.5px] text-cyan font-bold">
                  Loading {ROLES[role].label} Module
                </p>
              </div>

              {/* Dynamic High-Speed Bullet Train Track Animation */}
              <div className="relative w-full h-12 overflow-hidden rounded-xl border border-hairline bg-surface/80 p-2 flex items-center justify-center">
                <div className="absolute inset-x-0 bottom-2.5 h-[2px] bg-cyan/30" />
                <motion.div
                  className="absolute bottom-2.5 h-[2px] w-16 bg-cyan shadow-[0_0_12px_var(--cyan)]"
                  animate={{ x: ["-100%", "280%"] }}
                  transition={{ repeat: Infinity, duration: 1.1, ease: "linear" }}
                />
                <motion.div
                  animate={{ x: ["-100%", "150%"] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  className="relative z-10 flex items-center gap-1.5 bg-primary/25 px-3 py-1 rounded-full border border-cyan/50 text-cyan text-[11px] font-bold shadow-md"
                >
                  <Train className="h-4 w-4 text-cyan animate-pulse" />
                  <span className="tracking-wide">TELEMETRY SYNC</span>
                </motion.div>
              </div>

              {/* Progress Bar */}
              <div className="w-full space-y-1.5">
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-2 border border-hairline">
                  <motion.div
                    className="h-full rounded-full bg-live-gradient"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                </div>
                <div className="flex justify-between text-[10px] text-muted-foreground font-mono font-semibold">
                  <span>Sensing Grid</span>
                  <span className="text-cyan">100% Ready</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="px-3.5 sm:px-4 pt-3.5"
      >
        {children}
      </motion.main>

      <nav className="fixed bottom-0 left-1/2 z-30 w-full max-w-[520px] -translate-x-1/2 border-t border-hairline bg-background/90 px-2 py-1.5 pb-[max(0.5rem,env(safe-area-inset-bottom,0px))] backdrop-blur-xl">
        <div className="grid grid-cols-4 gap-1">
          <NavItem to={home} label="Home" icon={Home} active={pathname === home} />
          {NAV.map((n) => (
            <NavItem
              key={n.to}
              to={n.to}
              label={n.label}
              icon={n.icon}
              active={pathname === n.to}
            />
          ))}
        </div>
      </nav>

      <AnimatePresence>
        {langOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLangOpen(false)}
            className="fixed inset-0 z-50 flex items-end bg-background/70 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 260 }}
              animate={{ y: 0 }}
              exit={{ y: 260 }}
              transition={{ type: "spring", stiffness: 320, damping: 32 }}
              onClick={(e) => e.stopPropagation()}
              className="glass mx-auto max-h-[85vh] overflow-y-auto w-full max-w-[520px] rounded-t-3xl p-5 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))]"
            >
              <TricolourRule className="mb-4 w-16 rounded-full" />
              <h3 className="text-sm font-semibold">Language & Voice</h3>
              <p className="mt-1 text-[11px] text-muted-foreground">
                230+ Indian languages and dialects supported. Voice assistant follows your choice.
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {LANGUAGES.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLang(l.code);
                      if (session) writeSession({ ...session, lang: l.code });
                      setTimeout(() => setLangOpen(false), 180);
                    }}
                    className={cn(
                      "press min-h-[44px] rounded-xl border px-3 py-2 text-left",
                      lang === l.code
                        ? "border-cyan/60 bg-surface-2"
                        : "border-hairline bg-surface",
                    )}
                  >
                    <p className="text-[13px] font-semibold">{l.native}</p>
                    <p className="text-[10px] text-muted-foreground">{l.label}</p>
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-hairline">
                <span className="inline-flex items-center gap-1 text-[10px] text-muted-foreground">
                  <ShieldCheck className="h-3 w-3 text-india-green" /> Ministry of Railways ·
                  Govt of India
                </span>
                <button
                  onClick={() => {
                    clearSession();
                    navigate({ to: "/" });
                  }}
                  className="press min-h-[36px] inline-flex items-center gap-1 rounded-lg border border-hairline px-3 py-1.5 text-[11px] font-medium"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
  active,
}: {
  to: string;
  label: string;
  icon: typeof Home;
  active: boolean;
}) {
  return (
    <Link
      to={to}
      className={cn(
        "press relative flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-xl py-1 text-[10px] font-medium transition-colors",
        active ? "text-cyan" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="h-5 w-5" />
      <span className="truncate max-w-full px-1">{label}</span>
      {active && (
        <motion.span
          layoutId="navdot"
          className="absolute -top-0.5 h-1 w-6 rounded-full bg-live-gradient"
        />
      )}
    </Link>
  );
}
