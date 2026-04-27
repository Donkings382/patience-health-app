import React from "react";
import {
  Shield,
  Bell,
  Info,
  LogOut,
  ChevronRight,
  User,
  Settings,
  Database,
  Smartphone,
  CreditCard,
  Lock,
  ExternalLink,
} from "lucide-react";

const Profile: React.FC = () => {
  const settingsGroups = [
    {
      title: "Clinical Profile",
      items: [
        {
          icon: User,
          label: "Personal Information",
          color: "text-blue-600",
          bg: "bg-blue-50",
        },
        {
          icon: Database,
          label: "Health Data & History",
          color: "text-teal-600",
          bg: "bg-teal-50",
        },
      ],
    },
    {
      title: "App Settings",
      items: [
        {
          icon: Shield,
          label: "Privacy & Security",
          color: "text-purple-600",
          bg: "bg-purple-50",
        },
        {
          icon: Bell,
          label: "Notification Preferences",
          color: "text-amber-600",
          bg: "bg-amber-50",
        },
        {
          icon: Smartphone,
          label: "Connected Devices",
          color: "text-indigo-600",
          bg: "bg-indigo-50",
        },
      ],
    },
    {
      title: "Support",
      items: [
        {
          icon: Info,
          label: "App Version",
          value: "1.0.0",
          color: "text-slate-500",
          bg: "bg-slate-50",
        },
        {
          icon: ExternalLink,
          label: "Help & Support",
          color: "text-slate-500",
          bg: "bg-slate-50",
        },
      ],
    },
  ];

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to terminate your session?")) {
      console.log("Logging out...");
    }
  };

  return (
    <div className="pb-24 min-h-screen bg-slate-50">
      {/* Header Profile Section */}
      <header className="bg-white px-6 pt-12 pb-8 text-center border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/5 to-blue-500/5"></div>
        <div className="relative">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-primary/10 shadow-xl shadow-primary/5 p-1">
            <div className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">D</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Donkings</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            Patient ID: #H-2026-0415
          </p>
          <div className="flex justify-center gap-2 mt-4">
            <span className="px-3 py-1 bg-green-50 text-green-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-green-100">
              Verified
            </span>
            <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full uppercase tracking-widest border border-blue-100">
              Care Plan Active
            </span>
          </div>
        </div>
      </header>

      <main className="p-6 space-y-8">
        {settingsGroups.map((group, groupIndex) => (
          <section key={groupIndex}>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
              {group.title}
            </h2>
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              {group.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  className={`w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors ${
                    itemIndex !== group.items.length - 1
                      ? "border-b border-slate-50"
                      : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center shadow-sm`}
                    >
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">
                      {item.label}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {item.value && (
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                        {item.value}
                      </span>
                    )}
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>
                </button>
              ))}
            </div>
          </section>
        ))}

        {/* Security Section */}
        <section className="bg-rose-50/50 border border-rose-100 p-6 rounded-3xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-rose-900">
                Security Actions
              </h3>
              <p className="text-[10px] text-rose-700 font-medium">
                Protect your clinical data
              </p>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 p-4 bg-white text-rose-500 font-bold rounded-2xl border border-rose-100 shadow-sm hover:bg-rose-500 hover:text-white transition-all active:scale-[0.98] text-xs uppercase tracking-widest"
            >
              <LogOut className="w-4 h-4" />
              <span>Terminate Session</span>
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Profile;
