import React from 'react';
import { Play, Square, RotateCcw, Settings, UserPlus } from 'lucide-react';

interface ControlPanelProps {
  isActive: boolean;
  status: 'idle' | 'scanning' | 'recognized' | 'failed';
  onStart: () => void;
  onStop: () => void;
  onReset: () => void;
  onRegister: () => void;
  onSettings: () => void;
}

const ControlPanel: React.FC<ControlPanelProps> = ({
  isActive,
  status,
  onStart,
  onStop,
  onReset,
  onRegister,
  onSettings
}) => {
  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden border-2 border-gray-700 shadow-lg">
      <div className="px-4 py-3 bg-gray-900">
        <h2 className="text-xl font-bold text-gray-200">Control Panel</h2>
      </div>
      
      <div className="p-4 space-y-6">
        {/* Main controls */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onStart}
            disabled={isActive}
            className={`flex items-center justify-center py-3 px-4 rounded-lg ${
              isActive 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            } transition-all duration-300`}
          >
            <Play className="w-5 h-5 mr-2" />
            <span>Start</span>
          </button>
          
          <button
            onClick={onStop}
            disabled={!isActive}
            className={`flex items-center justify-center py-3 px-4 rounded-lg ${
              !isActive 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            } transition-all duration-300`}
          >
            <Square className="w-5 h-5 mr-2" />
            <span>Stop</span>
          </button>
          
          <button
            onClick={onReset}
            className="col-span-2 flex items-center justify-center py-3 px-4 rounded-lg 
                      bg-gray-700 hover:bg-gray-600 text-white transition-all duration-300"
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            <span>Reset</span>
          </button>
        </div>
        
        {/* Status indicator */}
        <div className="bg-gray-900 p-4 rounded-lg">
          <h3 className="text-sm uppercase tracking-wider text-gray-400 mb-2">System Status</h3>
          <div className="flex items-center">
            <div className={`w-4 h-4 rounded-full mr-3 ${
              status === 'idle' ? 'bg-gray-400' : 
              status === 'scanning' ? 'bg-blue-500 animate-pulse' : 
              status === 'recognized' ? 'bg-green-500' : 'bg-red-500'
            }`}></div>
            <span className="font-semibold">
              {status === 'idle' && 'Idle'}
              {status === 'scanning' && 'Scanning'}
              {status === 'recognized' && 'Recognition Complete'}
              {status === 'failed' && 'Recognition Failed'}
            </span>
          </div>
        </div>
        
        {/* Register new face button */}
        <button
          onClick={onRegister}
          className="w-full flex items-center justify-center py-3 px-4 rounded-lg 
                    bg-green-600 hover:bg-green-700 text-white transition-all duration-300"
        >
          <UserPlus className="w-5 h-5 mr-2" />
          <span>Register New Face</span>
        </button>
        
        {/* Advanced settings button */}
        <button
          onClick={onSettings}
          className="w-full flex items-center justify-center py-3 px-4 rounded-lg 
                    border border-gray-600 text-gray-300 hover:bg-gray-700 
                    transition-all duration-300"
        >
          <Settings className="w-5 h-5 mr-2" />
          <span>Advanced Settings</span>
        </button>
      </div>
    </div>
  );
};

export default ControlPanel;