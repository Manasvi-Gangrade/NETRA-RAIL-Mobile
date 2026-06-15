/**
 * NETRA-RAIL data layer — Fully synchronized with Datasets/
 * Source Datasets:
 *  - Datasets/netra_rail_system_summary.json
 *  - Datasets/pillar_a_vessel_freight.csv
 *  - Datasets/pillar_b_traffic_throughput.csv
 *  - Datasets/pillar_c_imu_sensor.csv
 *  - Datasets/pillar_d_drone_inspections.json
 */
import systemSummary from "../../../Datasets/netra_rail_system_summary.json";
import vesselFreightCsv from "../../../Datasets/pillar_a_vessel_freight.csv?raw";
import trafficThroughputCsv from "../../../Datasets/pillar_b_traffic_throughput.csv?raw";
import imuSensorCsv from "../../../Datasets/pillar_c_imu_sensor.csv?raw";
import droneMissions from "../../../Datasets/pillar_d_drone_inspections.json";

export { systemSummary };

/** CSV Parsing Utility */
function parseCSV(csvText: string): Record<string, string>[] {
  if (!csvText) return [];
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];
  const headers = lines[0].split(",").map((h) => h.trim());
  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ?? "";
    });
    return row;
  });
}

// Parsed Data Collections
export const parsedVessels = parseCSV(vesselFreightCsv);
export const parsedTraffic = parseCSV(trafficThroughputCsv);
export const parsedSensors = parseCSV(imuSensorCsv);
export const parsedDrones = droneMissions;

export const systemMetrics = {
  vessels: systemSummary.pillar_a_summary.total_vessels,
  demurrageSavedInr: systemSummary.pillar_a_summary.total_demurrage_saved_inr,
  dwellReductionPct: systemSummary.pillar_a_summary.avg_dwell_reduction_pct,
  totalTrains: systemSummary.pillar_b_summary.total_trains,
  throughputImprovementPct: systemSummary.pillar_b_summary.avg_throughput_improvement_pct,
  precedenceOverrides: systemSummary.pillar_b_summary.precedence_overrides,
  sensorReadings: systemSummary.pillar_c_summary.total_sensor_readings,
  anomaliesDetected: systemSummary.pillar_c_summary.anomalies_detected,
  droneMissions: systemSummary.pillar_d_summary.total_missions,
  defectsConfirmed: systemSummary.pillar_d_summary.defects_confirmed,
  cvConfidence: systemSummary.pillar_d_summary.avg_cv_confidence,
};

export type Role = "passenger" | "freight" | "controller" | "trackman";

export const ROLES: Record<
  Role,
  { label: string; tagline: string; home: string; authKind: "otp" | "employee" }
> = {
  passenger: {
    label: "Passenger",
    tagline: "Track your journey, protect the network",
    home: "/passenger",
    authKind: "otp",
  },
  freight: {
    label: "Freight & Logistics Coordinator",
    tagline: "Port-to-plant dispatch, live",
    home: "/freight",
    authKind: "employee",
  },
  controller: {
    label: "Station Master / Traffic Controller",
    tagline: "Precedence, explained in real time",
    home: "/control",
    authKind: "employee",
  },
  trackman: {
    label: "Trackman / Maintenance Crew",
    tagline: "Verified work orders, in the field",
    home: "/field",
    authKind: "employee",
  },
};

export const PILLARS = [
  { id: "A", name: "Pillar A", role: "Sensing Grid" },
  { id: "B", name: "Pillar B", role: "Traffic Brain" },
  { id: "C", name: "Pillar C", role: "Track Health" },
  { id: "D", name: "Pillar D", role: "Drone Verify" },
];

export const LANGUAGES = [
  { code: "en", label: "English", native: "English" },
  { code: "hi", label: "Hindi", native: "हिन्दी" },
  { code: "bn", label: "Bengali", native: "বাংলা" },
  { code: "ta", label: "Tamil", native: "தமிழ்" },
  { code: "te", label: "Telugu", native: "తెలుగు" },
  { code: "gu", label: "Gujarati", native: "ગુજરાતી" },
  { code: "kn", label: "Kannada", native: "ಕನ್ನಡ" },
  { code: "or", label: "Odia", native: "ଓଡ଼ିଆ" },
  { code: "ur", label: "Urdu", native: "اردو" },
  { code: "mr", label: "Marathi", native: "मराठी" },
];

/* ---------------- Passenger ---------------- */

export const journey = {
  trainNo: "12951",
  trainName: "Mumbai Rajdhani Express",
  from: { code: "BCT", name: "Mumbai Central" },
  to: { code: "NDLS", name: "New Delhi" },
  coach: "A1",
  seat: "23 / LB",
  progress: 0.46,
  etaMinutes: 214,
  delayMinutes: 12,
  nextHalt: "Vadodara Jn (BRC)",
  speedKmph: 128,
  stops: [
    { code: "BCT", name: "Mumbai Central", time: "17:00", done: true },
    { code: "BVI", name: "Borivali", time: "17:24", done: true },
    { code: "ST", name: "Surat", time: "19:38", done: true },
    { code: "BRC", name: "Vadodara Jn", time: "21:02", done: false },
    { code: "RTM", name: "Ratlam Jn", time: "23:40", done: false },
    { code: "KOTA", name: "Kota Jn", time: "02:15", done: false },
    { code: "NDLS", name: "New Delhi", time: "08:35", done: false },
  ],
};

export const delayExplainer = {
  headline: "Held 12 min at Vadodara approach",
  plain:
    "Pillar C detected an unusual vibration signature on Track 2 near Km 428. NETRA-RAIL routed your train via Track 1 and reduced speed to 90 km/h for 6 km as a precaution. A drone is already verifying the spot.",
  factors: [
    { label: "Precautionary slow zone", weight: 7, note: "Km 428 · Track 2" },
    { label: "Precedence to freight clearing", weight: 3, note: "Rake FR-4471" },
    { label: "Platform congestion at BRC", weight: 2, note: "PF 3" },
  ],
  droneEtaSeconds: 412,
  confidence: 0.94,
};

export const guardian = {
  kmThisMonth: 486,
  kmTarget: 750,
  level: "Silver Guardian",
  nextLevel: "Gold Guardian",
  anomaliesFlagged: 4,
  contributorsNearby: 1284,
  history: [
    { d: "Mar", km: 120 },
    { d: "Apr", km: 210 },
    { d: "May", km: 265 },
    { d: "Jun", km: 340 },
    { d: "Jul", km: 402 },
    { d: "Aug", km: 486 },
  ],
};

export const nearbyAlerts = [
  {
    id: "SZ-4412",
    kind: "slow-zone" as const,
    title: "Precautionary slow zone",
    location: "Km 428 · Vadodara–Surat",
    detail: "90 km/h cap · drone verifying",
    severity: "warn" as const,
    x: 62,
    y: 38,
  },
  {
    id: "WX-118",
    kind: "weather" as const,
    title: "Heavy rain advisory",
    location: "Bharuch section",
    detail: "Ballast washout risk · monitored",
    severity: "info" as const,
    x: 34,
    y: 62,
  },
  {
    id: "TR-902",
    kind: "cleared" as const,
    title: "Slow zone lifted",
    location: "Km 391 · Ankleshwar",
    detail: "Verified clear 22 min ago",
    severity: "ok" as const,
    x: 78,
    y: 72,
  },
];

/* ---------------- Freight ---------------- */

const uniquePorts = Array.from(new Set(parsedVessels.map((v) => v.port_name).filter(Boolean)));
export const ports = uniquePorts.length > 0 ? uniquePorts : ["Mundra", "JNPT", "Vishakhapatnam", "Paradip", "Kandla"];

export const freightStats = [
  { label: "Vessels Processed", value: systemMetrics.vessels, unit: "", tone: "cyan" as const },
  { label: "Avg Dwell Reduction", value: systemMetrics.dwellReductionPct, unit: "%", tone: "live" as const },
  { label: "Demurrage Saved", value: Number((systemMetrics.demurrageSavedInr / 10000000).toFixed(1)), unit: "₹Cr", tone: "warn" as const },
  { label: "Active Corridors", value: 9, unit: "", tone: "primary" as const },
];

export const vesselFeed = parsedVessels.slice(0, 6).map((v) => {
  const progressPct = Number(v.discharge_progress_pct) || 0;
  const isDone = v.discharge_status?.includes("COMPLETED") || progressPct >= 100;
  const isActive = v.discharge_status?.includes("DISCHARGING") || (progressPct > 0 && !isDone);
  return {
    id: v.vessel_id || "MV-ANANDA",
    name: v.vessel_name || "MV Ananda Shakti",
    cargo: `${v.cargo_type || "Coking coal"} · ${Number(v.cargo_tonnage || 61400).toLocaleString()} T`,
    berth: `${v.port_name || "Mundra"} · ${v.berth_no || "Berth 4"}`,
    etaLabel: isDone
      ? "Berthed"
      : isActive
      ? `Discharging · ${Math.round(progressPct)}%`
      : `ETA ${(v.eta || "").split(" ")[1] || "14:30"}`,
    progress: progressPct / 100,
    state: isDone ? ("done" as const) : isActive ? ("active" as const) : ("pending" as const),
  };
});

export const dispatchQueue = parsedVessels
  .filter((v) => v.allotted_rake_id && v.allotted_rake_id !== "None")
  .slice(0, 5)
  .map((v) => {
    const exposure = Number(v.demurrage_exposure_inr) || 425000;
    const savingInr = Number(v.demurrage_saved_inr) || 310000;
    const risk = exposure > 500000 ? ("high" as const) : exposure > 250000 ? ("medium" as const) : ("low" as const);
    return {
      id: v.allotted_rake_id,
      corridor: `${v.port_name} → ${(v.corridor_destination || "").split("-")[1] || "Plant Yard"}`,
      rake: `${v.cargo_type?.includes("Coal") ? "BOXNHL" : "BLCA"} · 58 wagons`,
      window: v.ai_optimized_dispatch_window || "21:40 – 22:10",
      aiNote: `AI dispatch window optimized to clear demurrage exposure of ₹${(exposure / 100000).toFixed(1)}L.`,
      risk,
      saving: Number((savingInr / 100000).toFixed(1)),
    };
  });

export const corridorThroughput = [
  { t: "00", planned: 42, actual: 38 },
  { t: "04", planned: 51, actual: 49 },
  { t: "08", planned: 63, actual: 58 },
  { t: "12", planned: 72, actual: 74 },
  { t: "16", planned: 68, actual: 66 },
  { t: "20", planned: 58, actual: 61 },
];

export const queryPlaceholders = [
  "Ask about any corridor…",
  "मुंद्रा से वडोदरा डिमरेज जोखिम?",
  "JNPT–Tata Steel rake ETA?",
  "விசாகப்பட்டினம் தாமதம் ஏன்?",
  "Golden Quadrilateral throughput today?",
];

/* ---------------- Controller ---------------- */

export const precedenceFeed = parsedTraffic.slice(0, 6).map((t) => {
  const isOverride = t.precedence_override === "True" || t.precedence_override === "true";
  const isExpress = t.priority_class?.includes("EXPRESS") || t.priority_class?.includes("SUPERFAST");
  const decision = isOverride ? ("HELD" as const) : isExpress ? ("PASS" as const) : ("SLOW" as const);
  const waitMin = Number(t.loop_wait_time_minutes) || 0;
  return {
    id: t.train_id || "TRN-2000",
    name: `${t.train_id} · ${(t.train_type || "Express").replace(/_/g, " ")}`,
    cls: isExpress ? ("express" as const) : ("freight" as const),
    decision,
    at: `${t.corridor_section} ${t.assigned_loop_line}`,
    why: isOverride
      ? `Held ${waitMin > 0 ? Math.round(waitMin) : 9} min on ${t.assigned_loop_line} for higher priority express precedence; JSSP solve ${t.jssp_solve_time_ms}ms.`
      : `Priority ${t.priority_class}; running at ${t.current_speed_kmh} km/h with ${t.throughput_after_tph} TPH throughput.`,
    delta: isOverride ? `+${waitMin > 0 ? Math.round(waitMin) : 9} min` : "0 min",
  };
});

const anomalySensor = parsedSensors.find((s) => s.is_anomaly === "True" || s.is_anomaly === "true") || parsedSensors[0];

export const controllerAlert = {
  id: `SZ-${anomalySensor?.sensor_id || "4412"}`,
  title: `Pillar C anomaly · ${anomalySensor?.track_section || "Km 428, Track 2"}`,
  detail: `Composite vibration index ${anomalySensor?.vibration_magnitude || "0.83"} m/s² (aknn distance ${anomalySensor?.aknn_distance_to_baseline || "0.49"}) from sensor grid (${anomalySensor?.gps_lat || "22.30°N"}, ${anomalySensor?.gps_lon || "73.10°E"}). Drone dispatched.`,
  droneEtaSeconds: 412,
  severity: "warn" as const,
};

export const sectionThroughput = [
  { t: "14:00", trains: 11, target: 12 },
  { t: "15:00", trains: 13, target: 12 },
  { t: "16:00", trains: 12, target: 12 },
  { t: "17:00", trains: 15, target: 14 },
  { t: "18:00", trains: 16, target: 14 },
  { t: "19:00", trains: 14, target: 14 },
  { t: "20:00", trains: 17, target: 15 },
];

export const controllerStats = [
  { label: "Trains in Section", value: systemMetrics.totalTrains },
  { label: "Avg Delay (min)", value: 6.4 },
  { label: "AI Decisions / hr", value: systemMetrics.precedenceOverrides * 3 },
  { label: "Manual Overrides", value: 2 },
];

/* ---------------- Trackman ---------------- */

export const workOrders = (parsedDrones as any[])
  .filter((d: any) => d.defect_found)
  .slice(0, 5)
  .map((d: any, index: number) => ({
    id: d.maintenance_order_id && d.maintenance_order_id !== "None" ? d.maintenance_order_id : `WO-${88400 + index}`,
    defect: d.defect_type || "Track Inspection Defect",
    grade: d.defect_severity === "HIGH" ? ("Class 1" as const) : d.defect_severity === "MEDIUM" ? ("Class 2" as const) : ("Class 3" as const),
    km: `Track ${d.track_section || "Vadodara-Surat"}`,
    coords: `${d.gps_lat || "22.30°N"}, ${d.gps_lon || "73.10°E"}`,
    section: `${d.track_section || "Vadodara–Surat"} Corridor`,
    slaMinutes: d.defect_severity === "HIGH" ? 46 : d.defect_severity === "MEDIUM" ? 120 : 180,
    droneShot: `drone-${(index % 3) + 1}`,
    status: d.slow_zone_lifted ? ("resolved" as const) : ("open" as const),
    note: `Drone ${d.drone_id} inspection (CV confidence ${(d.cv_confidence_score * 100).toFixed(1)}%). ${d.images_captured} images captured at ${d.altitude_metres}m altitude.`,
  }));

/* ---------------- Shared ---------------- */

export const notifications = [
  {
    id: "n1",
    tier: "critical" as const,
    title: `Slow zone active · ${anomalySensor?.track_section || "Km 428"}`,
    body: `Speed capped to 90 km/h. Vibration magnitude ${anomalySensor?.vibration_magnitude || "0.83"} m/s² detected. Drone verification in progress.`,
    time: "2 min ago",
  },
  ...(parsedDrones as any[]).slice(0, 3).map((d: any, i: number) => ({
    id: `n-drone-${i}`,
    tier: d.defect_found ? ("operational" as const) : ("info" as const),
    title: d.defect_found ? `Defect Confirmed: ${d.defect_type}` : `Track Cleared: ${d.track_section}`,
    body: d.defect_found
      ? `Drone ${d.drone_id} confirmed ${d.defect_severity} severity ${d.defect_type} at ${d.track_section} (${(d.cv_confidence_score * 100).toFixed(1)}% CV confidence).`
      : `Drone ${d.drone_id} completed aerial scan of ${d.track_section}. Track cleared, slow zone lifted.`,
    time: `${(i + 1) * 8} min ago`,
  })),
];

export const networkStats = [
  { label: "Track km Monitored", value: 68043, unit: "km" },
  { label: "Trains Under AI Guidance", value: systemMetrics.totalTrains, unit: "" },
  { label: "Throughput Improvement", value: systemMetrics.throughputImprovementPct, unit: "%" },
  { label: "Demurrage Saved (FY)", value: Number((systemMetrics.demurrageSavedInr / 10000000).toFixed(1)), unit: "₹Cr" },
];
