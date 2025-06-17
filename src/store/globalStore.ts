// plugins/global-user.js
import type { App } from 'vue';
import { useUserInfoStore } from './modules/userInfo';
import { useGroupStore } from './modules/groups';
import { useUsersStore } from './modules/users';

export default {
  install(app: App) {
    const userInfoStore = useUserInfoStore();
    const groupStore = useGroupStore();
    const usersStore = useUsersStore();
    // 挂载到全局属性（如 $user）

    const globalProperties = {
      userId: userInfoStore.userId,
      // groups: groupStore.groups,
      // userStatus: usersStore.userStatus,
      // usersBaseInfo: usersStore.usersBaseInfo,
    };
    app.config.globalProperties.$globalStore = globalProperties;
  },
};
