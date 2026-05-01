import api from "../lib/axios";

export async function fetchCategories() {
  const { data } = await api.get("/categories");
  return data;
}