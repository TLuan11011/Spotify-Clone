import React, { useState } from "react";
import { XIcon } from "lucide-react";
interface SleepTimerProps {
  onClose: () => void;
}

const SleepTimer: React.FC<SleepTimerProps> = ({ onClose }) => {
  const [time, setTime] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const handleActivate = () => {
    setIsActive(true);
    // In a real app, this would start the timer countdown
  };
  return <div className="fixed top-16 right-6 w-72 bg-white border border-gray-200 rounded-lg shadow-lg p-4 z-50">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium">Sleep Timer</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <XIcon size={18} />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Stop music after
          </label>
          <div className="flex items-center gap-2">
            <input type="range" min="5" max="120" step="5" value={time} onChange={e => setTime(parseInt(e.target.value))} className="w-full" disabled={isActive} />
            <span className="text-sm font-medium w-12">{time} min</span>
          </div>
        </div>
        <div className="flex justify-between">
          <button onClick={onClose} className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
            Cancel
          </button>
          {isActive ? <button onClick={() => setIsActive(false)} className="px-4 py-2 text-sm bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
              Stop Timer
            </button> : <button onClick={handleActivate} className="px-4 py-2 text-sm bg-gray-800 text-white rounded-lg hover:bg-gray-700">
              Start Timer
            </button>}
        </div>
      </div>
    </div>;
};
export default SleepTimer;