import type { Middleware } from '../type';
/**
 * 验证中间件
 *  @author yupi
 *   @description 身份验证、权限控制、维护用户登陆状态、验证请求时效性
 *   @date 2023-09-05
 *   @version V1.0.0
 */
export const validationMiddleware: Middleware<any> = ({ data }, next) => {
  console.log('Validating message...');
  if (data.type === 'message' && !data.content) {
    console.error('Invalid message format');
    return;
  }
  next();
};
