import { useState, useRef } from "react";
import { Upload, X, ImageIcon, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { uploadImage, transformImage } from "../lib/cloudinary";

export default function ImageUpload({ value, onChange, label = "Product Image" }) {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    // Client-side validation
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be smaller than 5MB");
      return;
    }

    setUploading(true);
    setProgress(0);

    try {
      const url = await uploadImage(file, setProgress);
      onChange(url);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-slate-300 mb-1.5">
        {label}
      </label>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
      />

      {value ? (
        // Image preview state
        <div className="relative group">
          <div className="bg-slate-800 border border-slate-700 rounded-lg overflow-hidden aspect-video flex items-center justify-center">
            <img
              src={transformImage(value, { width: 600, height: 400, crop: "limit" })}
              alt="Product"
              className="max-w-full max-h-full object-contain"
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-slate-900/90 backdrop-blur-sm hover:bg-slate-800 text-white text-xs rounded-lg font-medium transition-colors"
              disabled={uploading}
            >
              Replace
            </button>
            <button
              type="button"
              onClick={handleRemove}
              className="p-1.5 bg-red-600/90 backdrop-blur-sm hover:bg-red-700 text-white rounded-lg transition-colors"
              disabled={uploading}
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : (
        // Empty drop zone state
        <div
          onClick={() => !uploading && fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`
            border-2 border-dashed rounded-lg aspect-video flex flex-col items-center justify-center cursor-pointer transition-colors
            ${isDragging
              ? "border-indigo-500 bg-indigo-500/5"
              : "border-slate-700 hover:border-slate-600 bg-slate-800/30"}
            ${uploading ? "cursor-not-allowed" : ""}
          `}
        >
          {uploading ? (
            <>
              <Loader2 className="text-emerald-400 animate-spin mb-3" size={32} />
              <p className="text-sm text-slate-400">Uploading... {progress}%</p>
              <div className="w-48 h-1 bg-slate-700 rounded-full mt-2 overflow-hidden">
                <div
                  className="h-full bg-indigo-500 transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <div className="bg-slate-700/50 rounded-full p-3 mb-3">
                <ImageIcon className="text-slate-400" size={24} />
              </div>
              <p className="text-sm text-slate-300 font-medium mb-1">
                Drop an image here or click to browse
              </p>
              <p className="text-xs text-slate-500">PNG, JPG, WebP up to 5MB</p>
            </>
          )}
        </div>
      )}
    </div>
  );
}