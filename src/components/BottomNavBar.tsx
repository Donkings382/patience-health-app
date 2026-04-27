import React from "react";
import { NavLink } from "react-router-dom";
import { Home, BookOpen, User } from "lucide-react";

const BottomNavBar: React.FC = () => {
  const navItems = [
    { icon: Home, label: "Dashboard", path: "/dashboard" },
    { icon: BookOpen, label: "Logs", path: "/logs" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 px-6 py-3 flex justify-around items-center z-50">
      {navItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 transition-colors ${
              isActive ? "text-primary" : "text-slate-400"
            }`
          }
        >
          <item.icon className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-wider">
            {item.label}
          </span>
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavBar;
