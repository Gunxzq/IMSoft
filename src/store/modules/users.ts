import { defineStore, storeToRefs } from 'pinia';
import { reactive } from 'vue';
import type { UserInfoStore, userObjectStatus } from './types/store';
import { getUserInfoStore, getUserStatusStore } from '../../utils/localStorage';
import type { userStatusInfo } from './types/userInfo';
import { useUserInfoStore } from './userInfo';

export const useUsersStore = defineStore('users', () => {
  // const instance = getCurrentInstance();
  // const { userId } = instance?.appContext.config.globalProperties.$globalStore;

  const { userId } = storeToRefs(useUserInfoStore());

  //聊天对象状态
  let userStatus = reactive<userObjectStatus>(getUserStatusStore(userId.value));

  //所有用户信息
  let usersBaseInfo = reactive<UserInfoStore>(getUserInfoStore(userId.value));
  /**
   * 更新聊天对象状态
   * @param userId
   * @param newUserStatusInfo
   */
  const updateUsersStatus = (userId: string, newUserStatusInfo: userStatusInfo) => {
    let oldUserStatusInfo = userStatus[userId];
    // 更新信息
    oldUserStatusInfo = newUserStatusInfo;
  };
  /**
   * 获取某个用户状态信息
   * @param userId
   * @returns userStatusInfo
   */
  const getUserStatus = (userId: string): userStatusInfo => {
    return userStatus[userId];
  };
  return { userStatus, usersBaseInfo, updateUsersStatus, getUserStatus };
});
