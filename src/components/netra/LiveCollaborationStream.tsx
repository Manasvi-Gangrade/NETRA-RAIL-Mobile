import { AnimatePresence, motion } from "motion/react";
import { Activity, Bell, RefreshCw, Users, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Chip } from "./primitives";

export type CollaborationEvent = {
  id: string;
  user: string;
  role: string;
  action: string;
  time: string;
  location: string;
};

const INITIAL_EVENTS: CollaborationEvent[] = [
  {
    id: "collab-1",
    user: "Controller Rajesh V.",
    role: "Section Controller",
    action: "Assigned precedence hold to Freight Rake DN-402",
    time: "Just now",
    location: "Vadodara (BRC) Section",
  },
  {
    id: "collab-2",
    user: "Trackman Suresh K.",
    role: "Gang 14 Field Crew",
    action: "Marked Rail Stress Fracture resolved at Km 428.32",
    time: "2m ago",
    location: "Track 2 (Up Line)",
  },
  {
    id: "collab-3",
    user: "Co-ordinator Anita M.",
    role: "JNPT Logistics",
    action: "Approved Rake Slot #409 for Container Vessel MV Al-Riyadh",
    time: "4m ago",
    location: "Berth #4 JNPT",
  },
];

const STREAM_POOL: Omit<CollaborationEvent, "id" | "time">[] = [
  {
    user: "Controller Amit S.",
    role: "Section Controller",
    action: "Updated speed restriction to 90 km/h on Track 1",
    location: "Surat (ST) Yard",
  },
  {
    user: "Trackman Vikram P.",
    role: "Patrol Crew 08",
    action: "Uploaded drone inspection photo for Fastener Defect #D-902",
    location: "Km 431.10",
  },
  {
    user: "Co-ordinator Devang K.",
    role: "Mundra Port Logistics",
    action: "Re-routed 40 TEU Coal Rake to DFC Western Corridor",
    location: "Mundra DFC Junction",
  },
];

export function useNonDisruptiveCollaboration() {
  const [events, setEvents] = useState<CollaborationEvent[]>(INITIAL_EVENTS);
  const [lastUpdate, setLastUpdate] = useState<CollaborationEvent | null>(null);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  // Global listener for active typing to ensure active user input is NEVER interrupted
  useEffect(() => {
    const handleFocusIn = (e: FocusEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") {
        setIsUserTyping(true);
      }
    };
    const handleFocusOut = (e: FocusEvent) => {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") {
        setIsUserTyping(false);
      }
    };

    window.addEventListener("focusin", handleFocusIn);
    window.addEventListener("focusout", handleFocusOut);
    return () => {
      window.removeEventListener("focusin", handleFocusIn);
      window.removeEventListener("focusout", handleFocusOut);
    };
  }, []);

  // Periodic non-disruptive background live updates (Challenge #279 implementation)
  useEffect(() => {
    let poolIndex = 0;
    const interval = setInterval(() => {
      const item = STREAM_POOL[poolIndex % STREAM_POOL.length];
      if (!item) return;
      poolIndex++;

      const newEvent: CollaborationEvent = {
        id: `collab-${Date.now()}`,
        user: item.user,
        role: item.role,
        action: item.action,
        location: item.location,
        time: "Just now",
      };

      setEvents((prev) => [newEvent, ...prev.slice(0, 5)]);
      setLastUpdate(newEvent);
      setUnreadCount((c) => c + 1);
    }, 10000); // Live update every 10s

    return () => clearInterval(interval);
  }, []);

  return { events, lastUpdate, isUserTyping, unreadCount, clearUnread: () => setUnreadCount(0) };
}

export function NonDisruptiveCollaborationBanner() {
  const { lastUpdate, isUserTyping, unreadCount, clearUnread } = useNonDisruptiveCollaboration();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!lastUpdate) return;
    setVisible(true);
    const t = setTimeout(() => setVisible(false), 5000);
    return () => clearTimeout(t);
  }, [lastUpdate]);

  return (
    <div className="w-full">
      {/* Live Collaboration Badge Header (Challenge #279) */}
      <div className="mb-3 flex items-center justify-between rounded-xl border border-cyan/30 bg-surface-2/80 px-3 py-2 text-[11px] backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan" />
          </span>
          <span className="font-semibold text-foreground">Live Co-Worker Stream</span>
          <Chip tone="cyan" className="text-[9px] py-0 px-1.5">Challenge #279</Chip>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground text-[10px]">
          {isUserTyping ? (
            <span className="flex items-center gap-1 font-semibold text-live">
              <ShieldCheck className="h-3 w-3 text-live" /> Input Lock Active (Zero Disruption)
            </span>
          ) : (
            <span className="flex items-center gap-1 font-mono">
              <Users className="h-3 w-3 text-cyan" /> 6 Active Co-Workers
            </span>
          )}
        </div>
      </div>

      {/* Floating Non-Disruptive Toast Banner */}
      <AnimatePresence>
        {visible && lastUpdate && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            onClick={clearUnread}
            className="mb-3 rounded-xl border border-cyan/40 bg-background/95 p-3 shadow-xl backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-cyan/15 text-cyan border border-cyan/30">
                  <Activity className="h-4 w-4" />
                </span>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-bold text-foreground">{lastUpdate.user}</span>
                    <span className="text-[10px] text-muted-foreground">({lastUpdate.role})</span>
                  </div>
                  <p className="text-[11px] text-cyan font-medium">{lastUpdate.action}</p>
                </div>
              </div>
              <span className="num shrink-0 text-[10px] text-muted-foreground font-mono">{lastUpdate.time}</span>
            </div>
            {isUserTyping && (
              <p className="mt-1.5 text-[9.5px] text-live font-semibold flex items-center gap-1 border-t border-hairline pt-1">
                <RefreshCw className="h-2.5 w-2.5 animate-spin text-live" /> Updated live without interrupting your current input field.
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
