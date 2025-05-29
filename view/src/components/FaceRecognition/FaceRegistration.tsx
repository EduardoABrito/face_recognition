import React, { useState, useRef } from 'react';
import { Camera, X, UserPlus, Check } from 'lucide-react';

interface FaceRegistrationProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (name: string, imageData: string) => void;
}

const FaceRegistration: React.FC<FaceRegistrationProps> = ({ isOpen, onClose, onRegister }) => {
  const [name, setName] = useState('');
  const [step, setStep] = useState<'info' | 'capture'>('info');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: "user"
        }
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  const handleNext = () => {
    if (step === 'info' && name.trim()) {
      setStep('capture');
      startCamera();
    }
  };

  const handleCapture = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg');
        setCapturedImage(imageData);
      }
    }
  };

  const handleRegister = () => {
    if (name && capturedImage) {
      onRegister(name, capturedImage);
      handleClose();
    }
  };

  const handleClose = () => {
    setName('');
    setStep('info');
    setCapturedImage(null);
    stopCamera();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-lg mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold flex items-center">
            <UserPlus className="w-6 h-6 mr-2" />
            Register New Face
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          {step === 'info' ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="name\" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                  placeholder="Enter person's name"
                />
              </div>
              <button
                onClick={handleNext}
                disabled={!name.trim()}
                className={`w-full py-2 rounded-lg flex items-center justify-center ${
                  name.trim() 
                    ? 'bg-blue-600 hover:bg-blue-700' 
                    : 'bg-gray-700 cursor-not-allowed'
                }`}
              >
                Next
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
                {!capturedImage ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src={capturedImage}
                    alt="Captured face"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              
              <div className="flex space-x-3">
                {!capturedImage ? (
                  <button
                    onClick={handleCapture}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg flex items-center justify-center"
                  >
                    <Camera className="w-5 h-5 mr-2" />
                    Capture
                  </button>
                ) : (
                  <>
                    <button
                      onClick={() => setCapturedImage(null)}
                      className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg"
                    >
                      Retake
                    </button>
                    <button
                      onClick={handleRegister}
                      className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center"
                    >
                      <Check className="w-5 h-5 mr-2" />
                      Register
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaceRegistration;