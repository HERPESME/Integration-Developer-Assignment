import React, { useState } from 'react';
import { ApiKeyForm } from './components/ApiKeyForm';
import { ActorSelector } from './components/ActorSelector';
import { SchemaForm } from './components/SchemaForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Header } from './components/Header';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorAlert } from './components/ErrorAlert';
import { Actor, ActorSchema, RunResult } from './types';
import { apifyApi } from './services/api';

type AppState = 'auth' | 'actors' | 'schema' | 'results';

function App() {
  const [state, setState] = useState<AppState>('auth');
  const [apiKey, setApiKey] = useState<string>('');
  const [actors, setActors] = useState<Actor[]>([]);
  const [selectedActor, setSelectedActor] = useState<Actor | null>(null);
  const [actorSchema, setActorSchema] = useState<ActorSchema | null>(null);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApiKeySubmit = async (key: string) => {
    setLoading(true);
    setError(null);
    
    try {
      apifyApi.setApiKey(key);
      const actorsData = await apifyApi.getActors();
      setApiKey(key);
      setActors(actorsData.actors);
      setState('actors');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to authenticate. Please check your API key.');
    } finally {
      setLoading(false);
    }
  };

  const handleActorSelect = async (actor: Actor) => {
    setLoading(true);
    setError(null);
    
    try {
      const schemaData = await apifyApi.getActorSchema(actor.id);
      setSelectedActor(actor);
      setActorSchema(schemaData);
      setState('schema');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load actor schema.');
    } finally {
      setLoading(false);
    }
  };

  const handleSchemaSubmit = async (input: any) => {
    if (!selectedActor) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await apifyApi.runActor(selectedActor.id, input);
      setRunResult(result);
      setState('results');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to execute actor.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setState('auth');
    setApiKey('');
    setActors([]);
    setSelectedActor(null);
    setActorSchema(null);
    setRunResult(null);
    setError(null);
  };

  const handleBackToActors = () => {
    setState('actors');
    setSelectedActor(null);
    setActorSchema(null);
    setRunResult(null);
    setError(null);
  };

  const handleBackToSchema = () => {
    setState('schema');
    setRunResult(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onReset={handleReset} showReset={state !== 'auth'} />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {error && (
          <ErrorAlert 
            message={error} 
            onClose={() => setError(null)} 
          />
        )}
        
        {loading && <LoadingSpinner />}
        
        {state === 'auth' && (
          <ApiKeyForm 
            onSubmit={handleApiKeySubmit} 
            loading={loading} 
          />
        )}
        
        {state === 'actors' && (
          <ActorSelector 
            actors={actors}
            onSelect={handleActorSelect}
            loading={loading}
          />
        )}
        
        {state === 'schema' && selectedActor && actorSchema && (
          <SchemaForm 
            actor={selectedActor}
            schema={actorSchema}
            onSubmit={handleSchemaSubmit}
            onBack={handleBackToActors}
            loading={loading}
          />
        )}
        
        {state === 'results' && runResult && (
          <ResultsDisplay 
            result={runResult}
            actor={selectedActor}
            onBack={handleBackToSchema}
            onNewRun={handleBackToActors}
          />
        )}
      </main>
    </div>
  );
}

export default App;
