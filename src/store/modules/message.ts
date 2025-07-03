import { defineStore, storeToRefs } from 'pinia';
import { ref, computed, reactive } from 'vue';
// import WebSocketServiceIstance from '../../utils/websockets/websokcet';
import type { Message, ConversationStore, AggregationStore, UnreadCountStore, MessageType } from './types/message';
import { formatTime, getAggregationKey, getGroupKey, getKey, isGroupId } from '../../utils/tool';
import { getAggregationStore, getUnreadCounts, getConversations } from '../../utils/localStorage';
import { generateMessageId } from '../../utils/tool';
import { useUserInfoStore } from './userInfo';

export const useMessageStore = defineStore('messages', () => {
  const { userId } = storeToRefs(useUserInfoStore());

  let conversationStore = reactive<ConversationStore>(getConversations(userId.value));

  let aggregationStore = reactive<AggregationStore>(getAggregationStore(userId.value));

  let unreadCountStore = reactive<UnreadCountStore>(getUnreadCounts(userId.value));

  // 当前会话ID
  let currentConversationId = ref('A');

  // 当前消息
  let currentMessage = ref<string>('');
  /**
   * 发送消息
   * @param senderId
   * @param receiverId
   * @param content
   */
  const sendMessage = (
    senderId: string,
    receiverId: string,
    content: string,
    type: MessageType,
    // 可指定的字段
    isGroup: boolean = false,
    groupId?: string,
    isSelf: boolean = true,
  ) => {
    const newMessage: Message = {
      id: generateMessageId(),
      sender: senderId,
      receiver: receiverId,
      content,
      type,
      timestamp: Date.now(),
    };
    // 为防止群聊key的不同，将组id与用户id拼接
    let AggregationKey = isGroup ? getGroupKey(groupId as string) : getAggregationKey(senderId, receiverId);

    // 更新会话列表信息
    updateAggregations(AggregationKey, senderId, receiverId, newMessage, isGroup, groupId);

    // 更新当前会话
    updateConversations(AggregationKey, senderId, receiverId, newMessage, isGroup, groupId);

    // 更新未读数
    isSelf ? (unreadCountStore[AggregationKey] = 0) : unreadCountStore[AggregationKey]++;

    console.log(getKey([currentConversationId.value, userId.value]));
  };

  /**
   * 更新会话
   * @returns 会话消息列表
   */
  const currentConversations = computed(() => {
    console.log('currentConversations', conversationStore);
    const conv = conversationStore[getKey([currentConversationId.value, userId.value])];
    // 防御性判断，确保 messages 存在且为数组
    if (!conv || !Array.isArray(conv.messages)) {
      return [];
    }

    return conv.messages
      .map(message => {
        return {
          id: message.id,
          content: message.content,
          type: message.type,
          time: formatTime(message.timestamp),
          isSelf: message.sender === userId.value,
          userId: message.sender,
          // avatar: userInfoStore[message.sender]?.avatar,
          // name: userInfoStore[message.sender]?.name
        };
      })
      .sort((a: any, b: any): any => {
        return (b?.timestamp || 0) - (a.timestamp || 0);
      });
  });
  //更新当前会话
  const updateConversations = (
    AggregationKey: string,
    senderId: string,
    receiverId: string,
    message: Message,
    isGroup: boolean = false,
    groupId?: string,
  ) => {
    if (!conversationStore[AggregationKey]) {
      conversationStore[AggregationKey] = {
        participants: isGroup ? [getGroupKey(groupId as string), ...[senderId, receiverId]] : [senderId, receiverId],
        messages: [],
      };
    }
    const conv = conversationStore[AggregationKey];

    // 更新群组参与者
    if (isGroup) {
      // 如果参与者不包含senderId，receiverId
      if (!conv.participants.includes(senderId) || !conv.participants.includes(receiverId)) {
        conv.participants.push(senderId, receiverId);
      }
    }

    // 更新消息
    conv.messages.push(message);

    console.log('conversationStore', conversationStore);

    if (unreadCountStore[AggregationKey] === undefined) {
      unreadCountStore[AggregationKey] = 0;
    }
  };
  /**
   * 获取所有的会话列表信息
   * @returns 会话信息列表
   */
  const currentAggregations = computed(() => {
    return Object.values(aggregationStore)
      .map(agg => {
        return {
          id: agg.lastMessage.id,
          content: isGroupId(agg.participants[0])
            ? agg.lastMessage.sender === userId.value
              ? agg.lastMessage.content
              : '' + agg.lastMessage.content
            : agg.lastMessage.content,
          type: agg.lastMessage.type,
          time: formatTime(agg.lastMessage.timestamp),
          userId: isGroupId(agg.participants[0])
            ? agg.participants[0]
            : agg.lastMessage.sender === userId.value
            ? agg.lastMessage.receiver
            : agg.lastMessage.sender,
          isGroup: isGroupId(agg.participants[0]),
          unreadCount: unreadCountStore[getKey(agg.participants)],
        };
      })
      .sort((a: any, b: any): any => {
        return (b.lastMessage?.timestamp || 0) - (a.lastMessage?.timestamp || 0);
      });
  });

  /**
   * 更新会话列表信息
   * @param message 消息
   */
  const updateAggregations = (
    AggregationKey: string,
    senderId: string,
    receiverId: string,
    message: Message,
    isGroup: boolean = false,
    groupId?: string,
  ) => {
    if (!aggregationStore[AggregationKey]) {
      aggregationStore[AggregationKey] = {
        // 群聊的情况下，第一个值为群id
        participants: isGroup ? [getGroupKey(groupId as string), ...[senderId, receiverId]] : [senderId, receiverId],
        lastMessage: message,
        // timestamp: message.timestamp,
      };
    }
    const aggregation = aggregationStore[AggregationKey];

    // 更新最新消息
    aggregation.lastMessage = message;
    // aggregation.timestamp = message.timestamp;

    if (unreadCountStore[AggregationKey] === undefined) {
      unreadCountStore[AggregationKey] = 0;
    }
  };

  /**
   * 删除消息
   */
  const deleteMessage = (messageId: string) => {
    const Key = getKey([currentConversationId.value, userId.value]);
    let messageList = conversationStore[Key].messages;
    // 如果是末尾元素,更新聚合消息
    if (messageId === aggregationStore[Key].lastMessage.id) {
      aggregationStore[Key].lastMessage = messageList[messageList.length - 1];
    }
    // 删除消息
    messageList = messageList.filter(message => message.id !== messageId);
    conversationStore[Key].messages = messageList;
  };

  // 暴露
  return { sendMessage, currentAggregations, currentConversations, currentConversationId, currentMessage, deleteMessage };
});
