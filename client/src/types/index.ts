export interface Actor {
  id: string;
  name: string;
  title: string;
  description?: string;
  username: string;
  isPublic: boolean;
  stats?: {
    totalRuns?: number;
    lastRunStartedAt?: string;
  };
}

export interface ActorSchema {
  schema: {
    type: string;
    properties?: Record<string, any>;
    required?: string[];
    title?: string;
    description?: string;
  };
  actorInfo: {
    id: string;
    name: string;
    title: string;
    description?: string;
  };
}

export interface RunResult {
  success: boolean;
  run: {
    id: string;
    status: string;
    startedAt: string;
    finishedAt?: string;
    stats?: {
      inputBodyLen?: number;
      restartCount?: number;
      resurrectCount?: number;
      memAvgBytes?: number;
      memMaxBytes?: number;
      memCurrentBytes?: number;
      cpuAvgUsage?: number;
      cpuMaxUsage?: number;
      cpuCurrentUsage?: number;
      netRxBytes?: number;
      netTxBytes?: number;
      durationMillis?: number;
      runTimeSecs?: number;
      metamorph?: number;
      computeUnits?: number;
    };
  };
  results?: any[];
  message?: string;
  error?: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}
