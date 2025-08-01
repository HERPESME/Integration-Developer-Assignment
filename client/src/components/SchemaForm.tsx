import React, { useEffect, useMemo } from 'react';
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
  console.log('Received schema in form:', JSON.stringify(schema, null, 2));
  const { register, handleSubmit, formState: { errors }, setValue } = useForm();

  // Handle different schema structures
  const properties = useMemo(() => 
    schema.schema?.properties || schema.properties || {}, 
    [schema.schema?.properties, schema.properties]
  );
  const required = useMemo(() => 
    schema.schema?.required || schema.required || [], 
    [schema.schema?.required, schema.required]
  );
  
  console.log('Extracted properties:', Object.keys(properties));
  console.log('Required fields:', required);

  useEffect(() => {
    Object.entries(properties).forEach(([key, prop]: [string, any]) => {
      if (prop.default !== undefined) {
        setValue(key, prop.default);
      }
    });
  }, [properties, setValue]);

  const handleFormSubmit = (data: any) => {
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
            // If it's not valid JSON, treat it as a single item or comma-separated list
            const trimmedValue = value.trim();
            if (trimmedValue.includes(',')) {
              cleanedData[key] = trimmedValue.split(',').map(v => v.trim());
            } else {
              // Single item - wrap in array
              cleanedData[key] = [trimmedValue];
            }
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
        required: isRequired ? `${prop.title || key} is required` : false,
        ...(prop.minimum !== undefined && { min: { value: prop.minimum, message: `Minimum value is ${prop.minimum}` } }),
        ...(prop.maximum !== undefined && { max: { value: prop.maximum, message: `Maximum value is ${prop.maximum}` } }),
      }),
      className: "input-field",
      disabled: loading,
      placeholder: prop.description || `Enter ${key}`,
    };

    switch (prop.type) {
      case 'string':
        if (prop.enum) {
          return (
            <select {...commonProps}>
              <option value="">Select an option</option>
              {prop.enum.map((option: string) => (
                <option key={option} value={option}>{prop.enumTitles?.[option] || option}</option>
              ))}
            </select>
          );
        }
        if (prop.format === 'textarea' || (prop.description && prop.description.length > 100)) {
          return <textarea {...commonProps} rows={4} />;
        }
        return <input {...commonProps} type={prop.format === 'uri' ? 'url' : 'text'} />;

      case 'number':
      case 'integer':
        return <input {...commonProps} type="number" step={prop.type === 'integer' ? '1' : 'any'} />;

      case 'boolean':
        return (
          <label htmlFor={fieldId} className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" {...register(key)} id={fieldId} className="sr-only peer" disabled={loading} />
            <div className="w-11 h-6 bg-border rounded-full peer peer-focus:ring-2 peer-focus:ring-primary-focus peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            <span className="ml-3 text-sm font-medium text-text-secondary">{prop.description || `Enable ${key}`}</span>
          </label>
        );

      case 'array':
        return (
          <div>
            <textarea {...commonProps} rows={3} placeholder={`Enter URLs separated by commas or as JSON array`} />
            <p className="text-xs text-text-secondary mt-1">
              {prop.items?.format === 'uri' 
                ? 'e.g., https://example.com, https://example.org or ["https://example.com", "https://example.org"]'
                : 'e.g., item1, item2 or ["item1", "item2"]'
              }
            </p>
          </div>
        );

      case 'object':
        return <textarea {...commonProps} rows={4} placeholder={`Enter a valid JSON object`} />;

      default:
        return <input {...commonProps} type="text" />;
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-md bg-surface px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-border hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-offset-2 focus:ring-offset-background mb-6"
          disabled={loading}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Actors</span>
        </button>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary">Configure Input</h2>
          <p className="mt-2 text-lg text-text-secondary">Provide the inputs for <span className='font-bold text-primary'>{actor.title || actor.name}</span></p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="card">
            {Object.keys(properties).length === 0 ? (
              <div className="card-content text-center p-12">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                  <Info className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-text-primary">No Input Required</h3>
                <p className="mt-1 text-sm text-text-secondary mb-6">This actor runs without any input parameters.</p>
                <button onClick={() => onSubmit({})} disabled={loading} className="btn-primary">
                  {loading ? 'Executing...' : 'Run Actor'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit(handleFormSubmit)}>
                <div className="card-content p-8 space-y-6">
                  {Object.entries(properties).map(([key, prop]: [string, any]) => (
                    <div key={key}>
                      <label htmlFor={`field-${key}`} className="block text-sm font-medium text-text-primary mb-1">
                        {prop.title || key}
                        {required.includes(key) && <span className="text-error ml-1">*</span>}
                      </label>
                      {prop.description && (
                        <p className="text-xs text-text-secondary mb-2">{prop.description}</p>
                      )}
                      {renderField(key, prop)}
                      {errors[key]?.message && (
                        <p className="text-error text-sm mt-1">{String(errors[key]?.message)}</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className="card-footer p-6 border-t border-border">
                  <button type="submit" disabled={loading} className="btn-primary w-full">
                    <Play className="h-5 w-5 mr-2" />
                    {loading ? 'Executing...' : 'Run Actor'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="card">
            <div className="card-content p-6">
              <h3 className="font-semibold text-text-primary mb-4">Actor Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="font-medium text-text-secondary">Name:</span>
                  <span className="text-text-primary text-right">{actor.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-medium text-text-secondary">Owner:</span>
                  <span className="text-text-primary text-right">{actor.username}</span>
                </div>
                {actor.description && (
                  <div>
                    <span className="font-medium text-text-secondary">Description:</span>
                    <p className="text-text-primary mt-1">{actor.description}</p>
                  </div>
                )}
              </div>
            </div>
            {required.length > 0 && (
              <div className="card-footer p-6 border-t border-border">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-text-primary">Required Fields</h4>
                    <ul className="text-xs text-text-secondary mt-2 list-disc list-inside space-y-1">
                      {required.map((field: string) => (
                        <li key={field}>{properties[field]?.title || field}</li>
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
