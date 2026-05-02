import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "../components/Layout";
import { useAuth } from "../context/AuthContext";
import { downloadLowStockPdf } from "../api/products";

export default function Home() {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [threshold, setThreshold] = useState(10);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadLowStockPdf(threshold);
      toast.success("Report downloaded");
    } catch (err) {
      toast.error("Failed to generate report: " + (err.message || "Unknown error"));
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-slate-400 mb-8">Welcome back, {user.email}</p>

        {/* KPI cards (placeholders for Phase 5) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
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
            <p className="text-xs text-slate-500 mt-2">Coming in Phase 5</p>
          </div>
        </div>

        {/* Reports section */}
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h2 className="text-xl font-semibold text-white mb-1">Reports</h2>
          <p className="text-slate-400 text-sm mb-6">Generate downloadable reports for review or distribution</p>

          <div className="bg-slate-900/50 border border-slate-700 rounded-lg p-5">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="flex-1 min-w-[280px]">
                <h3 className="text-white font-medium mb-1">Low Stock Report</h3>
                <p className="text-slate-400 text-sm mb-4">
                  PDF listing products at or below the stock threshold, with category and price details.
                </p>

                <div className="flex items-center gap-2">
                  <label className="text-sm text-slate-400">Threshold:</label>
                  <input
                    type="number"
                    min="0"
                    value={threshold}
                    onChange={(e) => setThreshold(parseInt(e.target.value) || 0)}
                    className="w-20 px-2 py-1 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <span className="text-sm text-slate-500">units or fewer</span>
                </div>
              </div>

              <button
                onClick={handleDownload}
                disabled={downloading}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {downloading ? (
                  <>
                    <Loader2 className="animate-spin" size={16} />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileDown size={16} />
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}