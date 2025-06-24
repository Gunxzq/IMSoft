import { defineStore, storeToRefs } from 'pinia';
import { ref, computed, reactive } from 'vue';
import type { customGroupsStore, GroupInfoStore } from './types/store';
import { getCustomGroups, getContactsIds } from '../../utils/localStorage';
import { getFirstLetter } from '../../utils/tool';
import { useUserInfoStore } from './userInfo';
import { useUsersStore } from './users';
import { useGroupStore } from './groups';

export const useContactsStore = defineStore('contacts', () => {
  // const instance = getCurrentInstance();
  const { userId } = storeToRefs(useUserInfoStore());
  const { usersBaseInfo, userStatus } = storeToRefs(useUsersStore());
  const { groups } = storeToRefs(useGroupStore());

  // 当前标签
  let activeTab = ref('contacts');

  //   新朋友申请列表
  let newFriends = reactive([]);

  //   群通知
  let groupNotices = reactive([]);

  let contacts = reactive(getContactsIds(userId.value));

  //   自定义分组
  let customGroups = reactive<customGroupsStore>(getCustomGroups(userId.value));

  /**
   * 当前好友列表
   */
  const currentContacts = computed(() => {
    let result: { [key: string]: any[] } = {};
    // 分组
    let orderedKeys: Set<string> = new Set([]);

    contacts.forEach((item: any) => {
      let key: string = userStatus.value[item].concern ? ' concern' : getFirstLetter(usersBaseInfo.value[item].name);

      if (!orderedKeys.has(key)) {
        orderedKeys.add(key);
      }
      result[key].push(usersBaseInfo.value[item]);
    });

    return {
      orderedKeys,
      contacts: result,
    };
  });

  /**
   * 获取当前分组
   */
  const currentCustomGroups = computed(() => {
    return customGroups;
  });

  /**
   * 获取当前群聊
   */
  const currentGroups = computed(() => {
    let result: { [key: string]: any[] } = {};

    // 分组
    let orderedKeys: Set<string> = new Set([]);

    Object.values(groups.value as GroupInfoStore).forEach(item => {
      let key: string = item.type;

      if (!orderedKeys.has(key)) {
        orderedKeys.add(key);
      }

      result[key].push({
        id: item.id,
        name: item.name,
        avatar: item.avatar,
        type: item.type,
        status: item.status,
      });
    });

    return result;
  });

  return {
    activeTab,
    currentContacts,
    currentCustomGroups,
    currentGroups,
  };
});
