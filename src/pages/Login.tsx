import React, { useState } from "react";
import { Mail, Lock, User, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    // Simulate successful login/signup and navigate to dashboard
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-lg shadow-primary/20">
          <Heart className="text-white w-8 h-8" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">HealthTrack</h1>
        <p className="text-slate-500 mt-2">Your personal health companion</p>
      </div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-sm p-8 border border-slate-100">
        <div className="flex bg-slate-100 p-1 rounded-xl mb-8">
          <button
            onClick={() => setIsSignIn(true)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              isSignIn ? "bg-white shadow-sm text-primary" : "text-slate-500"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setIsSignIn(false)}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
              !isSignIn ? "bg-white shadow-sm text-primary" : "text-slate-500"
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isSignIn && (
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              required
            />
          </div>

          {!isSignIn && (
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                required
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-4 bg-primary text-white font-semibold rounded-xl shadow-lg shadow-primary/20 hover:bg-blue-700 active:scale-[0.98] transition-all mt-4"
          >
            {isSignIn ? "Sign In" : "Create Account"}
          </button>
        </form>

        {isSignIn && (
          <div className="mt-6 text-center">
            <button className="text-sm font-medium text-slate-500 hover:text-primary transition-colors">
              Forgot Password?
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
          Quick Access (Guest View)
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm hover:border-primary hover:text-primary transition-all"
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate("/logs")}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm hover:border-primary hover:text-primary transition-all"
          >
            Health Logs
          </button>
          <button
            onClick={() => navigate("/profile")}
            className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 shadow-sm hover:border-primary hover:text-primary transition-all"
          >
            Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
