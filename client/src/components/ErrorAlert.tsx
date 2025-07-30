import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorAlertProps {
  message: string;
  onClose: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onClose }) => {
  if (!message) return null;

  return (
    <div className="alert alert-error mb-6">
      <AlertCircle className="h-5 w-5" />
      <div className="flex-1">
        <h3 className="font-bold">An Error Occurred</h3>
        <p className="text-xs">{message}</p>
      </div>
      <button onClick={onClose} className="btn-icon btn-sm">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
