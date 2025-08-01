import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="flex items-center space-x-3">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
        <span className="text-text-secondary">Loading...</span>
      </div>
    </div>
  );
};
