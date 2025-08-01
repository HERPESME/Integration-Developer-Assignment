import React, { useState } from 'react';
import { ApiKeyForm } from './components/ApiKeyForm';
import { ActorSelector } from './components/ActorSelector';
import { SchemaForm } from './components/SchemaForm';
import { ResultsDisplay } from './components/ResultsDisplay';
import { Header } from './components/Header';
import { ErrorAlert } from './components/ErrorAlert';
import { Actor, ActorSchema, RunResult } from './types';
import { apifyApi } from './services/api';

type AppState = 'auth' | 'actors' | 'schema' | 'results';

function App() {
  const [state, setState] = useState<AppState>('auth');
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
      setActors(actorsData.actors);
      setState('actors');
    } catch (err: any) {
      // Check if the error response includes actors (for testing with public actors)
      if (err.response?.data?.actors) {
        setActors(err.response.data.actors);
        setState('actors');
        setError('Using public actors for testing. Please get a valid API key for full functionality.');
      } else {
        setError(err.response?.data?.message || 'Failed to authenticate. Please check your API key.');
      }
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
    <div className="min-h-screen bg-background font-sans text-text-primary">
      <Header onReset={handleReset} showReset={state !== 'auth'} />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {error && (
            <ErrorAlert 
              message={error} 
              onClose={() => setError(null)} 
            />
          )}
          
          {/* The loading spinner will be handled inside components for better UX */}

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
        </div>
      </main>
    </div>
  );
}

export default App;
