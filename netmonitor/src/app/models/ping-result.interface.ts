export interface PingResult {
  timestamp: Date;
  latencyMs: number | null;
  status: 'ok' | 'error';
}
