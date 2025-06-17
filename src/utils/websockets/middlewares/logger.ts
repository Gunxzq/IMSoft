import type { Middleware } from '../type';

/**
 *  日志中间件
 *  @author yupi
 *   @description 调试跟踪、错误排查、行为分析、审计追踪
 *   @date 2023-09-05
 *   @version V1.0.0
 */
export const loggerMiddleware: Middleware<any> = async ({ event, data }, next) => {
  const startTime = Date.now();
  try {
    console.log(`[LOG] Event: ${event} | Data: ${JSON.stringify(data)}`);
    await next(); // 继续执行后续中间件
    const duration = Date.now() - startTime;
    console.log(`[LOG] Event ${event} processed in ${duration}ms`);
  } catch (error: any) {
    console.error(`[LOG ERROR] Event: ${event} | Error: ${error.message}`);
    throw error; // 继续抛出错误给后续错误处理中间件
  }
};
