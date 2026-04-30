import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Package, LayoutDashboard, LogOut } from "lucide-react";

export default function Layout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { to: "/", label: "Dashboard", icon: LayoutDashboard },
    { to: "/products", label: "Products", icon: Package },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex">

      <aside className="w-64 bg-slate-950 border-r border-slate-800 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold text-white">Inventory</h1>
          <p className="text-xs text-slate-500 mt-1">Management System</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => {
            const active = location.pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="px-3 py-2 mb-2">
            <p className="text-xs text-slate-500">Signed in as</p>
            <p className="text-sm text-white truncate">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>


      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}