import React from "react";
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
} from "lucide-react";

const Dashboard: React.FC = () => {
  const vitals = [
    {
      title: "Blood Pressure",
      value: "122/80",
      unit: "mmHg",
      status: "Normal",
      statusColor: "text-green-600 bg-green-50",
      icon: Activity,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Glucose",
      value: "105",
      unit: "mg/dL",
      status: "Elevated",
      statusColor: "text-amber-600 bg-amber-50",
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
    {
      name: "Smart BP Cuff",
      status: "Connected",
      icon: Bluetooth,
      color: "text-blue-500",
    },
    {
      name: "GlucoCheck Pro",
      status: "Last sync 2h ago",
      icon: Smartphone,
      color: "text-slate-400",
    },
  ];

  return (
    <div className="pb-24 bg-slate-50 min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary border border-primary/20">
            <User className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-sm font-bold text-slate-900 leading-none">
              Donkings
            </h1>
            <div className="flex items-center gap-1.5 mt-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Live Monitoring
              </span>
            </div>
          </div>
        </div>
        <button className="p-2 bg-slate-100 rounded-full relative">
          <AlertCircle className="w-5 h-5 text-slate-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </header>

      <main className="p-6 space-y-6">
        {/* Health Alerts */}
        <section className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-start gap-4">
          <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-red-900">
              Elevated Glucose Alert
            </h2>
            <p className="text-xs text-red-700 mt-0.5 leading-relaxed">
              Your last glucose reading (105 mg/dL) is slightly above your
              target range. Consider a light walk.
            </p>
          </div>
        </section>

        {/* Vitals Grid */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
              Vital Signs
            </h2>
            <button className="text-xs font-bold text-primary flex items-center gap-1">
              Details <ChevronRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {vitals.map((vital, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm"
              >
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`${vital.bg} ${vital.color} w-8 h-8 rounded-lg flex items-center justify-center`}
                  >
                    <vital.icon className="w-5 h-5" />
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${vital.statusColor}`}
                  >
                    {vital.status}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {vital.title}
                </p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className="text-xl font-bold text-slate-900">
                    {vital.value}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold">
                    {vital.unit}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Trends Section */}
        <section className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest">
                7-Day Trends
              </h2>
            </div>
            <select className="text-[10px] font-bold text-slate-500 bg-slate-50 border-none rounded-lg px-2 py-1 outline-none">
              <option>Blood Pressure</option>
              <option>Glucose</option>
            </select>
          </div>
          {/* Visual Placeholder for a Chart */}
          <div className="h-32 flex items-end justify-between gap-2 px-2">
            {[40, 65, 45, 80, 55, 70, 60].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div
                  className={`w-full rounded-t-lg transition-all duration-500 ${i === 3 ? "bg-primary" : "bg-slate-100"}`}
                  style={{ height: `${height}%` }}
                ></div>
                <span className="text-[8px] font-bold text-slate-400 uppercase">
                  {["M", "T", "W", "T", "F", "S", "S"][i]}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Device Connectivity */}
        <section>
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-4">
            Connected Devices
          </h2>
          <div className="space-y-3">
            {devices.map((device, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-white rounded-2xl border border-slate-100 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center">
                    <device.icon className={`w-6 h-6 ${device.color}`} />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {device.name}
                    </h3>
                    <p className="text-[10px] font-medium text-slate-400">
                      {device.status}
                    </p>
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
              <h3 className="text-lg font-bold mt-1">
                Hypertension Management
              </h3>
            </div>
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
              <Calendar className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-xs text-blue-50 leading-relaxed mb-6">
            Your next clinical review is scheduled for **Apr 28, 2026**. Keep
            logging your vitals for accurate assessment.
          </p>
          <button className="w-full py-3 bg-white text-primary font-bold rounded-xl text-xs active:scale-95 transition-transform">
            View Plan Details
          </button>
        </section>
      </main>

      {/* FAB */}
      <button className="fixed bottom-24 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-xl shadow-primary/30 flex items-center justify-center active:scale-90 transition-transform z-10 border-4 border-white">
        <Plus className="w-8 h-8" />
      </button>
    </div>
  );
};

// Re-using icon from lucide-react that was missing in previous imports
const Calendar = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
    <line x1="16" x2="16" y1="2" y2="6" />
    <line x1="8" x2="8" y1="2" y2="6" />
    <line x1="3" x2="21" y1="10" y2="10" />
  </svg>
);

export default Dashboard;
