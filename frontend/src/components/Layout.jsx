import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Package, LayoutDashboard, LogOut, History } from "lucide-react";
import AlertsBell from "./AlertsBell";
import Logo from "./Logo";

export default function Layout({ children }) {
  const { user, role, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/products", label: "Products", icon: Package },
    { to: "/history", label: "Stock History", icon: History },
  ];

  // Get initials from email for the avatar
  const initials = user?.email?.slice(0, 2).toUpperCase() || "??";

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900/60 backdrop-blur-xl border-r border-slate-800 flex flex-col">
        {/* Logo header */}
        <div className="p-6 border-b border-slate-800/80">
          <Logo size={28} />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  active
                    ? "bg-emerald-500/10 text-white border border-emerald-500/20"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-white border border-transparent"
                }`}
              >
                <Icon
                  size={18}
                  className={`transition-colors ${
                    active ? "text-emerald-400" : "text-slate-500 group-hover:text-emerald-400"
                  }`}
                />
                {label}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-slate-800/80">
          <div className="flex items-center gap-3 px-2 py-3 mb-2">
            {/* Avatar with gradient */}
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-emerald-500 to-violet-500 flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xs font-semibold">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate font-medium">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold rounded uppercase tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {role}
              </span>
            </div>
          </div>

          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800/50 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto flex flex-col">
        <header className="border-b border-slate-800 bg-slate-900/30 backdrop-blur-sm sticky top-0 z-10">
          <div className="flex items-center justify-end px-8 py-3">
            <AlertsBell />
          </div>
        </header>

        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}