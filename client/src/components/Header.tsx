import React from 'react';
import { RefreshCw } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
  showReset: boolean;
}

export const Header: React.FC<HeaderProps> = ({ onReset, showReset }) => {
  return (
    <header className="bg-surface/80 backdrop-blur-lg border-b border-border sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-text-primary">Apify Runner</h1>
              <p className="text-xs text-text-secondary">Dynamic Actor Execution</p>
            </div>
          </div>
          
          {showReset && (
            <button
              onClick={onReset}
              className="inline-flex items-center gap-2 rounded-md bg-surface px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-border hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-offset-2 focus:ring-offset-background"
            >
              <RefreshCw className="h-4 w-4" />
              <span>New Session</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
