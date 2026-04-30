import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { profileApi } from "../services/api";
import {
  Shield,
  Bell,
  Info,
  LogOut,
  ChevronRight,
  User,
  Database,
  Smartphone,
  Lock,
  Eye,
  EyeOff,
  ExternalLink,
  ClipboardList,
  X,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// ─── Edit Name Modal ──────────────────────────────────────────────────────────

const EditNameModal: React.FC<{
  currentName: string;
  onClose: () => void;
  onSaved: (name: string) => void;
}> = ({ currentName, onClose, onSaved }) => {
  const [name, setName] = useState(currentName);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const updated = await profileApi.update(name.trim());
      onSaved(updated.name ?? name.trim());
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update name.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update your profile</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
              placeholder="Your full name"
              required
            />
          </div>
          <button
            type="submit"
            disabled={saving || !name.trim()}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all uppercase tracking-widest text-xs disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Change Password Modal ────────────────────────────────────────────────────

const ChangePasswordModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [form, setForm] = useState({ oldPassword: "", newPassword: "", confirm: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.newPassword !== form.confirm) {
      setError("New passwords do not match.");
      return;
    }
    if (form.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await profileApi.changePassword(form.oldPassword, form.newPassword);
      setSuccess(true);
      setTimeout(onClose, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/40 backdrop-blur-md">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Change Password</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Protect your account</p>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-full transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-100 rounded-xl text-xs font-medium text-red-600">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-100 rounded-xl text-xs font-medium text-green-700">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              Password changed successfully!
            </div>
          )}
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showOld ? "text" : "password"}
                value={form.oldPassword}
                onChange={(e) => setForm({ ...form, oldPassword: e.target.value })}
                className="w-full p-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Enter current password"
                required
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className="w-full p-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="At least 6 characters"
                required
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                className="w-full p-3 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Repeat new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={saving || success}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 active:scale-[0.98] transition-all uppercase tracking-widest text-xs disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

// ─── Profile Page ─────────────────────────────────────────────────────────────

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout, refreshUser } = useAuth();
  const [editNameOpen, setEditNameOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);

  const settingsGroups = [
    {
      title: "Clinical Profile",
      items: [
        {
          icon: User,
          label: "Personal Information",
          color: "text-blue-600",
          bg: "bg-blue-50",
          onClick: () => setEditNameOpen(true),
        },
        {
          icon: Database,
          label: "Health Data & History",
          color: "text-teal-600",
          bg: "bg-teal-50",
          onClick: () => navigate("/logs"),
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
          onClick: () => setChangePasswordOpen(true),
        },
        {
          icon: Bell,
          label: "Notification Preferences",
          color: "text-amber-600",
          bg: "bg-amber-50",
          onClick: () => {},
        },
        {
          icon: Smartphone,
          label: "Connected Devices",
          color: "text-indigo-600",
          bg: "bg-indigo-50",
          onClick: () => {},
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
          onClick: () => {},
        },
        {
          icon: ExternalLink,
          label: "Help & Support",
          color: "text-slate-500",
          bg: "bg-slate-50",
          onClick: () => {},
        },
      ],
    },
  ];

  return (
    <div className="pb-24 min-h-screen bg-slate-50 animate-fade-in">
      {/* Header Profile Section */}
      <header className="bg-white px-6 pt-12 pb-8 text-center border-b border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-primary/5 to-blue-500/5"></div>
        <div className="relative">
          <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-primary/10 shadow-xl shadow-primary/5 p-1">
            <div className="w-full h-full bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-primary">{user?.name?.[0]?.toUpperCase() || "P"}</span>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{user?.name || "Patient"}</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
            {user?.email || "Not logged in"}
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
        {/* Manage Plan */}
        <section>
          <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
            Care Plan
          </h2>
          <button
            onClick={() => navigate("/planner")}
            className="w-full flex items-center justify-between p-5 min-h-[44px] glass-card rounded-3xl hover:bg-white/90 active:scale-[0.98] transition-all duration-150"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center shadow-sm">
                <ClipboardList className="w-5 h-5" />
              </div>
              <span className="text-sm font-bold text-slate-700">Manage Health Plan</span>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-300" />
          </button>
        </section>

        {settingsGroups.map((group, groupIndex) => (
          <section key={groupIndex}>
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 ml-1">
              {group.title}
            </h2>
            <div className="glass-card rounded-3xl overflow-hidden">
              {group.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={item.onClick}
                  className={`w-full flex items-center justify-between p-5 min-h-[44px] hover:bg-white/90 active:scale-[0.98] transition-all duration-150 ${
                    itemIndex !== group.items.length - 1 ? "border-b border-slate-50" : ""
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center shadow-sm`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-sm font-bold text-slate-700">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {"value" in item && item.value && (
                      <span className="text-[10px] text-slate-400 font-bold uppercase">{item.value}</span>
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
              <h3 className="text-sm font-bold text-rose-900">Security Actions</h3>
              <p className="text-[10px] text-rose-700 font-medium">Protect your clinical data</p>
            </div>
          </div>
          <div className="space-y-3">
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to terminate your session?")) {
                  logout();
                  navigate("/login");
                }
              }}
              className="w-full flex items-center justify-center gap-2 p-4 min-h-[44px] bg-white text-rose-500 font-bold rounded-2xl border border-rose-100 shadow-sm hover:bg-rose-500 hover:text-white transition-all active:scale-[0.98] duration-150 text-xs uppercase tracking-widest"
            >
              <LogOut className="w-4 h-4" />
              <span>Terminate Session</span>
            </button>
          </div>
        </section>
      </main>

      {/* Edit Name Modal */}
      {editNameOpen && (
        <EditNameModal
          currentName={user?.name || ""}
          onClose={() => setEditNameOpen(false)}
          onSaved={async () => {
            await refreshUser();
            setEditNameOpen(false);
          }}
        />
      )}

      {/* Change Password Modal */}
      {changePasswordOpen && (
        <ChangePasswordModal onClose={() => setChangePasswordOpen(false)} />
      )}
    </div>
  );
};

export default Profile;
