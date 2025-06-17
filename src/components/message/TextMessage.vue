<template>
  <div class="message-bubble">
    <!-- 消息内容 -->
    <div class="message-content">
      <!-- 文本内容（支持表情、@提及高亮） -->
      <!-- <div class="text-content" v-html="renderedContent"></div> -->

      <div class="text-content">
        <p>{{ message.content }}</p>
      </div>
      <!-- 时间戳 -->
      <span class="timestamp">
        {{ message.time }}
      </span>
    </div>

    <!-- 自己发送的消息状态 -->
    <div v-if="message.isSelf" class="message-status">
      <!-- <span v-if="message.status === MessageStatus.SENDING">发送中...</span>
      <span v-else-if="message.status === MessageStatus.FAILED">发送失败 ⚠️</span> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MessageDetail } from './type';
import { computed } from 'vue';

// Props 定义
const props = defineProps<{
  message: MessageDetail;
}>();

// let message: MessageDetail = {
//   content: 'hello world',
//   isSelf: true,
//   id: '1',
//   time: '2023-01-01 00:00:00',
//   type: 'text',
//   userId: '1',
// };

// // 处理表情和@提及
// const renderedContent = computed(() => {
//   const rawContent = props.message.content;
//   const withEmoticons = parseEmoticons(rawContent); // 表情转图片（如 😊 → <img src="smile.png">）
//   return highlightAtMentions(withEmoticons); // @提及高亮（如 @张三 → <span class="at-mention">@张三</span>）
// });
</script>

<style scoped>
.message-bubble {
  display: flex;
  max-width: 70%;
  margin: 8px 0;
}

.self {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.other {
  align-self: flex-start;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 8px;
}

.message-content {
  background: #fff;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
}

.self .message-content {
  background: #e1f5fe; /* 自己消息的背景色 */
}

.text-content {
  white-space: pre-wrap; /* 保留换行 */
  word-break: break-word;
}

.timestamp {
  font-size: 12px;
  color: #999;
  display: block;
  margin-top: 4px;
}

.at-mention {
  color: #2196f3;
  cursor: pointer;
}
</style>
