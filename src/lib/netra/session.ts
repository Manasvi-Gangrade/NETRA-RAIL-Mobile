import { useEffect, useState } from "react";
import type { Role } from "./data";

const KEY = "netra.session";

export type Session = {
  role: Role;
  name: string;
  id: string;
  lang: string;
  designation?: string;
  employeeId?: string;
};

export function readSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function writeSession(s: Session) {
  window.localStorage.setItem(KEY, JSON.stringify(s));
  window.dispatchEvent(new Event("netra:session"));
}

export function clearSession() {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("netra:session"));
}

export const DEFAULT_IDENTITY: Record<Role, { name: string; id: string }> = {
  passenger: { name: "Aarav Sharma", id: "PNR 4472 118 903" },

  freight: { name: "R. Venkatesan", id: "EMP · FRT-20441 · JNPT" },
  controller: { name: "S. Deshmukh", id: "EMP · TC-10287 · Vadodara Jn" },
  trackman: { name: "A. Kumar Yadav", id: "EMP · PWI-55810 · Sec 4" },
};

/** Hydration-safe session hook. */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const sync = () => setSession(readSession());
    sync();
    setReady(true);
    window.addEventListener("netra:session", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("netra:session", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return { session, ready };
}
