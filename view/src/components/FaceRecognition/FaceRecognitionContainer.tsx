import React from 'react';
import CameraView from './CameraView';
import RecognitionStatus from './RecognitionStatus';
import ControlPanel from './ControlPanel';
import ResultsPanel from './ResultsPanel';
import FaceRegistration from './FaceRegistration';
import AdvancedSettings from './AdvancedSettings';

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

interface RegisteredFace {
  id: string;
  name: string;
  imageData: string;
}

const FaceRecognitionContainer: React.FC = () => {
  const [isActive, setIsActive] = React.useState(false);
  const [recognitionStatus, setRecognitionStatus] = React.useState<'idle' | 'scanning' | 'recognized' | 'failed'>('idle');
  const [detectedFaces, setDetectedFaces] = React.useState<DetectedFace[]>([]);
  const [registeredFaces, setRegisteredFaces] = React.useState<RegisteredFace[]>([]);
  const [isRegistrationOpen, setIsRegistrationOpen] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [settings, setSettings] = React.useState({
    scoreThreshold: 0.5,
    nmsThreshold: 0.3
  });

  // Simulate recognition process (replace with actual integration)
  const startRecognition = () => {
    setIsActive(true);
    setRecognitionStatus('scanning');
    
    // Simulate detecting multiple faces using the current settings
    setTimeout(() => {
      if (Math.random() > settings.scoreThreshold) {
        const numberOfFaces = Math.floor(Math.random() * 3) + 1;
        const newFaces: DetectedFace[] = Array.from({ length: numberOfFaces }).map((_, index) => ({
          id: `face-${index}`,
          name: registeredFaces[index]?.name || `Person ${index + 1}`,
          confidence: settings.scoreThreshold + Math.random() * (1 - settings.scoreThreshold),
          bounds: {
            x: 20 + (index * 25),
            y: 20,
            width: 20,
            height: 25
          }
        }));
        
        setDetectedFaces(newFaces);
        setRecognitionStatus('recognized');
      } else {
        setRecognitionStatus('failed');
        setDetectedFaces([]);
      }
    }, 3000);
  };

  const stopRecognition = () => {
    setIsActive(false);
    setRecognitionStatus('idle');
    setDetectedFaces([]);
  };

  const resetRecognition = () => {
    setDetectedFaces([]);
    setRecognitionStatus('idle');
  };

  const handleRegisterFace = (name: string, imageData: string) => {
    const newFace: RegisteredFace = {
      id: `reg-${Date.now()}`,
      name,
      imageData
    };
    setRegisteredFaces(prev => [...prev, newFace]);
  };

  const handleSettingsSave = (newSettings: { scoreThreshold: number; nmsThreshold: number }) => {
    setSettings(newSettings);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">
            Multi-Face Recognition System
          </h1>
          <p className="text-gray-400 mt-2">
            Advanced facial recognition with multiple subject detection
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <CameraView 
              isActive={isActive} 
              status={recognitionStatus}
              detectedFaces={detectedFaces}
            />
            <RecognitionStatus 
              status={recognitionStatus}
              detectedFaces={detectedFaces}
            />
          </div>
          
          <div className="lg:col-span-1 space-y-6">
            <ControlPanel 
              isActive={isActive}
              onStart={startRecognition}
              onStop={stopRecognition}
              onReset={resetRecognition}
              onRegister={() => setIsRegistrationOpen(true)}
              onSettings={() => setIsSettingsOpen(true)}
              status={recognitionStatus}
            />
            <ResultsPanel 
              detectedFaces={detectedFaces}
              status={recognitionStatus}
            />
          </div>
        </div>
        
        <footer className="mt-8 text-center text-gray-500 text-sm">
          <p>© 2025 Multi-Face Recognition Interface • Powered by Advanced AI</p>
        </footer>
      </div>

      <FaceRegistration
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onRegister={handleRegisterFace}
      />

      <AdvancedSettings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSettingsSave}
        initialSettings={settings}
      />
    </div>
  );
};

export default FaceRecognitionContainer;