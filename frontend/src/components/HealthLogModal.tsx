import React, { useState, useEffect } from "react";
import { X, Calendar, Activity, Droplets } from "lucide-react";

interface HealthEntry {
  id: string;
  date: string;
  systolic: string;
  diastolic: string;
  glucose: string;
  notes: string;
  status: "Normal" | "Elevated" | "Low";
}

type FormData = Omit<HealthEntry, "id" | "status">;

interface HealthLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: HealthEntry) => void;
}

const calculateStatus = (systolic: string, glucose: string): HealthEntry["status"] => {
  const s = parseInt(systolic);
  const g = parseInt(glucose);
  if (s > 140 || g > 120) return "Elevated";
  if (s < 90 || g < 70) return "Low";
  return "Normal";
};

const emptyForm = (): FormData => ({
  date: new Date().toISOString().split("T")[0],
  systolic: "",
  diastolic: "",
  glucose: "",
  notes: "",
});

const HealthLogModal: React.FC<HealthLogModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<FormData>(emptyForm);

  useEffect(() => {
    if (isOpen) setFormData(emptyForm());
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const entry: HealthEntry = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      status: calculateStatus(formData.systolic, formData.glucose),
    };
    onSave(entry);
    onClose();
  };

  const field = (key: keyof FormData, value: string) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">New Clinical Entry</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Remote Patient Monitoring
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors active:scale-95"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Date */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Observation Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => field("date", e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* BP */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-2">
                Systolic (mmHg)
              </label>
              <div className="relative">
                <Activity className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="number"
                  placeholder="120"
                  value={formData.systolic}
                  onChange={(e) => field("systolic", e.target.value)}
                  className="w-full pl-10 pr-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">
                Diastolic (mmHg)
              </label>
              <input
                type="number"
                placeholder="80"
                value={formData.diastolic}
                onChange={(e) => field("diastolic", e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Glucose */}
          <div>
            <label className="block text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-2">
              Glucose Level (mg/dL)
            </label>
            <div className="relative">
              <Droplets className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="number"
                placeholder="95"
                value={formData.glucose}
                onChange={(e) => field("glucose", e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Clinical Notes
            </label>
            <textarea
              placeholder="Describe any symptoms or observations..."
              value={formData.notes}
              onChange={(e) => field("notes", e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all h-24 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all uppercase tracking-widest text-xs"
          >
            Save Clinical Record
          </button>
        </form>
      </div>
    </div>
  );
};

export default HealthLogModal;
