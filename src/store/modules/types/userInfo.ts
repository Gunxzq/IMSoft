// 用户登陆状态
export interface UserStatus {
  [userId: string]: {
    online: boolean;
    // 时间戳
    lastActive: number;
  };
}

// 在线状态:在线\离开\我的电量\自定义\隐身等,包含图标和文本
export interface UserOnlineStatus {
  [status: string]: {
    icon: string;
    text: string;
  };
}

// 聊天对象信息
export interface UserInfoStore {
  // 用户ID
  [userId: string]: {
    id: string;
    name: string;
    avatar: string;
    // 签名
    signature: string;
    // 在线状态
    onlineStatus: string;
    // 拉黑
    block: boolean;
    // 来源
    source: string;
  };
}

// 聊天对象状态
export interface userObjectStatus {
  //用户ID
  [key: string]: userStatusInfo;
}

export interface userStatusInfo {
  // 特别关心
  concern: boolean;
  // 免打扰
  disturb: boolean;
  // 隐藏会话
  hide: boolean;
  // 置顶
  top: boolean;
  // 消息通知设置，disturb为false时生效
  notification: {
    //  通知消息预览
    preview: boolean;
    // 声音提醒
    sound: boolean;
    // 提示音
    // 来电铃声
  };
}
