import type { Middleware } from '../type';
/**
 *  认证中间件
 *  @author yupi
 *   @description 数据完整性、业务规则校验
 *   @date 2023-09-05
 *   @version V1.0.0
 */
export const authMiddleware: Middleware<any> = async ({ socket, event }, next) => {
  // 身份验证
  if (typeof socket.auth !== 'object' || socket.auth === null || !('token' in socket.auth)) {
    console.error('Unauthorized private message');
    return; // 中断流程
  }

  //   验证事件权限
  if (event === 'private-message') {
    // 用户是否存在
    // const user = await fetchUserFromToken(socket.auth.token)
    // if (!user) {
    //   throw new Error('Unauthorized: Invalid user')
    // }
  }
  next();
};
