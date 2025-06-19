import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { UserStatus } from './types/userInfo';

export const useUserInfoStore = defineStore('userinfo', () => {
  let token = ref('');
  let userId = ref('1');
  // 用户的连接状态
  const userStatus = ref<UserStatus>({});

  //  更新用户状态
  const updateUserStatus = (userId: string, online: boolean) => {
    userStatus.value[userId] = {
      online,
      lastActive: Date.now(),
    };
  };

  return {
    userStatus,
    token,
    userId,
    updateUserStatus,
  };
});
