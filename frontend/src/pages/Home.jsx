import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Package, DollarSign, AlertTriangle, FolderTree, FileDown, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Layout from "../components/Layout";
import KpiCard from "../components/dashboard/KpiCard";
import { useAuth } from "../context/AuthContext";
import { fetchDashboardSummary } from "../api/analytics";
import { downloadLowStockPdf } from "../api/products";
import StockByCategoryChart from "../components/dashboard/StockByCategoryChart";
import TopProductsChart from "../components/dashboard/TopProductsChart";
import RecentActivity from "../components/dashboard/RecentActivity";

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(value || 0);
}

export default function Home() {
  const { user } = useAuth();
  const [downloading, setDownloading] = useState(false);
  const [threshold, setThreshold] = useState(10);

  const { data: summary, isLoading } = useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: fetchDashboardSummary,
  });

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

        {/* KPI cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <KpiCard
            icon={Package}
            label="Total Products"
            value={formatNumber(summary?.totalProducts)}
            subtitle={`${summary?.totalCategories || 0} categories`}
            accentColor="indigo"
            loading={isLoading}
          />
          <KpiCard
            icon={DollarSign}
            label="Inventory Value"
            value={formatCurrency(summary?.totalInventoryValue)}
            subtitle="Total capital in stock"
            accentColor="green"
            loading={isLoading}
          />
          <KpiCard
            icon={AlertTriangle}
            label="Low Stock"
            value={formatNumber(summary?.lowStockCount)}
            subtitle="Threshold: 10 units"
            accentColor="yellow"
            loading={isLoading}
          />
          <KpiCard
            icon={FolderTree}
            label="Out of Stock"
            value={formatNumber(summary?.outOfStockCount)}
            subtitle="Needs immediate attention"
            accentColor="red"
            loading={isLoading}
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
          <StockByCategoryChart />
          <TopProductsChart />
        </div>
        <RecentActivity />

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