import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400 mb-8">Welcome back, {user.email}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Total Products</p>
            <p className="text-3xl font-bold text-white mt-1">—</p>
            <p className="text-xs text-slate-500 mt-2">Coming in Phase 5</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Inventory Value</p>
            <p className="text-3xl font-bold text-white mt-1">—</p>
            <p className="text-xs text-slate-500 mt-2">Coming in Phase 5</p>
          </div>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
            <p className="text-slate-400 text-sm">Low Stock Alerts</p>
            <p className="text-3xl font-bold text-white mt-1">—</p>
            <p className="text-xs text-slate-500 mt-2">Coming in Phase 6</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}