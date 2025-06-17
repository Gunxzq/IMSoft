<template>
  <p>测试</p>
  <p>发出消息</p>
  <input v-model="message" @keyup.enter="sendMessage" />
  <select v-model="messageStore.currentConversationId">
    <option value="A">用户A</option>
    <option value="B">用户B</option>
  </select>
  <div>
    <p>收到消息</p>
    <input v-model="message1" @keyup.enter="reciveMessage" />
    <p>消息列表</p>
    <ul>
      <li v-for="(msg, index) in messageStore.currentAggregations" :key="index">
        <p>用户ID:{{ msg.userId }}</p>
        <p>发送时间：{{ msg.timestamp }}</p>
        <p>消息内容：{{ msg.lastMessage.content }}</p>
        <p>未读数：{{ msg.unreadCount }}</p>
      </li>
    </ul>
  </div>
  <div>
    <p>历史消息</p>
    <ul>
      <li v-for="(msg, index) in messageStore.currentConversations" :key="index">
        <p>用户ID:{{ msg.userId }}</p>
        <p>发送时间：{{ msg.timestamp }}</p>
        <p>消息内容：{{ msg.content }}</p>
        <p>是否为自己：{{ msg.isSelf }}</p>
        <!-- <p>未读数：{{ msg.unreadCount }}</p> -->
      </li>
    </ul>
  </div>
</template>

<script setup>
// import { connect } from 'http2';
// import WebSocketServiceIstance from './utils/websockets/websokcet';
import { useMessageStore } from './store/modules/message';

import { onMounted, ref } from 'vue';

let message = ref('');
let message1 = ref('');
const messageStore = useMessageStore();
const sendMessage = async () => {
  messageStore.sendMessage('用户', messageStore.currentConversationId, message.value, true, false, '');
  message.value = '';
};

const reciveMessage = async () => {
  messageStore.sendMessage('用户', messageStore.currentConversationId, message1.value, false, false, '');
  message1.value = '';
};
</script>

<style scoped></style>
