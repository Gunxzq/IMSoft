import type {
  GroupInfoStore,
  AggregationStore,
  UnreadCountStore,
  ConversationStore,
  UserInfoStore,
  customGroupsStore,
  userObjectStatus,
  contactsStore,
} from '@/store/modules/types';

export const LOCAL_STORAGE_KEYS = {
  CONVERSATIONS: 'conversations',
  AGGREGATION: 'aggregations',
  UNREAD_COUNTS: 'unreadCount',
  USER_INFO: 'userInfo',
  CUSTOM_GROUPS: 'customGroups',
  GROUP_INFO: 'groupInfo',
  USER_STATUS: 'userStatus',
  CONTACTS: 'contacts',
};

// 获取AGGREGATION
export function getAggregationStore(userId: string): AggregationStore {
  //  获取AGGREGATIONStr
  let aggregationStr = localStorage.getItem(LOCAL_STORAGE_KEYS.AGGREGATION);
  //   获取AGGREGATION
  let aggregation: Record<string, AggregationStore> = {};

  if (aggregationStr) {
    try {
      aggregation = JSON.parse(aggregationStr);
    } catch (error) {
      console.warn('Failed to parse aggregation from localStorage', error);
    }
  }

  // 确保当前用户ID存在
  if (!aggregation[userId]) {
    aggregation[userId] = {};
    localStorage.setItem(LOCAL_STORAGE_KEYS.AGGREGATION, JSON.stringify(aggregation));
  }

  return aggregation[userId];
}

// 获取UNREAD_COUNTS
export function getUnreadCounts(userId: string): UnreadCountStore {
  let unreadCountsStr = localStorage.getItem(LOCAL_STORAGE_KEYS.UNREAD_COUNTS);
  let unreadCounts: Record<string, UnreadCountStore> = {};
  if (unreadCountsStr) {
    try {
      unreadCounts = JSON.parse(unreadCountsStr);
    } catch (error) {
      console.warn('Failed to parse unreadCounts from localStorage', error);
    }
  }

  if (!unreadCounts[userId]) {
    unreadCounts[userId] = {};
    localStorage.setItem(LOCAL_STORAGE_KEYS.UNREAD_COUNTS, JSON.stringify(unreadCounts));
  }

  return unreadCounts[userId];
}

// 获取CONVERSATIONS
export function getConversations(userId: string): ConversationStore {
  let conversationsStr = localStorage.getItem(LOCAL_STORAGE_KEYS.CONVERSATIONS);
  let conversations: Record<string, ConversationStore> = {};
  if (conversationsStr) {
    try {
      conversations = JSON.parse(conversationsStr);
    } catch (error) {
      console.warn('Failed to parse conversations from localStorage', error);
    }
  }
  if (!conversations[userId]) {
    conversations[userId] = {};
    localStorage.setItem(LOCAL_STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
  }
  return conversations[userId];
}

// 群聊
export function getGroups(userId: string) {
  let GroupsStr = localStorage.getItem(LOCAL_STORAGE_KEYS.GROUP_INFO);
  let Groups: Record<string, GroupInfoStore> = {};
  if (GroupsStr) {
    try {
      Groups = JSON.parse(GroupsStr);
    } catch (error) {
      console.warn('Failed to parse Groups from localStorage', error);
    }
  }
  if (!Groups[userId]) {
    Groups[userId] = {};
    localStorage.setItem(LOCAL_STORAGE_KEYS.GROUP_INFO, JSON.stringify(Groups));
  }
  return Groups[userId];
}

// 获取联系人分组
export function getCustomGroups(userId: string) {
  let customGroupsStr = localStorage.getItem(LOCAL_STORAGE_KEYS.CUSTOM_GROUPS);
  let customGroups: Record<string, customGroupsStore> = {};
  if (customGroupsStr) {
    try {
      customGroups = JSON.parse(customGroupsStr);
    } catch (error) {
      console.warn('Failed to parse customGroups from localStorage', error);
    }
  }
  if (!customGroups[userId]) {
    // 创建一个默认的分组
    customGroups[userId] = [
      {
        groupsId: 'concern',
        description: '特别关心',
        users: [],
      },
      {
        groupsId: 'myFriends',
        description: '我的好友',
        users: [],
      },
      {
        groupsId: 'friends',
        description: '朋友',
        users: [],
      },
      {
        groupsId: 'family',
        description: '家人',
        users: [],
      },
      {
        groupsId: 'colleague',
        description: '同学',
        users: [],
      },
    ];
    localStorage.setItem(LOCAL_STORAGE_KEYS.CUSTOM_GROUPS, JSON.stringify(customGroups));
  }
  return customGroups[userId];
}

// 获取USER_INFO
export function getUserInfoStore(userId: string): UserInfoStore {
  let userInfoStr = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_INFO);
  let userInfo: Record<string, UserInfoStore> = {};
  if (userInfoStr) {
    try {
      userInfo = JSON.parse(userInfoStr);
    } catch (error) {
      console.warn('Failed to parse userInfo from localStorage', error);
    }
  }
  if (!userInfo[userId]) {
    userInfo[userId] = {};
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_INFO, JSON.stringify(userInfo));
  }
  return userInfo[userId];
}
// 用户对象状态
export function getUserStatusStore(userId: string) {
  let userStatusStr = localStorage.getItem(LOCAL_STORAGE_KEYS.USER_STATUS);
  let userStatus: Record<string, userObjectStatus> = {};
  if (userStatusStr) {
    try {
      userStatus = JSON.parse(userStatusStr);
    } catch (error) {
      console.warn('Failed to parse userStatus from localStorage', error);
    }
  }
  if (!userStatus[userId]) {
    userStatus[userId] = {};
    localStorage.setItem(LOCAL_STORAGE_KEYS.USER_STATUS, JSON.stringify(userStatus));
  }
  return userStatus[userId];
}

// 获取好友ID数组
export function getContactsIds(userId: string) {
  let contactsStr = localStorage.getItem(LOCAL_STORAGE_KEYS.CONTACTS);
  let contacts: Record<string, contactsStore> = {};
  if (contactsStr) {
    try {
      contacts = JSON.parse(contactsStr);
    } catch (error) {
      console.warn('Failed to parse userStatus from localStorage', error);
    }
  }
  if (!contacts[userId]) {
    contacts[userId] = [];
    localStorage.setItem(LOCAL_STORAGE_KEYS.CONTACTS, JSON.stringify(contacts));
  }

  return contacts[userId];
}
