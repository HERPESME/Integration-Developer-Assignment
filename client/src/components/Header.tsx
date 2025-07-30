import React from 'react';
import { RefreshCw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  showReset: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, showReset }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Apify Integration</h1>
              <p className="text-sm text-gray-600">Professional Actor Execution Platform</p>
            </div>
          </div>
          
          {showReset && (
            <button
              onClick={onReset}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <RefreshCw className="w-4 h-4" />
              <span>New Session</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
