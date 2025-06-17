import { io, Socket } from 'socket.io-client';
import type { Middleware } from './type';
import { loggerMiddleware } from './middlewares/logger';
import { authMiddleware } from './middlewares/auth';
import { validationMiddleware } from './middlewares/validation';

class WebSocketService {
  // socket实例
  private socket: Socket | null = null;
  private EventList: Array<String> | null = null;
  // 中间件
  private globalMiddlewares: Middleware<any>[] = [];

  constructor() {
    // 初始化配置
    this.socket = io('http://localhost:3000', {
      auth: {
        token: 'f',
        userId: '1',
      },
    });
    // 统一事件入口
    this.socket.onAny((event, data) => {
      this.executeMiddlewares(event, data);
    });

    // 开始监听
    this.connect();
  }

  // 监听连接有关的事件
  connect() {
    // 监听连接建立
    this.socket?.on('connect', () => {
      console.log('WebSocket connected');
    });

    // 监听连接断开
    this.socket?.on('disconnect', reason => {
      console.log(`Disconnected: ${reason}`);
    });
  }

  // 断开连接
  disconnect() {
    this.socket?.disconnect();
  }

  // 连接状态
  get isConnected(): boolean {
    // !!保证结果是布尔值
    return !!this.socket?.connected;
  }

  // socket实例
  getSocket(): Socket | null {
    if (!this.socket) throw new Error('WebSocket not connected');
    return this.socket;
  }

  // 触发事件
  emitEvent(eventName: string, data: any) {
    this.socket?.emit(eventName, data);
    return this.socket;
  }
  // 开启监听事件
  onEvent(eventName: string, callback: (...args: any[]) => void) {
    this.EventList?.push(eventName);
    this.socket?.on(eventName, callback);
    return this.socket;
  }

  // 关闭监听事件
  offEvent(eventName: string) {
    this.socket?.off(eventName);
    return this.socket;
  }
  // 注册全局中间件
  use<T extends Record<string, any>>(middleware: Middleware<T>) {
    this.globalMiddlewares.push(middleware);
  }

  // 执行中间件链
  private async executeMiddlewares(event: string, data: any) {
    let index = 0;
    const next = async () => {
      // 当中间件执行完成后处理默认逻辑
      if (index >= this.globalMiddlewares.length) {
        this.handleOriginalEvent(event, data);
        return;
      }

      const middleware = this.globalMiddlewares[index++];
      await middleware(
        {
          event,
          data,
          socket: this.socket!,
        },
        next,
      );
    };

    await next();
  }

  private handleOriginalEvent(event: string, data: any) {
    console.log(`[Raw Event] ${event}:`, data);
    // 这里可以添加默认事件处理
  }
}

const WebSocketServiceIstance = new WebSocketService();

// 注册中间件
WebSocketServiceIstance.use(loggerMiddleware);
WebSocketServiceIstance.use(authMiddleware);
WebSocketServiceIstance.use(validationMiddleware);

export default WebSocketServiceIstance;
