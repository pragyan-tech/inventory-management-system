import api from "../lib/axios";

export async function fetchProducts({ page = 0, size = 10, sort = "id,desc", search = "" }) {
  const params = { page, size, sort };
  if (search) params.search = search;

  const { data } = await api.get("/products", { params });
  return data;
}

export async function createProduct(product) {
  const { data } = await api.post("/products", product);
  return data;
}

export async function updateProduct(product) {
  const { data } = await api.put("/products", product);
  return data;
}

export async function deleteProduct(id) {
  const { data } = await api.delete(`/products/${id}`);
  return data;
}