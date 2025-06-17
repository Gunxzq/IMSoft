// 好友申请
export interface FriendRequest {
  id: string;
  sender: string;
  receiver: string;
  status: 'pending' | 'accepted' | 'rejected';
  // 申请消息
  message: string;
}

// 自定义分组
export interface customGroups {
  groupsId: string;
  // 该分组下的用户ID
  users: string[];
  // 该分组的描述
  description: string;
}

export type customGroupsStore = customGroups[];

// 好友ID数组
export type contactsStore = string[];
