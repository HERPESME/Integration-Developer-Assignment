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

  const formatDate = (dateString: string) => new Date(dateString).toLocaleString();

  const formatDuration = (durationMs?: number) => {
    if (durationMs === undefined) return 'N/A';
    const seconds = Math.round(durationMs / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  const formatBytes = (bytes?: number) => {
    if (bytes === undefined) return 'N/A';
    if (bytes === 0) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
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
    link.download = `${actor?.name || 'actor'}-results-${result.run.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getStatusInfo = () => {
    switch (result.run.status) {
      case 'SUCCEEDED':
        return { icon: CheckCircle, color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' };
      case 'FAILED':
        return { icon: XCircle, color: 'text-error', bg: 'bg-error/10', border: 'border-error/20' };
      case 'RUNNING':
        return { icon: Clock, color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' };
      default:
        return { icon: Clock, color: 'text-text-secondary', bg: 'bg-surface', border: 'border-border' };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  const renderStat = (label: string, value: string | number | undefined) => (
    value !== undefined && (
      <div className="flex justify-between items-center">
        <span className="text-text-secondary font-medium">{label}:</span>
        <span className="text-text-primary font-mono">{value}</span>
      </div>
    )
  );

  return (
    <div className="space-y-8">
      <div>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 rounded-md bg-surface px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-border hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-offset-2 focus:ring-offset-background mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Configuration</span>
        </button>
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-text-primary">Execution Results</h2>
          <p className="mt-2 text-lg text-text-secondary">
            Results for <span className='font-bold text-primary'>{actor?.title || actor?.name}</span>
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="card">
            <div className="card-content p-6">
              <div className="flex items-center gap-4 mb-4">
                <StatusIcon className={`h-8 w-8 ${statusInfo.color}`} />
                <div>
                  <h3 className="text-lg font-semibold text-text-primary">Execution Status</h3>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border}`}>
                    {result.run.status}
                  </span>
                </div>
              </div>
              {result.message && <div className="alert alert-info">{result.message}</div>}
              {result.error && <div className="alert alert-error">{result.error}</div>}
            </div>
          </div>

          <div className="card">
            <div className="card-header flex justify-between items-center p-6">
              <h3 className="text-lg font-semibold text-text-primary">Results</h3>
              {result.results && result.results.length > 0 && (
                <div className="flex gap-2">
                  <button onClick={downloadResults} className="btn-secondary">
                    <Download className="h-4 w-4" />
                  </button>
                  <a href={`https://console.apify.com/actors/${actor?.id}/runs/${result.run.id}`} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}
            </div>
            <div className="card-content p-6">
              {!result.results || result.results.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <ExternalLink className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 text-lg font-medium text-text-primary">No Results Found</h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {result.run.status === 'RUNNING' 
                      ? 'The actor is still running. Results will appear here upon completion.'
                      : 'This actor run did not produce any output data.'}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-text-secondary">Displaying {result.results.length} item{result.results.length !== 1 ? 's' : ''}.</p>
                  <div className="max-h-[600px] overflow-y-auto space-y-4 pr-2">
                    {result.results.map((item, index) => (
                      <div key={index} className="bg-surface rounded-lg border border-border relative">
                        <div className="flex justify-between items-center p-3 border-b border-border">
                          <span className="text-sm font-medium text-text-secondary">Item {index + 1}</span>
                          <button onClick={() => copyToClipboard(JSON.stringify(item, null, 2), index)} className="btn-icon" title="Copy JSON">
                            {copiedIndex === index ? <CheckCircle className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                          </button>
                        </div>
                        <pre className="text-xs p-4 bg-background overflow-x-auto text-text-primary whitespace-pre-wrap font-mono">
                          {JSON.stringify(item, null, 2)}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
