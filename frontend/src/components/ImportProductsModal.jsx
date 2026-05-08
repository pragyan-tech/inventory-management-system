import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { importProductsCsv } from "../api/products";
import Modal from "./Modal";

export default function ImportProductsModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const importMutation = useMutation({
    mutationFn: importProductsCsv,
    onSuccess: (data) => {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ["products"] });
      if (data.errorCount === 0) {
        toast.success(`Imported ${data.successCount} products`);
      } else if (data.successCount > 0) {
        toast.warning(`Imported ${data.successCount} of ${data.totalRows} rows`);
      } else {
        toast.error("Import failed: no rows imported");
      }
    },
    onError: (err) => {
      toast.error("Import failed: " + (err.response?.data?.message || err.message));
    },
  });

  const handleFile = (file) => {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".csv")) {
      toast.error("Please select a .csv file");
      return;
    }
    setSelectedFile(file);
    setResult(null);
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setResult(null);
    onClose();
  };

  const handleImport = () => {
    if (selectedFile) {
      importMutation.mutate(selectedFile);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Import Products from CSV" size="lg">
      <div className="space-y-4">
        {/* File picker / drop zone */}
        {!result && (
          <>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              onChange={handleFileInput}
              className="hidden"
            />

            {selectedFile ? (
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center gap-3">
                <FileText className="text-emerald-400 flex-shrink-0" size={24} />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium truncate">{selectedFile.name}</p>
                  <p className="text-slate-500 text-sm">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                </div>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="text-slate-400 hover:text-white text-sm"
                  disabled={importMutation.isPending}
                >
                  Change
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
                className={`
                  border-2 border-dashed rounded-lg py-12 px-6 text-center cursor-pointer transition-colors
                  ${isDragging
                    ? "border-indigo-500 bg-indigo-500/5"
                    : "border-slate-700 hover:border-slate-600 bg-slate-800/30"}
                `}
              >
                <Upload className="text-slate-400 mx-auto mb-3" size={32} />
                <p className="text-slate-300 font-medium">Drop a CSV file here or click to browse</p>
                <p className="text-slate-500 text-sm mt-1">Required columns: sku, name, description, unit_price, units_in_stock, category_name</p>
              </div>
            )}

            {/* Helper text */}
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-3">
              <p className="text-sm text-slate-300 font-medium mb-1">How it works</p>
              <ul className="text-xs text-slate-400 space-y-1 list-disc list-inside">
                <li>Existing SKUs will be updated</li>
                <li>New SKUs will be created</li>
                <li>Categories must already exist</li>
                <li>Invalid rows will be skipped (you'll see errors below)</li>
              </ul>
            </div>
          </>
        )}

        {/* Result display */}
        {result && (
          <div className="space-y-3">
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-slate-800 border border-slate-700 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-white">{result.totalRows}</p>
                <p className="text-xs text-slate-400 mt-1">Total rows</p>
              </div>
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-400">{result.successCount}</p>
                <p className="text-xs text-green-400/70 mt-1">Imported</p>
              </div>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-red-400">{result.errorCount}</p>
                <p className="text-xs text-red-400/70 mt-1">Failed</p>
              </div>
            </div>

            {result.errorCount === 0 ? (
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle className="text-green-400 flex-shrink-0" size={20} />
                <p className="text-green-300">All rows imported successfully</p>
              </div>
            ) : (
              <>
                <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 flex items-start gap-3">
                  <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={18} />
                  <p className="text-red-300 text-sm">Some rows could not be imported. Review the errors below.</p>
                </div>
                <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-900 text-left text-xs uppercase tracking-wider text-slate-400">
                      <tr>
                        <th className="px-4 py-2">Row</th>
                        <th className="px-4 py-2">SKU</th>
                        <th className="px-4 py-2">Error</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {result.errors.map((err, i) => (
                        <tr key={i}>
                          <td className="px-4 py-2 text-sm text-slate-400">{err.rowNumber}</td>
                          <td className="px-4 py-2 text-sm text-white font-mono">{err.sku || "—"}</td>
                          <td className="px-4 py-2 text-sm text-red-400">{err.error}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        )}

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
            disabled={importMutation.isPending}
          >
            {result ? "Done" : "Cancel"}
          </button>
          {!result && (
            <button
              type="button"
              onClick={handleImport}
              disabled={!selectedFile || importMutation.isPending}
              className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {importMutation.isPending ? (
                <>
                  <Loader2 className="animate-spin" size={16} />
                  Importing...
                </>
              ) : (
                "Import"
              )}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}