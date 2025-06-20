<template>
  <div class="message-bubble">
    <img :src="props.message.content" alt="" class="image" />
  </div>
</template>

<script setup lang="ts">
import type { MessageDetail } from './type';

// Props 定义
const props = defineProps<{
  message: MessageDetail;
}>();
</script>

<style scoped>
.message-bubble {
  display: flex;
  max-width: 70%;
  margin: 8px 0;
}

.image {
  max-width: 100%;
  max-height: 100%;
}
</style>
