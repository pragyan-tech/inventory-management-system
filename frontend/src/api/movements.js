import api from "../lib/axios";

export async function fetchMovements({ page = 0, size = 20, sort = "createdAt,desc" }) {
  const { data } = await api.get("/movements", {
    params: { page, size, sort },
  });
  return data;
}

export async function fetchProductMovements(productId, { page = 0, size = 20 } = {}) {
  const { data } = await api.get(`/movements/product/${productId}`, {
    params: { page, size },
  });
  return data;
}