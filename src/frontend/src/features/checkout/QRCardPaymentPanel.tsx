import { useState, useEffect } from 'react';
import { Camera, Keyboard, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useQRScanner } from '../../qr-code/useQRScanner';

interface QRCardPaymentPanelProps {
  onScanned: (qrPayload: string) => void;
  isValidating: boolean;
  validationError: string | null;
}

export default function QRCardPaymentPanel({
  onScanned,
  isValidating,
  validationError,
}: QRCardPaymentPanelProps) {
  const [useManualEntry, setUseManualEntry] = useState(false);
  const [manualToken, setManualToken] = useState('');
  const [hasScanned, setHasScanned] = useState(false);

  const {
    qrResults,
    isScanning,
    isActive,
    isSupported,
    error: cameraError,
    isLoading,
    canStartScanning,
    startScanning,
    stopScanning,
    videoRef,
    canvasRef,
    retry,
  } = useQRScanner({
    facingMode: 'environment',
    scanInterval: 100,
    maxResults: 1,
  });

  useEffect(() => {
    if (qrResults.length > 0 && !hasScanned && !isValidating) {
      const latestResult = qrResults[0];
      setHasScanned(true);
      onScanned(latestResult.data);
    }
  }, [qrResults, hasScanned, isValidating, onScanned]);

  useEffect(() => {
    if (validationError) {
      setHasScanned(false);
    }
  }, [validationError]);

  const handleManualSubmit = () => {
    if (manualToken.trim()) {
      onScanned(manualToken.trim());
    }
  };

  const handleSwitchToManual = async () => {
    if (isActive) {
      await stopScanning();
    }
    setUseManualEntry(true);
  };

  const handleSwitchToScanner = () => {
    setUseManualEntry(false);
    setManualToken('');
    setHasScanned(false);
  };

  if (isSupported === false || (cameraError && cameraError.type === 'not-supported')) {
    return (
      <div className="space-y-4">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Camera not supported on this device. Please enter your card token manually.
          </AlertDescription>
        </Alert>
        <div className="space-y-2">
          <Label htmlFor="manualToken">Card Token</Label>
          <Input
            id="manualToken"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            placeholder="Enter QR code token"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleManualSubmit();
              }
            }}
          />
        </div>
        <Button onClick={handleManualSubmit} disabled={!manualToken.trim() || isValidating} className="w-full">
          {isValidating ? 'Validating...' : 'Submit Token'}
        </Button>
      </div>
    );
  }

  if (useManualEntry) {
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="manualToken">Card Token</Label>
          <Input
            id="manualToken"
            value={manualToken}
            onChange={(e) => setManualToken(e.target.value)}
            placeholder="Enter QR code token"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleManualSubmit();
              }
            }}
          />
        </div>
        <div className="flex gap-2">
          <Button onClick={handleManualSubmit} disabled={!manualToken.trim() || isValidating} className="flex-1">
            {isValidating ? 'Validating...' : 'Submit Token'}
          </Button>
          <Button variant="outline" onClick={handleSwitchToScanner}>
            <Camera className="w-4 h-4 mr-2" />
            Use Scanner
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Alert>
        <Camera className="h-4 w-4" />
        <AlertDescription>
          {isActive
            ? 'Point your camera at the QR code on your custom credit card'
            : 'Start the scanner to scan your custom credit card QR code'}
        </AlertDescription>
      </Alert>

      <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '4/3', minHeight: '300px' }}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          playsInline
          muted
          style={{ display: isActive ? 'block' : 'none' }}
        />
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!isActive && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <Camera className="w-16 h-16 text-muted-foreground opacity-50" />
          </div>
        )}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Initializing camera...</p>
            </div>
          </div>
        )}
        {hasScanned && isValidating && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-sm">Validating card...</p>
            </div>
          </div>
        )}
        {qrResults.length > 0 && !isValidating && !validationError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-center text-white">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-2" />
              <p className="text-sm">Card scanned successfully!</p>
            </div>
          </div>
        )}
      </div>

      {cameraError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            {cameraError.message}
            {cameraError.type === 'permission' && ' Please allow camera access to scan QR codes.'}
          </AlertDescription>
        </Alert>
      )}

      <div className="flex gap-2">
        {!isActive && !cameraError && (
          <Button onClick={startScanning} disabled={!canStartScanning} className="flex-1">
            <Camera className="w-4 h-4 mr-2" />
            {isLoading ? 'Starting...' : 'Start Scanner'}
          </Button>
        )}
        {isActive && (
          <Button onClick={stopScanning} disabled={isLoading} variant="outline" className="flex-1">
            Stop Scanner
          </Button>
        )}
        {cameraError && cameraError.type !== 'not-supported' && (
          <Button onClick={retry} disabled={isLoading} className="flex-1">
            Retry Camera
          </Button>
        )}
        <Button variant="outline" onClick={handleSwitchToManual}>
          <Keyboard className="w-4 h-4 mr-2" />
          Manual Entry
        </Button>
      </div>
    </div>
  );
}
