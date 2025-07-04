import { defineStore } from 'pinia';
import { ref } from 'vue';
import WebSocketServiceIstance from '../../utils/websockets/websokcet';
import type { ConnectionState } from './types';

export const useConnectionStore = defineStore('connection', () => {
  // 连接状态
  const state = ref<ConnectionState>({
    isConnected: false,
    reconnectAttempts: 0,
    lastError: null,
  });

  //   websocket实例
  const wsService = WebSocketServiceIstance;

  //建立连接
  const connect = async () => {
    try {
      await wsService.connect();
      state.value.isConnected = true;
      state.value.reconnectAttempts = 0;
    } catch (error) {
      state.value.lastError = error as Error;
      scheduleReconnect();
    }
  };

  //   断开连接
  const disconnect = () => {
    wsService.disconnect();
    state.value.isConnected = false;
  };

  //   重连
  const scheduleReconnect = () => {
    // 五次
    if (state.value.reconnectAttempts >= 5) return;

    const delay = Math.min(1000 * 2 ** state.value.reconnectAttempts, 30000);
    setTimeout(connect, delay);
    state.value.reconnectAttempts++;
  };

  return {
    state,
    // wsService,
    connect,
    disconnect,
  };
});
