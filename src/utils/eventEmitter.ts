// 事件发布器
export enum EventName {
  // 权限不足
  API_UN_AUTH = 'API:UN_AUTH',
  // 参数验证错误
  API_VALIDATE_ERROR = 'API:VALIDATE_ERROR',
  // 登录事件
  API_LOGIN = 'API:LOGIN',
}

class EventEmitter {
  private listeners: Record<string, Set<Function>>;
  constructor() {
    this.listeners = {
      [EventName.API_UN_AUTH]: new Set(),
      [EventName.API_VALIDATE_ERROR]: new Set(),
      [EventName.API_LOGIN]: new Set(),
    };
  }
  //监听事件
  on(eventName: string, listener: Function) {
    (this.listeners[eventName] ??= new Set()).add(listener);
  }
  //触发事件
  emit(eventName: string, ...args: any[]) {
    // 不同的事件处理使用了相同的参数
    this.listeners[eventName].forEach(listener => listener(...args));
  }
  off(eventName: string, listener: () => void) {
    (this.listeners[eventName] ??= new Set()).delete(listener);
  }
  once(eventName: string, listener: (...args: any[]) => void) {
    // 先执行listener，然后移除该listener
    const onceListener = (...args: any[]) => {
      this.off(eventName, onceListener);
      listener(...args);
    };
    this.on(eventName, onceListener);
  }
}

export default new EventEmitter();
