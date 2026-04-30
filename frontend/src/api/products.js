import api from "../lib/axios";

export async function fetchProducts({ page = 0, size = 10, sort = "id,desc", search = "" }) {
  const params = { page, size, sort };
  if (search) params.search = search;

  const { data } = await api.get("/products", { params });
  return data;
}