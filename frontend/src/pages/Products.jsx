import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, Loader2, AlertCircle } from "lucide-react";
import { fetchProducts } from "../api/products";

export default function Products() {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["products", { page, search }],
    queryFn: () => fetchProducts({ page, size: 10, search }),
    keepPreviousData: true,
  });

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(0);
  };

  return (
    <div className="p-8">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">Products</h1>
        <p className="text-slate-400 mt-1">Manage your inventory</p>
      </div>


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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {data.content.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
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
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>


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
    </div>
  );
}