import React, { useState, useEffect, useCallback } from "react";
import {
  Activity,
  Droplets,
  Plus,
  User,
  AlertCircle,
  Smartphone,
  Bluetooth,
  ChevronRight,
  TrendingUp,
  Heart,
  Scale,
  CheckCircle2,
  Circle,
  Clock,
  Pill,
  Utensils,
  Footprints,
  Calendar as CalendarIcon,
  Bell,
  LogOut,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useHealthPlan } from "../hooks/useHealthPlan";
import { ScheduleItem } from "../types/healthPlan";
import HealthLogModal from "../components/HealthLogModal";
import { useAuth } from "../contexts/AuthContext";
import { dashboardApi, healthLogsApi, DashboardData, HealthLogEntry } from "../services/api";

// ─── Icons helpers ────────────────────────────────────────────────────────────

const scheduleTypeIcon = (type: ScheduleItem["type"]) => {
  switch (type) {
    case "meal":       return <Utensils className="w-3.5 h-3.5" />;
    case "medication": return <Pill className="w-3.5 h-3.5" />;
    case "exercise":   return <Footprints className="w-3.5 h-3.5" />;
    case "rest":       return <Bell className="w-3.5 h-3.5" />;
  }
};

const scheduleTypeColor = (type: ScheduleItem["type"]) => {
  switch (type) {
    case "meal":       return "bg-orange-50 text-orange-500";
    case "medication": return "bg-blue-50 text-blue-500";
    case "exercise":   return "bg-green-50 text-green-500";
    case "rest":       return "bg-purple-50 text-purple-500";
  }
};

// ─── Trends chart ─────────────────────────────────────────────────────────────

type TrendsChartProps = {
  logs: HealthLogEntry[];
};

const dayLetter = (iso: string) =>
  ["S", "M", "T", "W", "T", "F", "S"][new Date(iso).getDay()];

const TrendsChart: React.FC<TrendsChartProps> = ({ logs }) => {
  const [metric, setMetric] = useState<"bp" | "glucose">("bp");

  // Logs come newest-first from API — reverse for left-to-right chronological display
  const ordered = [...logs].reverse();

  const bpValues = ordered.map((l) => {
    const systolic = l.blood_pressure ? parseInt(l.blood_pressure.split("/")[0]) : 0;
    return isNaN(systolic) ? 0 : systolic;
  });

  const glucoseValues = ordered.map((l) =>
    l.glucose_level != null ? l.glucose_level : 0
  );

  const values = metric === "bp" ? bpValues : glucoseValues;
  const max = Math.max(...values, 1);
  const color = metric === "bp" ? "bg-primary" : "bg-teal-500";
  const label = metric === "bp" ? "Systolic BP" : "Glucose";
  const unit = metric === "bp" ? "mmHg" : "mg/dL";

  return (
    <section className="glass-card p-5 rounded-2xl">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">7-Day Trends</h2>
        </div>
        <select
          value={metric}
          onChange={(e) => setMetric(e.target.value as "bp" | "glucose")}
          className="text-[10px] font-bold text-slate-500 bg-slate-50 border-none rounded-lg px-2 py-1 outline-none"
        >
          <option value="bp">Blood Pressure</option>
          <option value="glucose">Glucose</option>
        </select>
      </div>
      <p className="text-[10px] text-slate-400 font-medium mb-4">
        Based on your last {ordered.length} log{ordered.length !== 1 ? "s" : ""}
      </p>

      {ordered.length === 0 ? (
        <p className="text-center text-xs text-slate-400 py-8">No data yet — add a clinical record to see trends.</p>
      ) : (
        <div className="flex items-end justify-between gap-2 px-1" style={{ height: "9rem" }}>
          {values.map((val, i) => {
            const heightPct = (val / max) * 80;
            const isHighest = val === max;
            return (
              <div key={i} className="flex-1 flex flex-col items-end justify-end gap-1 h-full">
                <span className={`text-[9px] font-bold ${isHighest ? "text-primary" : "text-slate-400"}`}>
                  {val || "—"}
                </span>
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${isHighest ? color : "bg-slate-100"}`}
                  style={{ height: val ? `${heightPct}%` : "4px" }}
                />
                <span className="text-[8px] font-bold text-slate-400 uppercase">
                  {dayLetter(ordered[i].created_at)}
                </span>
              </div>
            );
          })}
        </div>
      )}
      <p className="text-[10px] text-slate-400 text-right mt-2 font-medium">
        {label} · {unit}
      </p>
    </section>
  );
};

// ─── Dashboard ────────────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { supplements, schedule, toggleSupplement, toggleScheduleItem } = useHealthPlan();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [dashData, setDashData] = useState<DashboardData | null>(null);
  const [trendLogs, setTrendLogs] = useState<HealthLogEntry[]>([]);

  const fetchDashboard = useCallback(async () => {
    try {
      const [dash, logs] = await Promise.all([
        dashboardApi.get(),
        healthLogsApi.getAll(0, 7),
      ]);
      setDashData(dash);
      setTrendLogs(logs);
    } catch {
      // silently keep previous state; user can still interact
    }
  }, []);

  useEffect(() => {
    fetchDashboard();
  }, [fetchDashboard]);

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out?")) {
      logout();
      navigate("/login");
    }
  };

  // Derive real vitals from most recent log
  const latestLog = dashData?.recent_logs[0];
  const latestBP = latestLog?.blood_pressure || null;
  const latestGlucose = latestLog?.glucose_level != null ? String(latestLog.glucose_level) : null;
  const latestSymptom = dashData?.latest_symptom || null;

  // Determine if glucose is elevated
  const glucoseNum = latestGlucose ? parseFloat(latestGlucose) : null;
  const glucoseStatus = glucoseNum == null ? "—" : glucoseNum > 120 ? "Elevated" : glucoseNum < 70 ? "Low" : "Normal";
  const glucoseStatusColor =
    glucoseStatus === "Elevated" ? "text-amber-600 bg-amber-50"
    : glucoseStatus === "Low" ? "text-blue-600 bg-blue-50"
    : "text-green-600 bg-green-50";

  // BP status
  const bpSystolic = latestBP ? parseInt(latestBP.split("/")[0]) : null;
  const bpStatus = bpSystolic == null ? "—" : bpSystolic > 140 ? "Elevated" : bpSystolic < 90 ? "Low" : "Normal";
  const bpStatusColor =
    bpStatus === "Elevated" ? "text-amber-600 bg-amber-50"
    : bpStatus === "Low" ? "text-blue-600 bg-blue-50"
    : "text-green-600 bg-green-50";

  const vitals = [
    {
      title: "Blood Pressure",
      value: latestBP || "—",
      unit: "mmHg",
      status: bpStatus,
      statusColor: bpStatusColor,
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Glucose",
      value: latestGlucose || "—",
      unit: "mg/dL",
      status: glucoseStatus,
      statusColor: glucoseStatusColor,
      icon: Droplets,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      title: "Heart Rate",
      value: "72",
      unit: "bpm",
      status: "Normal",
      statusColor: "text-green-600 bg-green-50",
      icon: Heart,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      title: "Weight",
      value: "74.5",
      unit: "kg",
      status: "Stable",
      statusColor: "text-blue-600 bg-blue-50",
      icon: Scale,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
  ];

  const devices = [
    { name: "Smart BP Cuff", status: "Connected", icon: Bluetooth, color: "text-blue-500" },
    { name: "GlucoCheck Pro", status: "Last sync 2h ago", icon: Smartphone, color: "text-slate-400" },
  ];

  const upcomingItems = [...schedule]
    .sort((a, b) => a.time.localeCompare(b.time))
    .filter((item) => !item.completed)
    .slice(0, 4);

  const pendingSupplements = supplements.filter((s) => !s.taken);

  const showAlert =
    latestSymptom ||
    glucoseStatus === "Elevated" ||
    bpStatus === "Elevated";

  const alertMessage = latestSymptom
    ? latestSymptom
    : glucoseStatus === "Elevated"
    ? `Your last glucose reading (${latestGlucose} mg/dL) is slightly above your target range. Consider a light walk.`
    : bpStatus === "Elevated"
    ? `Your last blood pressure reading (${latestBP} mmHg) is above your target range. Rest and monitor closely.`
    : "";

  const alertTitle = latestSymptom
    ? "Latest Symptom Reported"
    : glucoseStatus === "Elevated"
    ? "Elevated Glucose Alert"
    : "Elevated BP Alert";

  return (
    <div className="pb-24 bg-slate-50 min-h-screen animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-none">{user?.name || "Guest"}</h1>
            <p className="text-[10px] text-slate-400 font-medium truncate max-w-[140px]">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Live Monitoring
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 bg-slate-100 rounded-full relative min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-[0.98] transition-transform duration-150">
            <AlertCircle className="w-5 h-5 text-slate-600" />
            {showAlert && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
            )}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 bg-slate-100 rounded-full min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-[0.98] transition-transform duration-150"
            title="Sign out"
          >
            <LogOut className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </header>

      <main className="p-6 space-y-6">
        {/* Health Alert — only shown when there's real data to alert on */}
        {showAlert && (
          <section className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-4">
            <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
              <AlertCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-red-900">{alertTitle}</h2>
              <p className="text-xs text-red-700 mt-0.5 leading-relaxed">{alertMessage}</p>
            </div>
          </section>
        )}

        {/* Vitals Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Vital Signs</h2>
            <button className="text-xs font-bold text-primary flex items-center gap-1 min-h-[44px] px-2 active:scale-[0.98] transition-transform duration-150">
              Details <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {vitals.map((vital, index) => (
              <div key={index} className="glass-card p-4 rounded-2xl">
                <div className="flex items-center justify-between mb-3">
                  <div className={`${vital.bg} ${vital.color} w-8 h-8 rounded-lg flex items-center justify-center`}>
                    <vital.icon className="w-5 h-5" />
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${vital.statusColor}`}>
                    {vital.status}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{vital.title}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-bold text-slate-900">{vital.value}</span>
                  <span className="text-[10px] text-slate-400 font-bold">{vital.unit}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Today's Plan */}
        <section className="glass-card p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <CalendarIcon className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Today's Plan</h2>
          </div>
          {upcomingItems.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">All tasks completed for today 🎉</p>
          ) : (
            <ul className="space-y-3">
              {upcomingItems.map((item) => (
                <li key={item.id} className="flex items-center gap-3">
                  <button
                    onClick={() => toggleScheduleItem(item.id)}
                    className="shrink-0 text-slate-300 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-[0.98] transition-transform duration-150"
                  >
                    {item.completed
                      ? <CheckCircle2 className="w-5 h-5 text-primary" />
                      : <Circle className="w-5 h-5" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold text-slate-800 truncate ${item.completed ? "line-through text-slate-400" : ""}`}>
                      {item.activity}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`p-1.5 rounded-lg ${scheduleTypeColor(item.type)}`}>
                      {scheduleTypeIcon(item.type)}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                      <Clock className="w-3 h-3" />
                      {item.time}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Supplements */}
        {pendingSupplements.length > 0 && (
          <section className="glass-card p-5 rounded-2xl">
            <div className="flex items-center gap-2 mb-4">
              <Pill className="w-4 h-4 text-primary" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Supplements</h2>
            </div>
            <ul className="space-y-3">
              {pendingSupplements.map((s) => (
                <li key={s.id} className="flex items-start justify-between gap-3 p-3 bg-slate-50 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800">{s.name}
                      <span className="ml-1.5 text-xs font-semibold text-slate-400">{s.dosage}</span>
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-400">{s.time}</span>
                    </div>
                    {s.instructions && (
                      <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{s.instructions}</p>
                    )}
                  </div>
                  <button
                    onClick={() => toggleSupplement(s.id)}
                    className="shrink-0 text-[10px] font-bold text-primary bg-primary/10 px-3 py-1.5 rounded-lg min-h-[44px] active:scale-[0.98] transition-transform duration-150 whitespace-nowrap"
                  >
                    Mark Taken
                  </button>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Doctor's Advice */}
        <section className="glass-card p-5 rounded-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">Doctor's Advice</h2>
          </div>
          <ul className="space-y-3 text-xs text-slate-600 leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0"></span>
              <span><span className="font-bold text-slate-800">BP target:</span> Keep blood pressure below 130/80 mmHg. Take Lisinopril consistently every evening.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-teal-400 shrink-0"></span>
              <span><span className="font-bold text-slate-800">Glucose target:</span> Fasting glucose should stay between 80–100 mg/dL. Avoid sugary drinks and refined carbs.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-green-400 shrink-0"></span>
              <span><span className="font-bold text-slate-800">Exercise:</span> Aim for at least 30 minutes of moderate activity (brisk walking) 5 days a week.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0"></span>
              <span><span className="font-bold text-slate-800">Diet:</span> Reduce sodium intake to under 2,300 mg/day. Prioritise vegetables, lean protein, and whole grains.</span>
            </li>
          </ul>
        </section>

        <TrendsChart logs={trendLogs} />

        {/* Device Connectivity */}
        <section>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">Connected Devices</h2>
          <div className="space-y-3">
            {devices.map((device, index) => (
              <div key={index} className="flex items-center justify-between p-4 glass-card rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                    <device.icon className={`w-6 h-6 ${device.color}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{device.name}</h3>
                    <p className="text-[10px] font-medium text-slate-400">{device.status}</p>
                  </div>
                </div>
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              </div>
            ))}
          </div>
        </section>

        {/* Active Care Plan */}
        <section className="bg-gradient-to-br from-primary to-blue-700 p-6 rounded-3xl text-white shadow-lg shadow-primary/20">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-100 opacity-80">
                Current Care Plan
              </p>
              <h3 className="text-lg font-bold mt-1">Hypertension Management</h3>
            </div>
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <CalendarIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-xs text-blue-50 leading-relaxed mb-6">
            Your next clinical review is scheduled for <span className="font-bold">Apr 28, 2026</span>. Keep logging your vitals for accurate assessment.
          </p>
          <button className="w-full py-3 bg-white text-primary font-bold rounded-xl text-xs min-h-[44px] active:scale-[0.98] transition-transform duration-150">
            View Plan Details
          </button>
        </section>
      </main>

      {/* FAB */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-xl shadow-primary/30 flex items-center justify-center active:scale-90 transition-transform z-10 border-4 border-white"
      >
        <Plus className="w-8 h-8" />
      </button>

      <HealthLogModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaved={(newLog) => {
          setTrendLogs((prev) => [newLog, ...prev].slice(0, 7));
          fetchDashboard();
        }}
      />
    </div>
  );
};

export default Dashboard;
