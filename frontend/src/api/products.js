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

export async function exportProductsCsv() {
  const response = await api.get("/csv/export/products", {
    responseType: "blob",
  });


  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;


  const contentDisposition = response.headers["content-disposition"];
  const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
  const filename = filenameMatch ? filenameMatch[1] : `products-${new Date().toISOString().split("T")[0]}.csv`;

  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}
export async function importProductsCsv(file) {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await api.post("/csv/import/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}
export async function downloadLowStockPdf(threshold = 10) {
  const response = await api.get("/pdf/low-stock", {
    params: { threshold },
    responseType: "blob",
  });

  const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/pdf" }));
  const link = document.createElement("a");
  link.href = url;

  const contentDisposition = response.headers["content-disposition"];
  const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
  const filename = filenameMatch ? filenameMatch[1] : `low-stock-report-${new Date().toISOString().split("T")[0]}.pdf`;

  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}