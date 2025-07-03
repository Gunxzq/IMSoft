<template>
  <div class="message-bubble">
    <!-- 消息内容 -->
    <div class="message-content">
      <!-- 文本内容（支持表情、@提及高亮） -->
      <!-- <div class="text-content" v-html="renderedContent"></div> -->

      <div v-if="loading" class="text-content">加载中...</div>
      <div v-else class="text-content" v-html="parsedHtml"></div>
      <!-- 时间戳 -->
      <!-- <span class="timestamp">
        {{ message.time }}
      </span> -->
    </div>

    <!-- 自己发送的消息状态 -->
    <div v-if="message.isSelf" class="message-status">
      <!-- <span v-if="message.status === MessageStatus.SENDING">发送中...</span>
      <span v-else-if="message.status === MessageStatus.FAILED">发送失败 ⚠️</span> -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { MessageDetail } from './type';
import { marked } from 'marked';
import DOMPurify from 'dompurify';

const parsedHtml = ref<string>('');
const loading = ref<boolean>(true);

// Props 定义
const props = defineProps<{
  message: MessageDetail;
}>();

watch(
  () => props.message.content,
  async newContent => {
    if (!newContent) return;

    loading.value = true;
    try {
      const rawHtml = await marked.parse(newContent);
      parsedHtml.value = DOMPurify.sanitize(rawHtml);
    } catch (error) {
      console.error('Markdown 解析失败:', error);
      parsedHtml.value = `<p style="color:red;">解析失败: ${newContent}</p>`;
    } finally {
      loading.value = false;
    }
  },
  { immediate: true },
);

// 导出方法
defineExpose({});
</script>
<script lang="ts">
export default {
  name: 'TextMessage',
};
</script>

<style scoped>
.message-bubble {
  display: flex;
  max-width: 70%;
  margin: 8px 0;
}

.message-content {
  background: #fff;
  padding: 12px;
  border-radius: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
}

.text-content {
  /* white-space: pre-wrap;  */
  word-break: break-word;
  text-align: left;
}

.timestamp {
  font-size: 12px;
  color: #999;
  display: block;
  margin-top: 4px;
}
</style>
