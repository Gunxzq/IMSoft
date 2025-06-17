import { Socket } from 'socket.io-client';

export type MiddlewareContext<T extends Record<string, any>> = {
  event: string;
  data: T;
  socket: Socket;
};

export type Middleware<T extends Record<string, any>> = (context: MiddlewareContext<T>, next: () => void) => void | Promise<void>;
