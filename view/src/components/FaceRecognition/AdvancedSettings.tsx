import React, { useState } from 'react';
import { X, Sliders } from 'lucide-react';

interface AdvancedSettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: { scoreThreshold: number; nmsThreshold: number }) => void;
  initialSettings: {
    scoreThreshold: number;
    nmsThreshold: number;
  };
}

const AdvancedSettings: React.FC<AdvancedSettingsProps> = ({
  isOpen,
  onClose,
  onSave,
  initialSettings,
}) => {
  const [scoreThreshold, setScoreThreshold] = useState(initialSettings.scoreThreshold);
  const [nmsThreshold, setNmsThreshold] = useState(initialSettings.nmsThreshold);

  const handleSave = () => {
    onSave({ scoreThreshold, nmsThreshold });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-md mx-4">
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold flex items-center">
            <Sliders className="w-6 h-6 mr-2" />
            Advanced Settings
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Score Threshold: {scoreThreshold.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={scoreThreshold}
                onChange={(e) => setScoreThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0.00</span>
                <span>1.00</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Minimum confidence score required for face detection
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                NMS Threshold: {nmsThreshold.toFixed(2)}
              </label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={nmsThreshold}
                onChange={(e) => setNmsThreshold(parseFloat(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>0.00</span>
                <span>1.00</span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                Threshold for non-maximum suppression in multiple face detection
              </p>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="flex-1 py-2 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;