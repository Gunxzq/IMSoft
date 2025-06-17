// import type { Middleware } from '../type';
// /**
//  *  认证中间件
//  *  @author yupi
//  *   @description 系统稳定性、防DDoS攻击
//  *   @date 2023-09-05
//  *   @version V1.0.0
//  */
// export const rateLimitMiddleware: Middleware<any> = async ({ socket }, next) => {
//   const IP = socket.handshake.address;
//   const now = Date.now();

//   // 检查IP请求频率
//   if (requestCount[IP] > 100) {
//     throw new Error('Too many requests');
//   }

//   requestCount[IP]++;
//   setTimeout(() => requestCount[IP]--, 1000);
//   await next();
// };
