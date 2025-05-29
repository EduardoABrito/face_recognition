import React from 'react';
import { Users, BarChart3, Clock } from 'lucide-react';

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

interface ResultsPanelProps {
  detectedFaces: DetectedFace[];
  status: 'idle' | 'scanning' | 'recognized' | 'failed';
}

const ResultsPanel: React.FC<ResultsPanelProps> = ({ detectedFaces, status }) => {
  const getConfidenceColor = (confidence: number) => {
    if (confidence > 0.9) return 'bg-green-500';
    if (confidence > 0.7) return 'bg-blue-500';
    return 'bg-yellow-500';
  };

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 shadow-lg">
      <div className="px-4 py-3 bg-gray-900">
        <h2 className="text-xl font-bold text-gray-200">Recognition Results</h2>
      </div>
      
      <div className="p-4">
        {status === 'scanning' ? (
          <div className="h-48 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-gray-400">Analyzing facial features...</p>
            </div>
          </div>
        ) : status === 'recognized' && detectedFaces.length > 0 ? (
          <div className="space-y-4">
            {detectedFaces.map((face) => (
              <div key={face.id} className="p-4 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center mr-4">
                    <Users className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">{face.name}</h3>
                    <div className="text-xs text-gray-400 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      Face ID: {face.id}
                    </div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-400 flex items-center">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Confidence Score
                    </span>
                    <span className="text-sm font-semibold">{(face.confidence * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2.5">
                    <div 
                      className={`h-2.5 rounded-full ${getConfidenceColor(face.confidence)}`} 
                      style={{ width: `${face.confidence * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="mt-4 p-2 bg-gray-800 rounded border border-gray-700">
                  <p className="text-sm text-blue-400 font-mono">Position: {face.bounds.x.toFixed(1)}%, {face.bounds.y.toFixed(1)}%</p>
                  <p className="text-xs text-gray-400 mt-1">Size: {face.bounds.width.toFixed(1)}% × {face.bounds.height.toFixed(1)}%</p>
                </div>
              </div>
            ))}
          </div>
        ) : status === 'failed' ? (
          <div className="h-48 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block w-16 h-16 rounded-full bg-red-500 bg-opacity-20 flex items-center justify-center mb-4">
                <span className="text-red-500 text-2xl">✗</span>
              </div>
              <p className="text-gray-300 font-semibold">Recognition Failed</p>
              <p className="text-gray-400 text-sm mt-1">Unable to verify identities</p>
              <p className="text-gray-500 text-xs mt-4">Try adjusting lighting or camera position</p>
            </div>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center">
            <div className="text-center">
              <div className="inline-block w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-400">No recognition data</p>
              <p className="text-gray-500 text-sm mt-1">Start the recognition process</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsPanel;