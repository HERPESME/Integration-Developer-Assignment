import axios, { AxiosInstance } from 'axios';
import { Actor, ActorSchema, RunResult } from '../types';

class ApifyApiService {
  private api: AxiosInstance;
  private apiKey: string = '';

  constructor() {
    this.api = axios.create({
      baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5001/api',
      timeout: 120000, // 2 minutes timeout for actor runs
    });
  }

  setApiKey(key: string) {
    this.apiKey = key;
    this.api.defaults.headers.common['X-Apify-Token'] = key;
  }

  async getActors(): Promise<{ actors: Actor[] }> {
    try {
      const response = await this.api.get('/actors');
      return response.data;
    } catch (error: any) {
      // If we get a 401 with actors data, throw a custom error to pass the actors
      if (error.response?.status === 401 && error.response?.data?.actors) {
        const customError = new Error('Invalid API key with fallback actors');
        (customError as any).response = error.response;
        throw customError;
      }
      throw error;
    }
  }

  async getActorSchema(actorId: string): Promise<ActorSchema> {
    const response = await this.api.get(`/actors/${actorId}/schema`);
    return response.data;
  }

  async runActor(actorId: string, input: any): Promise<RunResult> {
    const response = await this.api.post(`/actors/${actorId}/run`, { input });
    return response.data;
  }

  async checkHealth(): Promise<{ status: string; timestamp: string }> {
    const response = await this.api.get('/health');
    return response.data;
  }
}

export const apifyApi = new ApifyApiService();
