import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Play, Info, AlertTriangle } from 'lucide-react';
import { Actor, ActorSchema } from '../types';

interface SchemaFormProps {
  actor: Actor;
  schema: ActorSchema;
  onSubmit: (input: any) => void;
  onBack: () => void;
  loading: boolean;
}

export const SchemaForm: React.FC<SchemaFormProps> = ({ 
  actor, 
  schema, 
  onSubmit, 
  onBack, 
  loading 
}) => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm();

  const properties = schema.schema.properties || {};
  const required = schema.schema.required || [];

  useEffect(() => {
    // Set default values from schema
    Object.entries(properties).forEach(([key, prop]: [string, any]) => {
      if (prop.default !== undefined) {
        setValue(key, prop.default);
        setFormData(prev => ({ ...prev, [key]: prop.default }));
      }
    });
  }, [properties, setValue]);

  const handleFormSubmit = (data: any) => {
    // Clean up the data - remove empty strings and null values
    const cleanedData: Record<string, any> = {};
    Object.entries(data).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined) {
        const prop = properties[key];
        if (prop?.type === 'number' || prop?.type === 'integer') {
          cleanedData[key] = Number(value);
        } else if (prop?.type === 'boolean') {
          cleanedData[key] = Boolean(value);
        } else if (prop?.type === 'array' && typeof value === 'string') {
          try {
            cleanedData[key] = JSON.parse(value);
          } catch {
            cleanedData[key] = value.split(',').map(v => v.trim());
          }
        } else {
          cleanedData[key] = value;
        }
      }
    });
    onSubmit(cleanedData);
  };

  const renderField = (key: string, prop: any) => {
    const isRequired = required.includes(key);
    const fieldId = `field-${key}`;

    const commonProps = {
      id: fieldId,
      ...register(key, {
        required: isRequired ? `${key} is required` : false,
        ...(prop.minimum && { min: { value: prop.minimum, message: `Minimum value is ${prop.minimum}` } }),
        ...(prop.maximum && { max: { value: prop.maximum, message: `Maximum value is ${prop.maximum}` } }),
      }),
      className: "input-field",
      disabled: loading
    };

    switch (prop.type) {
      case 'string':
        if (prop.enum) {
          return (
            <select {...commonProps}>
              <option value="">Select an option</option>
              {prop.enum.map((option: string) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          );
        }
        if (prop.format === 'textarea' || (prop.description && prop.description.includes('long'))) {
          return (
            <textarea
              {...commonProps}
              rows={4}
              placeholder={prop.description || `Enter ${key}`}
            />
          );
        }
        return (
          <input
            {...commonProps}
            type={prop.format === 'uri' ? 'url' : 'text'}
            placeholder={prop.description || `Enter ${key}`}
          />
        );

      case 'number':
      case 'integer':
        return (
          <input
            {...commonProps}
            type="number"
            step={prop.type === 'integer' ? '1' : 'any'}
            placeholder={prop.description || `Enter ${key}`}
          />
        );

      case 'boolean':
        return (
          <div className="flex items-center">
            <input
              {...commonProps}
              type="checkbox"
              className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 focus:ring-2"
            />
            <label htmlFor={fieldId} className="ml-2 text-sm text-gray-700">
              {prop.description || `Enable ${key}`}
            </label>
          </div>
        );

      case 'array':
        return (
          <div>
            <textarea
              {...commonProps}
              rows={3}
              placeholder={`Enter ${key} (JSON array or comma-separated values)`}
            />
            <p className="text-xs text-gray-500 mt-1">
              Enter as JSON array (e.g., ["item1", "item2"]) or comma-separated values
            </p>
          </div>
        );

      case 'object':
        return (
          <textarea
            {...commonProps}
            rows={4}
            placeholder={`Enter ${key} as JSON object`}
          />
        );

      default:
        return (
          <input
            {...commonProps}
            type="text"
            placeholder={prop.description || `Enter ${key}`}
          />
        );
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
          disabled={loading}
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Actors</span>
        </button>
        
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Configure Actor Input</h2>
        <div className="flex items-center space-x-2 text-gray-600">
          <span>{actor.title || actor.name}</span>
          <span>•</span>
          <span>{actor.username}</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="card p-6">
            {Object.keys(properties).length === 0 ? (
              <div className="text-center py-8">
                <Info className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Input Schema</h3>
                <p className="text-gray-600 mb-4">This actor doesn't require any input parameters.</p>
                <button
                  onClick={() => onSubmit({})}
                  disabled={loading}
                  className="btn-primary"
                >
                  {loading ? 'Executing...' : 'Run Actor'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                {Object.entries(properties).map(([key, prop]: [string, any]) => (
                  <div key={key}>
                    <label htmlFor={`field-${key}`} className="block text-sm font-medium text-gray-700 mb-2">
                      {prop.title || key}
                      {required.includes(key) && (
                        <span className="text-error-500 ml-1">*</span>
                      )}
                    </label>
                    
                    {renderField(key, prop)}
                    
                    {prop.description && (
                      <p className="text-sm text-gray-500 mt-1">{prop.description}</p>
                    )}
                    
                    {errors[key]?.message && (
                      <p className="text-error-600 text-sm mt-1">{String(errors[key]?.message)}</p>
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn-primary w-full"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    {loading ? 'Executing Actor...' : 'Run Actor'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-3">Actor Information</h3>
            
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Name:</span>
                <span className="ml-2 text-gray-600">{actor.name}</span>
              </div>
              
              {actor.description && (
                <div>
                  <span className="font-medium text-gray-700">Description:</span>
                  <p className="text-gray-600 mt-1">{actor.description}</p>
                </div>
              )}
              
              <div>
                <span className="font-medium text-gray-700">Visibility:</span>
                <span className="ml-2 text-gray-600">
                  {actor.isPublic ? 'Public' : 'Private'}
                </span>
              </div>
              
              {actor.stats?.totalRuns !== undefined && (
                <div>
                  <span className="font-medium text-gray-700">Total Runs:</span>
                  <span className="ml-2 text-gray-600">{actor.stats.totalRuns}</span>
                </div>
              )}
            </div>

            {required.length > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-gray-700">Required Fields</p>
                    <ul className="text-sm text-gray-600 mt-1">
                      {required.map(field => (
                        <li key={field}>• {properties[field]?.title || field}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
