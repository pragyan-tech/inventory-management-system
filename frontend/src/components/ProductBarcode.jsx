import Barcode from "react-barcode";

export default function ProductBarcode({ value, size = "md" }) {
  if (!value) return null;

  // Size presets
  const sizes = {
    sm: { width: 1.5, height: 40, fontSize: 12 },
    md: { width: 2, height: 60, fontSize: 14 },
    lg: { width: 2.5, height: 80, fontSize: 16 },
  };
  const config = sizes[size] || sizes.md;

  return (
    <div className="inline-block bg-white p-3 rounded-lg">
      <Barcode
        value={value}
        format="CODE128"
        width={config.width}
        height={config.height}
        fontSize={config.fontSize}
        margin={0}
        background="#ffffff"
        lineColor="#000000"
      />
    </div>
  );
}