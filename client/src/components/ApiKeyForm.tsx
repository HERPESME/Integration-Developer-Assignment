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
    <div className="max-w-lg mx-auto">
      <div className="card">
        <div className="card-content p-8 space-y-6">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Key className="h-6 w-6 text-primary" />
            </div>
            <h2 className="mt-4 text-2xl font-bold tracking-tight text-text-primary">Connect Your Apify Account</h2>
            <p className="mt-2 text-sm text-text-secondary">Enter your API key below to access your actors.</p>
          </div>

          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-text-secondary">
                API Key
              </label>
              <div className="relative mt-1">
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
                  placeholder="apify_api_..."
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-secondary hover:text-text-primary"
                >
                  {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.apiKey && (
                <p className="mt-2 text-sm text-error">{errors.apiKey.message}</p>
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

          <div className="text-center">
            <a
              href="https://console.apify.com/account/integrations"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              <span>Get your API key from Apify Console</span>
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
