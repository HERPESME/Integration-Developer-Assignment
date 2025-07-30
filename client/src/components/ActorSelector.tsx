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
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Select an Actor</h2>
        <p className="text-gray-600">Choose from your available actors to execute</p>
      </div>

      {actors.length === 0 ? (
        <div className="card p-8 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Actors Found</h3>
          <p className="text-gray-600">You don't have any actors in your Apify account yet.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {actors.map((actor) => (
            <div
              key={actor.id}
              className="card p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer border-2 border-transparent hover:border-primary-200"
              onClick={() => !loading && onSelect(actor)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{actor.username}</span>
                </div>
                <div className="flex items-center space-x-1">
                  {actor.isPublic ? (
                    <div title="Public actor">
                      <Globe className="w-4 h-4 text-green-500" />
                    </div>
                  ) : (
                    <div title="Private actor">
                      <Lock className="w-4 h-4 text-gray-400" />
                    </div>
                  )}
                </div>
              </div>

              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                {actor.title || actor.name}
              </h3>

              {actor.description && (
                <p className="text-sm text-gray-600 mb-3 line-clamp-3">
                  {actor.description}
                </p>
              )}

              <div className="flex items-center justify-between text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Play className="w-3 h-3" />
                  <span>{actor.stats?.totalRuns || 0} runs</span>
                </div>
                {actor.stats?.lastRunStartedAt && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>Last run: {formatDate(actor.stats.lastRunStartedAt)}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <button
                  className="btn-primary w-full text-sm"
                  disabled={loading}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(actor);
                  }}
                >
                  {loading ? 'Loading...' : 'Select Actor'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
