export const GroupType = {
  create: 'create',
  join: 'join',
  manage: 'manage',
};

export type GroupType = (typeof GroupType)[keyof typeof GroupType];

// 群聊信息
export interface GroupInfoStore {
  // 群聊ID
  [groupId: string]: {
    id: string;
    name: string;
    avatar: string;
    // 群聊公告
    notice: string;
    //我创建、我加入、我管理
    type: GroupType;
    // 群聊状态，封禁，正常，免打扰、屏蔽
    status: 'banned' | 'normal' | 'mute' | 'block';
  };
}

// 枚举，消息提醒方式：接收但不提醒、收进群助手且不提醒、屏蔽群消息
export const messageRemindType = {
  // 接收不提醒
  receive_not_remind: 'receive_not_remind',
  // 收进群助手且不提醒
  receive_and_hide: 'receive_and_hide',
  // 屏蔽群消息
  block_message: 'block_message',
};

export type messageRemindType = (typeof messageRemindType)[keyof typeof messageRemindType];

// 群聊对象状态，免打扰、隐藏会话、置顶
export interface groupObjectStatus {
  // 会话ID
  [key: string]: {
    // 免打扰
    disturb: boolean;
    // 隐藏会话
    hide: boolean;
    // 置顶
    top: boolean;
    // 消息提醒方式，disturb为true时生效
    remind: messageRemindType;
    // 消息通知设置，disturb为false时生效
    notification: {
      //  通知消息预览
      preview: boolean;
      // 声音提醒
      sound: boolean;
      // 提示音
      // 来电铃声
    };
  };
}
