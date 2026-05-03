import api from "../lib/axios";

export async function fetchDashboardSummary() {
  const { data } = await api.get("/analytics/summary");
  return data;
}

export async function fetchStockByCategory() {
  const { data } = await api.get("/analytics/stock-by-category");
  return data;
}

export async function fetchTopProducts() {
  const { data } = await api.get("/analytics/top-products");
  return data;
}