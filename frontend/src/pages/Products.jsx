import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Search, Loader2, AlertCircle, Plus, Pencil, Trash2, History } from "lucide-react";
import { toast } from "sonner";
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "../api/products";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import ProductForm from "../components/ProductForm";
import { Link } from "react-router-dom";


export default function Products() {
  const { isManager, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [deletingProduct, setDeletingProduct] = useState(null);


  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", { page, search }],
    queryFn: () => fetchProducts({ page, size: 10, search }),
    keepPreviousData: true,
  });


  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      toast.success("Product created successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setIsAddModalOpen(false);
    },
    onError: (err) => {
      const message = err.response?.data?.message || "Failed to create product";
      toast.error(message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: updateProduct,
    onSuccess: () => {
      toast.success("Product updated successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setEditingProduct(null);
    },
    onError: (err) => {
      const message = err.response?.data?.message || "Failed to update product";
      toast.error(message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      toast.success("Product deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeletingProduct(null);
    },
    onError: (err) => {
      const message = err.response?.data?.message || "Failed to delete product";
      toast.error(message);
    },
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(0);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Products</h1>
          <p className="text-slate-400 mt-1">Manage your inventory</p>
        </div>
        {isManager && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus size={18} />
            Add Product
          </button>
        )}
      </div>

      {/* Search bar */}
      <form onSubmit={handleSearch} className="mb-6 flex gap-2">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input
            type="text"
            placeholder="Search by name, SKU, or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full pl-10 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          Search
        </button>
      </form>


      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-slate-500" size={32} />
        </div>
      )}


      {isError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-red-400 font-medium">Failed to load products</p>
            <p className="text-red-400/70 text-sm mt-1">{error?.message}</p>
          </div>
        </div>
      )}

      {/* Products table */}
      {data && (
        <>
          <div className="bg-slate-800/50 border border-slate-700 rounded-xl overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-3">SKU</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Category</th>
                  <th className="px-6 py-3 text-right">Price</th>
                  <th className="px-6 py-3 text-right">Stock</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.content.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center text-slate-500">
                      No products found
                    </td>
                  </tr>
                ) : (
                  data.content.map((product) => (
                    <tr key={product.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-400 font-mono">{product.sku}</td>
                      <td className="px-6 py-4 text-sm text-white font-medium">{product.name}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{product.category?.categoryName ?? "—"}</td>
                      <td className="px-6 py-4 text-sm text-white text-right">
                        ${Number(product.unitPrice).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          product.unitsInStock > 10
                            ? "bg-green-500/20 text-green-400"
                            : product.unitsInStock > 0
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                        }`}>
                          {product.unitsInStock} in stock
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-right">
                        <div className="flex justify-end gap-3">
                          <Link
                            to={`/history?productId=${product.id}`}
                            className="text-slate-400 hover:text-white inline-flex items-center gap-1 transition-colors"
                          >
                            <History size={14} />
                            History
                          </Link>
                          {isManager && (
                            <button
                              onClick={() => setEditingProduct(product)}
                              className="text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
                            >
                              <Pencil size={14} />
                              Edit
                            </button>
                          )}
                          {isAdmin && (
                            <button
                              onClick={() => setDeletingProduct(product)}
                              className="text-red-400 hover:text-red-300 inline-flex items-center gap-1 transition-colors"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Page {data.number + 1} of {data.totalPages} · {data.totalElements} total
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={data.first}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={data.last}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}


      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
        size="lg"
      >
        <ProductForm
          onSubmit={(data) => createMutation.mutateAsync(data)}
          onCancel={() => setIsAddModalOpen(false)}
          submitLabel="Create Product"
        />
      </Modal>
      {/* Edit Product Modal */}
      <Modal
        isOpen={editingProduct !== null}
        onClose={() => setEditingProduct(null)}
        title="Edit Product"
        size="lg"
      >
        {editingProduct && (
          <ProductForm
            initialValues={{
              id: editingProduct.id,
              sku: editingProduct.sku,
              name: editingProduct.name,
              description: editingProduct.description || "",
              unitPrice: editingProduct.unitPrice,
              unitsInStock: editingProduct.unitsInStock,
              categoryId: editingProduct.category?.id || "",
            }}
            onSubmit={(data) => updateMutation.mutateAsync(data)}
            onCancel={() => setEditingProduct(null)}
            submitLabel="Update Product"
          />
        )}
      </Modal>
      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deletingProduct !== null}
        onClose={() => setDeletingProduct(null)}
        title="Delete Product"
        size="sm"
      >
        {deletingProduct && (
          <div>
            <p className="text-slate-300 mb-2">
              Are you sure you want to delete this product?
            </p>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 mb-6">
              <p className="text-white font-medium">{deletingProduct.name}</p>
              <p className="text-slate-400 text-sm font-mono mt-1">{deletingProduct.sku}</p>
            </div>
            <p className="text-red-400/80 text-sm mb-6">
              This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingProduct(null)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deletingProduct.id)}
                disabled={deleteMutation.isPending}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}