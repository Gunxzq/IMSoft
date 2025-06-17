export interface ConnectionState {
  isConnected: boolean;
  reconnectAttempts: number;
  lastError: Error | null;
}
