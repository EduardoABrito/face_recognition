import React, { useRef, useEffect } from 'react';
import { Camera } from 'lucide-react';

interface DetectedFace {
  id: string;
  name: string;
  confidence: number;
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
}

interface CameraViewProps {
  isActive: boolean;
  status: 'idle' | 'scanning' | 'recognized' | 'failed';
  detectedFaces: DetectedFace[];
}

const CameraView: React.FC<CameraViewProps> = ({ isActive, status, detectedFaces }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let stream: MediaStream | null = null;
    
    if (isActive) {
      const startCamera = async () => {
        try {
          stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
              width: { ideal: 1280 },
              height: { ideal: 720 },
              facingMode: "user" 
            } 
          });
          
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error('Error accessing camera:', err);
        }
      };
      
      startCamera();
    }
    
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [isActive]);

  return (
    <div className="relative bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 shadow-lg">
      <div className="aspect-video bg-black relative">
        {isActive ? (
          <>
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline
              muted
              className={`w-full h-full object-cover ${status === 'scanning' ? 'opacity-90' : 'opacity-100'}`}
            />
            <div ref={overlayRef} className="absolute inset-0">
              {detectedFaces.map((face) => (
                <div
                  key={face.id}
                  className="absolute border-2 border-blue-500"
                  style={{
                    left: `${face.bounds.x}%`,
                    top: `${face.bounds.y}%`,
                    width: `${face.bounds.width}%`,
                    height: `${face.bounds.height}%`,
                  }}
                >
                  <div className="absolute -top-7 left-0 bg-blue-500 px-2 py-1 rounded text-sm font-semibold whitespace-nowrap">
                    {face.name} ({(face.confidence * 100).toFixed(1)}%)
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full">
            <Camera className="w-24 h-24 text-gray-600" />
            <p className="absolute mt-32 text-gray-500">Camera inactive</p>
          </div>
        )}
        
        {status === 'scanning' && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="h-full w-full flex items-center justify-center">
              <div className="absolute w-full h-1 bg-blue-500 opacity-80 animate-scan" />
            </div>
          </div>
        )}
      </div>
      
      {/* Camera status bar */}
      <div className="bg-gray-900 px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          <div className={`w-3 h-3 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
          <span className="text-sm">{isActive ? 'Camera active' : 'Camera inactive'}</span>
        </div>
        <div className="text-sm text-gray-400">
          {status === 'idle' && 'Ready'}
          {status === 'scanning' && 'Scanning...'}
          {status === 'recognized' && `${detectedFaces.length} face(s) detected`}
          {status === 'failed' && 'Detection failed'}
        </div>
      </div>
    </div>
  );
};

export default CameraView;