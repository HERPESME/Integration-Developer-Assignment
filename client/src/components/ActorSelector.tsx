import React from 'react';
import { Play, User, Globe, Lock, Calendar } from 'lucide-react';
import { Actor } from '../types';

interface ActorSelectorProps {
  actors: Actor[];
  onSelect: (actor: Actor) => void;
  loading: boolean;
}

export const ActorSelector: React.FC<ActorSelectorProps> = ({ actors, onSelect, loading }) => {
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold tracking-tight text-text-primary">Select an Actor</h2>
        <p className="mt-2 text-lg text-text-secondary">Choose from your available actors to run.</p>
      </div>

      {actors.length === 0 ? (
        <div className="card text-center p-12">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Play className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-text-primary">No Actors Found</h3>
            <p className="mt-1 text-sm text-text-secondary">You don't have any actors in your Apify account yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {actors.map((actor) => (
            <div
              key={actor.id}
              className="card p-6 flex flex-col justify-between group rounded-lg border-2 border-border bg-surface transition-all duration-200 hover:border-primary hover:shadow-lg cursor-pointer"
              onClick={() => !loading && onSelect(actor)}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-sm text-text-secondary">
                    <User className="h-4 w-4" />
                    <span>{actor.username}</span>
                  </div>
                  {actor.isPublic ? (
                      <div className="flex items-center gap-1 text-xs font-medium text-green-400 bg-green-900/50 px-2 py-1 rounded-full">
                        <Globe className="h-3 w-3" />
                        <span>Public</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs font-medium text-amber-400 bg-amber-900/50 px-2 py-1 rounded-full">
                        <Lock className="h-3 w-3" />
                        <span>Private</span>
                      </div>
                  )}
                </div>

                <h3 className="font-bold text-text-primary group-hover:text-primary transition-colors duration-200">
                  {actor.title || actor.name}
                </h3>

                {actor.description && (
                  <p className="text-sm text-text-secondary mt-2 line-clamp-3">
                    {actor.description}
                  </p>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-border/50 text-xs text-text-secondary flex justify-between items-center">
                <div className="flex items-center gap-1.5">
                  <Play className="h-3 w-3" />
                  <span>{actor.stats?.totalRuns || 0} runs</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  <span>{formatDate(actor.stats?.lastRunStartedAt)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
