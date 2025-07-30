import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Key, Eye, EyeOff, ExternalLink } from 'lucide-react';

interface ApiKeyFormProps {
  onSubmit: (apiKey: string) => void;
  loading: boolean;
}

interface FormData {
  apiKey: string;
}

export const ApiKeyForm: React.FC<ApiKeyFormProps> = ({ onSubmit, loading }) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data.apiKey.trim());
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="card p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Key className="w-8 h-8 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome to Apify Integration</h2>
          <p className="text-gray-600">Enter your Apify API key to get started</p>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                {...register('apiKey', {
                  required: 'API key is required',
                  minLength: {
                    value: 10,
                    message: 'API key must be at least 10 characters'
                  }
                })}
                type={showApiKey ? 'text' : 'password'}
                id="apiKey"
                className="input-field pr-10"
                placeholder="Enter your Apify API key"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowApiKey(!showApiKey)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {errors.apiKey && (
              <p className="text-error-600 text-sm mt-1">{errors.apiKey.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Authenticating...' : 'Connect to Apify'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-2">Don't have an API key?</p>
            <a
              href="https://console.apify.com/account/integrations"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Get your API key from Apify Console
              <ExternalLink className="w-4 h-4 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
