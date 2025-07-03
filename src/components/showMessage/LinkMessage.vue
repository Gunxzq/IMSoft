<template>
  <div class="message-bubble">
    <!-- <div class="message-bubble-content">{{ message.content }}</div> -->
  </div>
</template>

<script setup lang="ts">
import type { MessageDetail } from './type';

// Props 定义
// const props = defineProps<{
//   message: MessageDetail;
// }>();
</script>

<script lang="ts">
export default {
  name: 'LinkMessage',
};
</script>
<style scoped>
.message-bubble {
  display: flex;
  max-width: 70%;
  margin: 8px 0;
}
</style>
