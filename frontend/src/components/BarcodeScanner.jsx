import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Camera, AlertCircle } from "lucide-react";

const SCANNER_ELEMENT_ID = "barcode-scanner-element";

export default function BarcodeScanner({ onScan, onError }) {
  const scannerRef = useRef(null);
  const [status, setStatus] = useState("starting");
  const [errorMessage, setErrorMessage] = useState("");
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;

    const startScanner = async () => {
      try {
        const html5QrCode = new Html5Qrcode(SCANNER_ELEMENT_ID);
        scannerRef.current = html5QrCode;

        await html5QrCode.start(
          { facingMode: "environment" },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.333,
          },
          (decodedText) => {
            onScan(decodedText);
          },
          () => {
          }
        );

        if (isMountedRef.current) {
          setStatus("running");
        }
      } catch (err) {
        const message = err.message || String(err);
        if (isMountedRef.current) {
          setStatus("error");
          setErrorMessage(message);
          if (onError) onError(message);
        }
      }
    };

    startScanner();

    return () => {
      isMountedRef.current = false;
      if (scannerRef.current) {
        const scanner = scannerRef.current;
        scannerRef.current = null;

        if (scanner.isScanning) {
          scanner.stop()
            .then(() => scanner.clear())
            .catch(() => {});
        }
      }
    };
  }, [onScan, onError]);

  return (
    <div className="w-full">
      <div
        id={SCANNER_ELEMENT_ID}
        className="w-full rounded-lg overflow-hidden bg-slate-900 mb-3"
      />

      {/* Status indicator */}
      {status === "starting" && (
        <div className="flex items-center gap-2 text-slate-400 text-sm">
          <Camera className="animate-pulse" size={16} />
          Starting camera...
        </div>
      )}

      {status === "running" && (
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Scanning... point camera at a barcode
        </div>
      )}

      {status === "error" && (
        <div className="flex items-start gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">
          <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Camera error</p>
            <p className="text-red-400/80 text-xs mt-0.5">{errorMessage}</p>
          </div>
        </div>
      )}
    </div>
  );
}