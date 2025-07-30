import React, { useState } from 'react';
import { ArrowLeft, Play, CheckCircle, XCircle, Clock, ExternalLink, Copy, Download } from 'lucide-react';
import { RunResult, Actor } from '../types';

interface ResultsDisplayProps {
  result: RunResult;
  actor: Actor | null;
  onBack: () => void;
  onNewRun: () => void;
}

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ 
  result, 
  actor, 
  onBack, 
  onNewRun 
}) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const formatDuration = (durationMs?: number) => {
    if (!durationMs) return 'N/A';
    const seconds = Math.round(durationMs / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatBytes = (bytes?: number) => {
    if (!bytes) return 'N/A';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`;
  };

  const copyToClipboard = async (text: string, index: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  };

  const downloadResults = () => {
    const dataStr = JSON.stringify(result.results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${actor?.name || 'actor'}-results-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusIcon = () => {
    switch (result.run.status) {
      case 'SUCCEEDED':
        return <CheckCircle className="w-6 h-6 text-success-500" />;
      case 'FAILED':
        return <XCircle className="w-6 h-6 text-error-500" />;
      case 'RUNNING':
        return <Clock className="w-6 h-6 text-amber-500" />;
      default:
        return <Clock className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusColor = () => {
    switch (result.run.status) {
      case 'SUCCEEDED':
        return 'text-success-600 bg-success-50 border-success-200';
      case 'FAILED':
        return 'text-error-600 bg-error-50 border-error-200';
      case 'RUNNING':
        return 'text-amber-600 bg-amber-50 border-amber-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div>
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Configuration</span>
        </button>
        
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Execution Results</h2>
            <div className="flex items-center space-x-2 text-gray-600">
              <span>{actor?.title || actor?.name}</span>
              <span>•</span>
              <span>Run ID: {result.run.id}</span>
            </div>
          </div>
          
          <button
            onClick={onNewRun}
            className="btn-secondary"
          >
            <Play className="w-4 h-4 mr-2" />
            New Run
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Status Card */}
          <div className="card p-6">
            <div className="flex items-center space-x-3 mb-4">
              {getStatusIcon()}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Execution Status</h3>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor()}`}>
                  {result.run.status}
                </span>
              </div>
            </div>

            {result.message && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-blue-800 text-sm">{result.message}</p>
              </div>
            )}

            {result.error && (
              <div className="mb-4 p-3 bg-error-50 border border-error-200 rounded-lg">
                <p className="text-error-800 text-sm">{result.error}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Started:</span>
                <p className="text-gray-600">{formatDate(result.run.startedAt)}</p>
              </div>
              {result.run.finishedAt && (
                <div>
                  <span className="font-medium text-gray-700">Finished:</span>
                  <p className="text-gray-600">{formatDate(result.run.finishedAt)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Results Card */}
          <div className="card p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Results</h3>
              {result.results && result.results.length > 0 && (
                <div className="flex space-x-2">
                  <button
                    onClick={downloadResults}
                    className="btn-secondary text-sm"
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Download
                  </button>
                  <a
                    href={`https://console.apify.com/actors/${actor?.id}/runs/${result.run.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary text-sm"
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    View in Console
                  </a>
                </div>
              )}
            </div>

            {!result.results || result.results.length === 0 ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExternalLink className="w-8 h-8 text-gray-400" />
                </div>
                <h4 className="text-lg font-medium text-gray-900 mb-2">No Results</h4>
                <p className="text-gray-600">
                  {result.run.status === 'RUNNING' 
                    ? 'The actor is still running. Results will appear when execution completes.'
                    : 'This actor run produced no output data.'
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>{result.results.length} item{result.results.length !== 1 ? 's' : ''}</span>
                </div>
                
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {result.results.map((item, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4 relative">
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Item {index + 1}</span>
                        <button
                          onClick={() => copyToClipboard(JSON.stringify(item, null, 2), index)}
                          className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                          title="Copy to clipboard"
                        >
                          {copiedIndex === index ? (
                            <CheckCircle className="w-4 h-4 text-success-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <pre className="text-xs text-gray-800 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(item, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Sidebar */}
        <div className="lg:col-span-1">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">Run Statistics</h3>
            
            <div className="space-y-4 text-sm">
              {result.run.stats?.durationMillis && (
                <div>
                  <span className="font-medium text-gray-700">Duration:</span>
                  <span className="ml-2 text-gray-600">
                    {formatDuration(result.run.stats.durationMillis)}
                  </span>
                </div>
              )}
              
              {result.run.stats?.computeUnits && (
                <div>
                  <span className="font-medium text-gray-700">Compute Units:</span>
                  <span className="ml-2 text-gray-600">
                    {result.run.stats.computeUnits.toFixed(4)}
                  </span>
                </div>
              )}
              
              {result.run.stats?.memMaxBytes && (
                <div>
                  <span className="font-medium text-gray-700">Peak Memory:</span>
                  <span className="ml-2 text-gray-600">
                    {formatBytes(result.run.stats.memMaxBytes)}
                  </span>
                </div>
              )}
              
              {result.run.stats?.cpuMaxUsage && (
                <div>
                  <span className="font-medium text-gray-700">Peak CPU:</span>
                  <span className="ml-2 text-gray-600">
                    {(result.run.stats.cpuMaxUsage * 100).toFixed(1)}%
                  </span>
                </div>
              )}
              
              {result.run.stats?.restartCount !== undefined && (
                <div>
                  <span className="font-medium text-gray-700">Restarts:</span>
                  <span className="ml-2 text-gray-600">
                    {result.run.stats.restartCount}
                  </span>
                </div>
              )}
              
              {result.run.stats?.netRxBytes && (
                <div>
                  <span className="font-medium text-gray-700">Data Downloaded:</span>
                  <span className="ml-2 text-gray-600">
                    {formatBytes(result.run.stats.netRxBytes)}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
