<template>
  <div style="height: 800px; width: 800px; border: 1px solid red">
    <messageList :messages="messageStore.currentConversations"></messageList>
  </div>
  <InputMessage class="input-message"></InputMessage>
</template>
<script setup>
import messageList from './components/showMessage/messageList.vue';
import InputMessage from './components/InputMessage/Input.vue';
import { useMessageStore } from './store/modules/message';

const messageStore = useMessageStore();
</script>

<style scoped>
.input-message {
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
