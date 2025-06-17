import { defineStore, storeToRefs } from 'pinia';
import { reactive } from 'vue';
import type { GroupInfoStore } from './types/groups';
import { getGroups } from '../../utils/localStorage';
import { useUserInfoStore } from './userInfo';

export const useGroupStore = defineStore('groups', () => {
  // const instance = getCurrentInstance();
  // // 访问全局挂载的 $user
  // const { userId } = instance?.appContext.config.globalProperties.$globalStore;

  const { userId } = storeToRefs(useUserInfoStore());
  let groups = reactive<GroupInfoStore>(getGroups(userId.value));

  return { groups };
});
