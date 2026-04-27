import React, { useState } from "react";
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
} from "lucide-react";

interface HealthEntry {
  id: string;
  date: string;
  systolic: string;
  diastolic: string;
  glucose: string;
  notes: string;
  status: "Normal" | "Elevated" | "Low";
}

const HealthLog: React.FC = () => {
  const [entries, setEntries] = useState<HealthEntry[]>([
    {
      id: "1",
      date: "2026-04-15",
      systolic: "122",
      diastolic: "80",
      glucose: "98",
      notes: "Feeling good after morning walk",
      status: "Normal",
    },
    {
      id: "2",
      date: "2026-04-14",
      systolic: "118",
      diastolic: "76",
      glucose: "105",
      notes: "Slightly high glucose after lunch",
      status: "Elevated",
    },
  ]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<HealthEntry | null>(null);
  const [formData, setFormData] = useState<Omit<HealthEntry, "id" | "status">>({
    date: new Date().toISOString().split("T")[0],
    systolic: "",
    diastolic: "",
    glucose: "",
    notes: "",
  });

  const handleOpenModal = (entry?: HealthEntry) => {
    if (entry) {
      setEditingEntry(entry);
      setFormData({
        date: entry.date,
        systolic: entry.systolic,
        diastolic: entry.diastolic,
        glucose: entry.glucose,
        notes: entry.notes,
      });
    } else {
      setEditingEntry(null);
      setFormData({
        date: new Date().toISOString().split("T")[0],
        systolic: "",
        diastolic: "",
        glucose: "",
        notes: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (
      window.confirm("Are you sure you want to delete this clinical record?")
    ) {
      setEntries(entries.filter((e) => e.id !== id));
    }
  };

  const calculateStatus = (
    systolic: string,
    glucose: string,
  ): "Normal" | "Elevated" | "Low" => {
    const s = parseInt(systolic);
    const g = parseInt(glucose);
    if (s > 140 || g > 120) return "Elevated";
    if (s < 90 || g < 70) return "Low";
    return "Normal";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const status = calculateStatus(formData.systolic, formData.glucose);
    if (editingEntry) {
      setEntries(
        entries.map((e) =>
          e.id === editingEntry.id ? { ...formData, id: e.id, status } : e,
        ),
      );
    } else {
      setEntries([
        { ...formData, id: Math.random().toString(36).substr(2, 9), status },
        ...entries,
      ]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="pb-24 min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Health History</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              Clinical Records
            </p>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-transform"
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
          <button className="p-2 bg-slate-100 rounded-xl text-slate-500">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </header>

      <main className="p-6">
        {entries.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-10 h-10 text-slate-300" />
            </div>
            <p className="text-slate-500 font-medium text-sm">
              No health logs found.
              <br />
              <span className="text-xs text-slate-400">
                Start by adding your first clinical entry.
              </span>
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                        <Calendar className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {new Date(entry.date).toLocaleDateString("en-US", {
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
                        className="p-2 text-slate-300 hover:text-primary transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(entry.id)}
                        className="p-2 text-slate-300 hover:text-red-500 transition-colors"
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
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                          BP
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {entry.systolic}/{entry.diastolic}{" "}
                          <span className="text-[10px] text-slate-400 font-medium">
                            mmHg
                          </span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-teal-50 text-teal-600 rounded-lg flex items-center justify-center">
                        <Droplets className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-[8px] text-slate-400 font-bold uppercase tracking-widest">
                          Glucose
                        </p>
                        <p className="text-sm font-bold text-slate-900">
                          {entry.glucose}{" "}
                          <span className="text-[10px] text-slate-400 font-medium">
                            mg/dL
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>

                  {entry.notes && (
                    <div className="mt-4 flex items-start gap-2">
                      <FileText className="w-3 h-3 text-slate-300 mt-0.5" />
                      <p className="text-xs text-slate-500 italic leading-relaxed">
                        {entry.notes}
                      </p>
                    </div>
                  )}
                </div>
                <button className="w-full py-2 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-center gap-1 hover:bg-slate-100 transition-colors border-t border-slate-100">
                  Full Report <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal Redesign */}
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
              <div className="grid grid-cols-1 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
                    Observation Date
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 text-blue-600">
                      Systolic (mmHg)
                    </label>
                    <input
                      type="number"
                      placeholder="120"
                      value={formData.systolic}
                      onChange={(e) =>
                        setFormData({ ...formData, systolic: e.target.value })
                      }
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 text-blue-400">
                      Diastolic (mmHg)
                    </label>
                    <input
                      type="number"
                      placeholder="80"
                      value={formData.diastolic}
                      onChange={(e) =>
                        setFormData({ ...formData, diastolic: e.target.value })
                      }
                      className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 text-teal-600">
                    Glucose Level (mg/dL)
                  </label>
                  <input
                    type="number"
                    placeholder="95"
                    value={formData.glucose}
                    onChange={(e) =>
                      setFormData({ ...formData, glucose: e.target.value })
                    }
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
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                    className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-24 resize-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all mt-4 uppercase tracking-widest text-xs"
              >
                {editingEntry
                  ? "Update Clinical Record"
                  : "Save Clinical Record"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthLog;
