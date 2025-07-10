
import React, { useState, useRef, useEffect } from 'react';
import { getNutritionFromBarcode } from '../services/geminiService';
import { ScannedProduct } from '../types';
import { BarcodeIcon, CameraIcon } from './icons';

const BarcodeScanner: React.FC = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<ScannedProduct | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const startScan = async () => {
    setResult(null);
    setError(null);
    setIsScanning(true);
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        // Simulate scanning then getting a result
        setTimeout(() => {
          handleScanSuccess();
        }, 3000);
      } catch (err) {
        console.error("Camera access denied:", err);
        setError("Camera access is required. Please enable it in your browser settings.");
        setIsScanning(false);
      }
    }
  };

  const stopScan = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsScanning(false);
  };
  
  const handleScanSuccess = async () => {
    stopScan();
    setIsLoading(true);
    try {
        const product = await getNutritionFromBarcode();
        setResult(product);
    } catch (err) {
        console.error(err);
        setError("Could not retrieve nutrition information. The AI might be having a moment.");
    } finally {
        setIsLoading(false);
    }
  }
  
  // Cleanup camera on component unmount
  useEffect(() => {
    return () => {
        if(isScanning) {
            stopScan();
        }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isScanning]);


  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <header>
          <h2 className="text-3xl font-bold text-white flex items-center gap-3">
            <BarcodeIcon className="w-8 h-8 text-emerald-400" />
            Barcode Scanner
          </h2>
          <p className="text-gray-400 mt-2">Instantly track macros by scanning a product's barcode.</p>
      </header>

      {!isScanning && !result && (
        <div className="text-center bg-gray-800/60 p-8 rounded-xl border border-gray-700/50">
          <button
            onClick={startScan}
            disabled={isLoading}
            className="bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-emerald-600 disabled:bg-gray-500 transition-colors mx-auto"
          >
            <CameraIcon />
            <span>Start Scanning</span>
          </button>
        </div>
      )}
      
      {isScanning && (
        <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700/50 text-center">
            <div className="relative w-full max-w-lg mx-auto aspect-video bg-gray-900 rounded-lg overflow-hidden">
                <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover"></video>
                <div className="scanner-overlay">
                    <div className="scanner-box">
                        <div className="scanner-line"></div>
                    </div>
                </div>
            </div>
            <p className="mt-4 text-gray-300">Point your camera at a barcode...</p>
            <p className="text-sm text-gray-500">(This is a simulation. A result will be auto-generated.)</p>
            <button onClick={stopScan} className="mt-4 bg-red-600/80 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition-colors">Cancel</button>
        </div>
      )}

      {isLoading && <div className="flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div></div>}
      
      {error && <p className="text-red-400 text-center bg-red-900/50 p-3 rounded-lg">{error}</p>}
      
      {result && (
        <div className="bg-gray-800/60 p-6 rounded-xl border border-gray-700/50 animate-fade-in space-y-6">
          <div>
            <h3 className="text-2xl font-bold text-emerald-400">{result.productName}</h3>
            <p className="text-gray-400 mb-4">Serving Size: {result.servingSize}  |  Servings/Container: {result.servingsPerContainer}</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-center">
              <MacroPill label="Calories" value={result.macrosPerServing.calories} unit="kcal" />
              <MacroPill label="Protein" value={result.macrosPerServing.protein} unit="g" />
              <MacroPill label="Carbs" value={result.macrosPerServing.carbs} unit="g" />
              <MacroPill label="Fat" value={result.macrosPerServing.fat} unit="g" />
            </div>

            <div>
              <h4 className="text-lg font-semibold text-gray-300 mb-2">Ingredients</h4>
              <p className="text-gray-400 italic">
                {result.ingredients.join(', ')}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setResult(null);
              startScan();
            }}
            className="w-full sm:w-auto bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center space-x-2 hover:bg-emerald-600 transition-colors"
          >
            <CameraIcon />
            <span>Scan Another Item</span>
          </button>
        </div>
      )}
    </div>
  );
};

const MacroPill: React.FC<{label: string; value: number; unit: string;}> = ({label, value, unit}) => (
    <div className={`p-4 rounded-lg bg-gray-700/50`}>
        <p className="text-sm text-gray-300">{label}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-xs text-gray-400">{unit}</p>
    </div>
)

export default BarcodeScanner;
