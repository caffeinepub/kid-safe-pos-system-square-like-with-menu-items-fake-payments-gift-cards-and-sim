interface QRCodeBadgeProps {
  value: string;
  size?: number;
  showValue?: boolean;
}

export default function QRCodeBadge({ value, size = 200, showValue = true }: QRCodeBadgeProps) {
  // Use Google Charts API to generate QR code
  const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(value)}&chs=${size}x${size}&chld=H|0`;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <img
          src={qrCodeUrl}
          alt="QR Code"
          width={size}
          height={size}
          className="block"
        />
      </div>
      {showValue && (
        <p className="text-xs text-muted-foreground font-mono break-all max-w-full px-2 text-center">
          {value}
        </p>
      )}
    </div>
  );
}
