// 消息类型枚举
export const MessageType = {
  TEXT: 'text',
  IMAGE: 'image',
  VOICE: 'voice',
  VIDEO: 'video',
  FILE: 'file',
  LOCATION: 'location',
  LINK: 'link',
} as const;

export type MessageType = (typeof MessageType)[keyof typeof MessageType];

export interface Message {
  id: string;
  serverId?: string;
  sender?: string;
  receiver?: string;
  type: MessageType;
  content: string;
  timestamp: number;
}

// 存放与聊天对象的最后会话信息,聚合存储
export interface AggregationStore {
  // 会话标识
  [AggregationKey: string]: {
    participants: string[];
    lastMessage: Message; // 最后一条消息
    // timestamp: number; // 最后消息时间戳
  };
}

// 会话类型枚举
export const ConversationType = {
  Direct: 'direct',
  Group: 'group',
} as const;

// 同时定义类型供后续使用
export type ConversationType = (typeof ConversationType)[keyof typeof ConversationType];

// 存放与对象的会话历史,会话存储
export interface ConversationStore {
  [id: string]: {
    // isGroup: boolean;
    participants: string[]; // 参与者列表（私聊：[userA, userB]，群聊：[userA, userB, userC...]）
    messages: Message[]; // 消息列表
  };
}

// 未读消息数
export interface UnreadCountStore {
  // 会话ID  -> 未读消息数
  [AggregationKey: string]: number;
}
