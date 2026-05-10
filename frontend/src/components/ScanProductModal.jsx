import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, ScanLine } from "lucide-react";
import { fetchProducts } from "../api/products";
import Modal from "./Modal";
import BarcodeScanner from "./BarcodeScanner";
import { useState, useCallback, useRef, useEffect } from "react";

export default function ScanProductModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [scanState, setScanState] = useState("scanning");
  const [scannedCode, setScannedCode] = useState(null);
  const [foundProduct, setFoundProduct] = useState(null);
  const [scanKey, setScanKey] = useState(0);

  const isProcessingRef = useRef(false);

  useEffect(() => {
    if (isOpen) {
      isProcessingRef.current = false;
      setScanState("scanning");
      setScannedCode(null);
      setFoundProduct(null);
      setScanKey((k) => k + 1);  // force BarcodeScanner to remount cleanly
    }
  }, [isOpen]);

  const handleScan = useCallback(async (decodedText) => {

    if (isProcessingRef.current) return;
    isProcessingRef.current = true;

    setScanState("searching");
    setScannedCode(decodedText);

    try {
      const result = await fetchProducts({ search: decodedText, page: 0, size: 5 });
      const exact = result.content.find((p) => p.sku === decodedText);
      const match = exact || result.content[0];

      if (match) {
        setFoundProduct(match);
        setScanState("found");
      } else {
        setScanState("not_found");
      }
    } catch (err) {
      setScanState("not_found");
    }
  }, []);

  const handleClose = () => {
    isProcessingRef.current = false;   // <-- reset lock
    setScanState("scanning");
    setScannedCode(null);
    setFoundProduct(null);
    onClose();
  };

  const handleScanAgain = () => {
    isProcessingRef.current = false;
    setScanState("scanning");
    setScannedCode(null);
    setFoundProduct(null);
    setScanKey((k) => k + 1);   // <-- forces fresh BarcodeScanner mount
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Scan Barcode" size="lg">
      <div className="space-y-4">
        {scanState === "scanning" && (
          <BarcodeScanner key={scanKey} onScan={handleScan} />
        )}

        {scanState === "searching" && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-8 text-center">
            <ScanLine className="text-emerald-400 mx-auto mb-3 animate-pulse" size={32} />
            <p className="text-white font-medium">Searching for product...</p>
            <p className="text-slate-400 text-sm font-mono mt-1">{scannedCode}</p>
          </div>
        )}

        {scanState === "found" && foundProduct && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-5">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
              <div className="flex-1">
                <p className="text-green-300 font-medium">Product found</p>
                <p className="text-green-400/70 text-xs mt-0.5 font-mono">Scanned: {scannedCode}</p>
              </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 flex items-center gap-3">
              {foundProduct.imageUrl ? (
                <img
                  src={foundProduct.imageUrl}
                  alt={foundProduct.name}
                  className="w-14 h-14 rounded-lg object-cover bg-slate-900 flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 rounded-lg bg-slate-900 border border-slate-700 flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-medium truncate">{foundProduct.name}</p>
                <p className="text-slate-400 text-xs font-mono">{foundProduct.sku}</p>
                <p className="text-slate-500 text-xs mt-1">
                  {foundProduct.unitsInStock} in stock · ${Number(foundProduct.unitPrice).toFixed(2)}
                </p>
              </div>
            </div>
          </div>
        )}

        {scanState === "not_found" && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <AlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
              <div>
                <p className="text-yellow-300 font-medium">No matching product</p>
                <p className="text-yellow-400/70 text-sm mt-1">
                  No product found with SKU <span className="font-mono">{scannedCode}</span>
                </p>
                <p className="text-yellow-400/70 text-xs mt-3">
                  This might be a new product. You can add it from the Products page.
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>

          {scanState === "found" && (
            <>
              <button
                type="button"
                onClick={handleScanAgain}
                className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-medium transition-colors border border-slate-700"
              >
                Scan Another
              </button>
              <button
                type="button"
                onClick={() => {
                  handleClose();

                  navigate(`/products?highlight=${foundProduct.id}`);
                }}
                className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
              >
                View Product
              </button>
            </>
          )}

          {scanState === "not_found" && (
            <button
              type="button"
              onClick={handleScanAgain}
              className="flex-1 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-colors"
            >
              Scan Again
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}