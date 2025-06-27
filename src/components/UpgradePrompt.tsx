import React from 'react';
import { Crown, ArrowRight } from 'lucide-react';

interface UpgradePromptProps {
  onUpgrade: () => void;
  className?: string;
}

export const UpgradePrompt: React.FC<UpgradePromptProps> = ({ onUpgrade, className = '' }) => {
  return (
    <div className={`bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl p-6 text-white ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="bg-white/20 rounded-full p-3">
            <Crown className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Upgrade to Premium</h3>
            <p className="text-purple-100 text-sm">
              Access all specialist doctors and advanced features
            </p>
          </div>
        </div>
        <button
          onClick={onUpgrade}
          className="bg-white text-purple-600 px-6 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors flex items-center space-x-2"
        >
          <span>Upgrade Now</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};