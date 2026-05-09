import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, FolderTree, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  fetchCategoriesWithCounts,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../api/categories";
import { useAuth } from "../context/AuthContext";
import Modal from "../components/Modal";
import Input from "../components/Input";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";

export default function Categories() {
  const { isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(null);
  const [name, setName] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories", "with-counts"],
    queryFn: fetchCategoriesWithCounts,
  });

  const createMutation = useMutation({
    mutationFn: (categoryName) => createCategory({ categoryName }),
    onSuccess: () => {
      toast.success("Category created");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setIsAddOpen(false);
      setName("");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create category");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (category) => updateCategory(category),
    onSuccess: () => {
      toast.success("Category updated");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      setEditingCategory(null);
      setName("");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to update category");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["categories"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      setDeletingCategory(null);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete category");
    },
  });

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    createMutation.mutate(name.trim());
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    updateMutation.mutate({ id: editingCategory.id, categoryName: name.trim() });
  };

  const openEdit = (category) => {
    setEditingCategory(category);
    setName(category.categoryName);
  };

  const closeEdit = () => {
    setEditingCategory(null);
    setName("");
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Categories</h1>
          <p className="text-slate-400 mt-1">Organize your inventory by type</p>
        </div>
        {isAdmin && (
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
          >
            <Plus size={18} />
            Add Category
          </button>
        )}
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-slate-500" size={32} />
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <p className="text-red-400 font-medium">Failed to load categories</p>
            <p className="text-red-400/70 text-sm mt-1">{error?.message}</p>
          </div>
        </div>
      )}

      {/* Empty state */}
      {data && data.length === 0 && (
        <EmptyState
          icon={FolderTree}
          title="No categories yet"
          description="Create your first category to organize your products."
          action={
            isAdmin && (
              <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
              >
                <Plus size={18} />
                Add your first category
              </button>
            )
          }
        />
      )}

      {/* Grid of category cards */}
      {data && data.length > 0 && (
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.05 },
            },
          }}
        >
          {data.map((category) => (
            <motion.div
              key={category.id}
              variants={{
                hidden: { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="group relative bg-slate-800/50 border border-slate-700 rounded-xl p-5 hover:border-emerald-500/30 transition-all"
            >
              {/* Subtle glow on hover */}
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-gradient-to-br from-emerald-500/20 to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-emerald-500/10">
                    <FolderTree className="text-emerald-400" size={20} />
                  </div>

                  {isAdmin && (
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openEdit(category)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                        title="Edit"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => setDeletingCategory(category)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-red-400 hover:bg-slate-700 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <h3 className="text-white font-semibold text-lg mb-1">
                  {category.categoryName}
                </h3>
                <p className="text-slate-400 text-sm">
                  {category.productCount} {category.productCount === 1 ? "product" : "products"}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Add Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => {
          setIsAddOpen(false);
          setName("");
        }}
        title="Add Category"
        size="sm"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Category name"
            placeholder="e.g., Electronics"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setIsAddOpen(false);
                setName("");
              }}
              className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" loading={createMutation.isPending}>
              Create
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editingCategory !== null}
        onClose={closeEdit}
        title="Edit Category"
        size="sm"
      >
        <form onSubmit={handleEditSubmit} className="space-y-4">
          <Input
            label="Category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={closeEdit}
              className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <Button type="submit" loading={updateMutation.isPending}>
              Update
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete confirmation */}
      <Modal
        isOpen={deletingCategory !== null}
        onClose={() => setDeletingCategory(null)}
        title="Delete Category"
        size="sm"
      >
        {deletingCategory && (
          <div>
            <p className="text-slate-300 mb-2">
              Are you sure you want to delete this category?
            </p>
            <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 mb-4">
              <p className="text-white font-medium">{deletingCategory.categoryName}</p>
              <p className="text-slate-400 text-sm mt-1">
                {deletingCategory.productCount} product{deletingCategory.productCount !== 1 ? "s" : ""}
              </p>
            </div>
            {deletingCategory.productCount > 0 && (
              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-3 mb-4 flex items-start gap-2">
                <AlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={16} />
                <p className="text-yellow-300 text-sm">
                  This category has products. Deleting it may affect those products.
                </p>
              </div>
            )}
            <p className="text-red-400/80 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingCategory(null)}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
                disabled={deleteMutation.isPending}
              >
                Cancel
              </button>
              <button
                onClick={() => deleteMutation.mutate(deletingCategory.id)}
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