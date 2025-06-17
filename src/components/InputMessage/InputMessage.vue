<!-- ChatInput.vue -->
<template>
  <div class="chat-input-container">
    <!-- 输入区域 -->
    <div class="input-wrapper" ref="inputWrapperRef">
      <textarea
        v-model="inputContent"
        class="message-input"
        placeholder="请输入消息..."
        @input="adjustTextareaHeight"
        @keydown.enter.prevent="handleSend"
        ref="textareaRef"
        :disabled="isSending"></textarea>
      <div class="input-actions">
        <button class="send-btn" :class="{ active: canSend }" @click="handleSend" :disabled="isSending || !canSend">
          <span v-if="isSending" class="sending-loader"></span>
          <span v-else>发送</span>
        </button>
      </div>
    </div>

    <!-- 更多功能栏 -->
    <div class="more-actions" v-if="showMoreActions">
      <button @click="toggleMoreActions">
        <i class="icon-more"></i>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';
import { useChatStore } from '@/stores/chat';

const chatStore = useChatStore();
const inputContent = ref('');
const isSending = ref(false);
const textareaRef = ref(null);
const inputWrapperRef = ref(null);
const showMoreActions = ref(false);

// 计算属性：是否可以发送消息
const canSend = computed(() => {
  return inputContent.value.trim().length > 0;
});

// 调整文本域高度
const adjustTextareaHeight = () => {
  const textarea = textareaRef.value;
  if (textarea) {
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
  }
};

// 发送消息
const handleSend = async () => {
  if (!canSend.value || isSending.value) return;

  const message = inputContent.value.trim();
  isSending.value = true;

  try {
    // 调用Pinia action发送消息
    await chatStore.sendMessage(message);
    inputContent.value = '';
    adjustTextareaHeight();

    // 聊天窗口滚动到底部
    nextTick(() => {
      chatStore.scrollToBottom();
    });
  } catch (error) {
    console.error('发送消息失败:', error);
    // 显示错误提示
    chatStore.setErrorMessage('消息发送失败，请重试');
  } finally {
    isSending.value = false;
  }
};

// 切换更多操作面板
const toggleMoreActions = () => {
  showMoreActions.value = !showMoreActions.value;
};

// 监听全局按键事件（如按Enter发送）
onMounted(() => {
  document.addEventListener('keydown', e => {
    // Ctrl+Enter发送消息
    if (e.ctrlKey && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });
});
</script>

<style scoped>
.chat-input-container {
  display: flex;
  flex-direction: column;
  border-top: 1px solid #e6e6e6;
  background-color: #f9f9f9;
}

.input-wrapper {
  display: flex;
  padding: 12px;
}

.message-input {
  flex: 1;
  border: 1px solid #ddd;
  border-radius: 4px;
  padding: 10px;
  resize: none;
  outline: none;
  font-family: inherit;
  min-height: 40px;
  max-height: 150px;
  transition: height 0.2s;
}

.input-actions {
  margin-left: 8px;
  display: flex;
  align-items: flex-end;
}

.send-btn {
  padding: 8px 16px;
  border-radius: 20px;
  background-color: #f0f0f0;
  color: #333;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.send-btn:hover:not(:disabled) {
  background-color: #e0e0e0;
}

.send-btn.active {
  background-color: #007bff;
  color: white;
}

.sending-loader {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.more-actions {
  display: flex;
  justify-content: center;
  padding: 8px 0;
}
</style>
