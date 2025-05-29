import React from 'react';
import { Cpu, AlertTriangle, Check, Activity, Users } from 'lucide-react';

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

interface RecognitionStatusProps {
  status: 'idle' | 'scanning' | 'recognized' | 'failed';
  detectedFaces: DetectedFace[];
}

const RecognitionStatus: React.FC<RecognitionStatusProps> = ({ status, detectedFaces }) => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 shadow-lg p-4">
      <div className="flex items-center space-x-4">
        {status === 'idle' && (
          <>
            <div className="w-10 h-10 rounded-lg bg-gray-700 flex items-center justify-center">
              <Cpu className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">System Idle</h3>
              <p className="text-sm text-gray-400">Ready to begin facial recognition</p>
            </div>
          </>
        )}
        
        {status === 'scanning' && (
          <>
            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center animate-pulse">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Processing</h3>
              <p className="text-sm text-gray-400">Analyzing facial features...</p>
              
              <div className="flex space-x-1 mt-1">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          </>
        )}
        
        {status === 'recognized' && (
          <>
            <div className="w-10 h-10 rounded-lg bg-green-600 flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Recognition Successful</h3>
              <p className="text-sm text-gray-400">
                {detectedFaces.length} {detectedFaces.length === 1 ? 'person' : 'people'} identified
              </p>
            </div>
          </>
        )}
        
        {status === 'failed' && (
          <>
            <div className="w-10 h-10 rounded-lg bg-red-600 flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Recognition Failed</h3>
              <p className="text-sm text-gray-400">Unable to match facial patterns</p>
            </div>
          </>
        )}
      </div>
      
      <div className="mt-4 bg-gray-900 rounded-lg p-1 flex">
        {['idle', 'scanning', 'recognized', 'failed'].map((step, index) => (
          <div 
            key={index}
            className={`h-1.5 rounded-full flex-1 mx-0.5 ${
              status === step
                ? step === 'idle' ? 'bg-gray-400' :
                  step === 'scanning' ? 'bg-blue-500 animate-pulse' :
                  step === 'recognized' ? 'bg-green-500' : 'bg-red-500'
                : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
      
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        {['Detected Faces', 'AI Model', 'Response Time', 'Security'].map((label, index) => (
          <div key={index} className="bg-gray-900 p-2 rounded text-center">
            <p className="text-xs text-gray-500">{label}</p>
            <p className="text-sm font-mono text-gray-300">
              {index === 0 && `${detectedFaces.length} Faces`}
              {index === 1 && 'DNNv4'}
              {index === 2 && `${(Math.random() * 100 + 50).toFixed(0)}ms`}
              {index === 3 && 'Level 3'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecognitionStatus;