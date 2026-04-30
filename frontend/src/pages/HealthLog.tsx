import React, { useState, useEffect, useCallback } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Calendar,
  Activity,
  Droplets,
  Search,
  Filter,
  ChevronRight,
  FileText,
  Pill,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { useHealthPlan } from "../hooks/useHealthPlan";
import { healthLogsApi, HealthLogEntry } from "../services/api";

// ─── Local display type ───────────────────────────────────────────────────────

interface HealthEntry {
  id: number;
  date: string;
  systolic: string;
  diastolic: string;
  glucose: string;
  notes: string;
  status: "Normal" | "Elevated" | "Low";
}

type FormData = {
  systolic: string;
  diastolic: string;
  glucose: string;
  notes: string;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const today = new Date().toLocaleDateString("en-US", {
  weekday: "long",
  month: "long",
  day: "numeric",
});

function calculateStatus(systolic: string, glucose: string): HealthEntry["status"] {
  const s = parseInt(systolic);
  const g = parseInt(glucose);
  if (s > 140 || g > 120) return "Elevated";
  if (s < 90 || g < 70) return "Low";
  return "Normal";
}

function fromApi(log: HealthLogEntry): HealthEntry {
  const parts = (log.blood_pressure || "").split("/");
  const systolic = parts[0] || "";
  const diastolic = parts[1] || "";
  const glucose = log.glucose_level != null ? String(log.glucose_level) : "";
  const date = log.created_at.split("T")[0];
  return {
    id: log.id,
    date,
    systolic,
    diastolic,
    glucose,
    notes: log.symptoms || "",
    status: calculateStatus(systolic, glucose),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────

const HealthLog: React.FC = () => {
  const { supplements } = useHealthPlan();
  const takenCount = supplements.filter((s) => s.taken).length;
  const totalCount = supplements.length;

  const [entries, setEntries] = useState<HealthEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<HealthEntry | null>(null);
  const [formData, setFormData] = useState<FormData>({
    systolic: "",
    diastolic: "",
    glucose: "",
    notes: "",
  });

  const fetchLogs = useCallback(async () => {
    try {
      setError(null);
      const logs = await healthLogsApi.getAll(0, 50);
      setEntries(logs.map(fromApi));
    } catch {
      setError("Failed to load health logs.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleOpenModal = (entry?: HealthEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        systolic: entry.systolic,
        diastolic: entry.diastolic,
        glucose: entry.glucose,
        notes: entry.notes,
      });
    } else {
      setEditingEntry(null);
      setFormData({ systolic: "", diastolic: "", glucose: "", notes: "" });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this clinical record?")) return;
    try {
      await healthLogsApi.delete(id);
      setEntries((prev) => prev.filter((e) => e.id !== id));
    } catch {
      alert("Failed to delete record. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const payload = {
      blood_pressure: `${formData.systolic}/${formData.diastolic}`,
      glucose_level: formData.glucose ? parseFloat(formData.glucose) : undefined,
      symptoms: formData.notes || undefined,
    };
    try {
      if (editingEntry) {
        const updated = await healthLogsApi.update(editingEntry.id, payload);
        setEntries((prev) =>
          prev.map((e) => (e.id === editingEntry.id ? fromApi(updated) : e))
        );
      } else {
        const created = await healthLogsApi.create(payload);
        setEntries((prev) => [fromApi(created), ...prev]);
      }
      setIsModalOpen(false);
    } catch {
      setError("Failed to save record. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-24 min-h-screen bg-slate-50 animate-fade-in">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-5">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Health History</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{today}</p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="w-10 h-10 min-h-[44px] min-w-[44px] bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/20 active:scale-[0.98] transition-transform duration-150"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search logs..."
              className="w-full pl-9 pr-4 py-2 bg-slate-100 border-none rounded-xl text-xs font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <button className="p-2 min-h-[44px] min-w-[44px] bg-slate-100 rounded-xl text-slate-500 flex items-center justify-center active:scale-[0.98] transition-transform duration-150">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="p-6 space-y-4">
        {/* Supplement Adherence */}
        <section className="glass-card rounded-2xl overflow-hidden">
          <div className="p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
              <Pill className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Today's Supplement Adherence
              </p>
              <p className="text-sm font-bold text-slate-900 mt-0.5">
                You have taken <span className="text-primary">{takenCount}</span> of{" "}
                <span className="text-slate-700">{totalCount}</span> supplements today
              </p>
              <div className="mt-2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: totalCount ? `${(takenCount / totalCount) * 100}%` : "0%" }}
                />
              </div>
            </div>
            {takenCount === totalCount && totalCount > 0 && (
              <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0" />
            )}
          </div>
          <button className="w-full py-2.5 min-h-[44px] bg-slate-50 border-t border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1 active:scale-[0.98] transition-transform duration-150 hover:bg-slate-100">
            View all supplement history <ChevronRight className="w-3 h-3" />
          </button>
        </section>

        {/* Section label */}
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Clinical Records</p>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs text-slate-400 font-medium">Loading records…</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-sm text-red-500 font-medium">{error}</p>
            <button
              onClick={fetchLogs}
              className="mt-3 text-xs text-primary font-bold underline"
            >
              Try again
            </button>
          </div>
        ) : entries.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium text-sm">
              No health logs found.
              <br />
              <span className="text-xs text-slate-400">Start by adding your first clinical entry.</span>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div key={entry.id} className="glass-card rounded-2xl overflow-hidden">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {new Date(entry.date + "T00:00:00").toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                        <span
                          className={`inline-block mt-1 text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter ${
                            entry.status === "Normal"
                              ? "bg-green-50 text-green-600"
                              : entry.status === "Elevated"
                              ? "bg-amber-50 text-amber-600"
                              : "bg-blue-50 text-blue-600"
                          }`}
                        >
                          {entry.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleOpenModal(entry)}
                        className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-300 hover:text-primary active:scale-[0.98] transition-all duration-150"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-slate-300 hover:text-red-500 active:scale-[0.98] transition-all duration-150"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center">
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">BP</p>
                        <p className="text-sm font-bold text-slate-900">
                          {entry.systolic && entry.diastolic
                            ? `${entry.systolic}/${entry.diastolic}`
                            : "—"}{" "}
                          <span className="text-[10px] text-slate-400 font-medium">mmHg</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">Glucose</p>
                        <p className="text-sm font-bold text-slate-900">
                          {entry.glucose || "—"}{" "}
                          <span className="text-[10px] text-slate-400 font-medium">mg/dL</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {entry.notes && (
                    <div className="mt-4 flex items-start gap-2">
                      <FileText className="w-3 h-3 text-slate-300 mt-0.5" />
                      <p className="text-xs text-slate-500 italic leading-relaxed">{entry.notes}</p>
                    </div>
                  )}
                </div>
                <button className="w-full py-2 min-h-[44px] bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1 hover:bg-slate-100 active:scale-[0.98] transition-all duration-150 border-t border-slate-100">
                  Full Report <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-md">
          <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {editingEntry ? "Update Record" : "New Clinical Entry"}
                </h2>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Remote Patient Monitoring
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <p className="text-xs text-red-500 font-medium bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                  {error}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">
                    Systolic (mmHg)
                  </label>
                  <input
                    type="number"
                    placeholder="120"
                    value={formData.systolic}
                    onChange={(e) => setFormData({ ...formData, systolic: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">
                    Diastolic (mmHg)
                  </label>
                  <input
                    type="number"
                    placeholder="80"
                    value={formData.diastolic}
                    onChange={(e) => setFormData({ ...formData, diastolic: e.target.value })}
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-2">
                  Glucose Level (mg/dL)
                </label>
                <input
                  type="number"
                  placeholder="95"
                  value={formData.glucose}
                  onChange={(e) => setFormData({ ...formData, glucose: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                  Clinical Notes
                </label>
                <textarea
                  placeholder="Describe any symptoms or observations..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-24 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all uppercase tracking-widest text-xs disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingEntry ? "Update Clinical Record" : "Save Clinical Record"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthLog;
