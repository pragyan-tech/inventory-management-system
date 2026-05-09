import api from "../lib/axios";

export async function fetchCategories() {
  const { data } = await api.get("/categories");
  return data;
}

export async function fetchCategoriesWithCounts() {
  const { data } = await api.get("/categories/with-counts");
  return data;
}

export async function createCategory(category) {
  const { data } = await api.post("/categories", category);
  return data;
}

export async function updateCategory(category) {
  const { data } = await api.put("/categories", category);
  return data;
}

export async function deleteCategory(id) {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
}