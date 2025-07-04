<template>
  <div style="height: 800px; width: 800px; border: 1px solid red">
    <messageList :messages="messageStore.currentConversations"></messageList>
  </div>
  <InputMessage class="input-message"></InputMessage>
  <global-menu></global-menu>
</template>
<script setup lang="ts">
import messageList from './components/showMessage/messageList.vue';
import InputMessage from './components/InputMessage/Input.vue';
import { useMessageStore, useGlobalMenuStore } from './store';
import { onMounted, onUnmounted } from 'vue';

const messageStore = useMessageStore();
const globalMenuStore = useGlobalMenuStore();

onMounted(() => {
  // 注册右键事件
  window.addEventListener('contextmenu', e => {
    e.preventDefault();
    globalMenuStore.hideMenu();
  });
  // 左键
  window.addEventListener('click', () => {
    globalMenuStore.hideMenu();
  });
});

// 移除
onUnmounted(() => {
  window.removeEventListener('contextmenu', e => {
    e.preventDefault();
  });
  // 左键
  window.addEventListener('click', () => {
    // e.preventDefault();
  });
});
</script>

<style scoped lang="scss">
@import url(./styles.scss);
.input-message {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
