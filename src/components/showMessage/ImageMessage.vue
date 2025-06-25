<template>
  <div class="message-bubble" @contextmenu="emit('contextmenu', $event)">
    <img :src="props.message.content" alt="" class="image" @click.prevent.left.stop="overlay = true" />
  </div>
  <v-overlay v-model="overlay"></v-overlay>
</template>

<script setup lang="ts">
import type { MessageDetail } from './type';
import { ref } from 'vue';

let overlay = ref(false);

// Props 定义
const props = defineProps<{
  message: MessageDetail;
}>();

// 事件

const emit = defineEmits<{
  (e: 'contextmenu', event: MouseEvent): void;
}>();
</script>

<script lang="ts">
export default {
  name: 'ImageMessage',
};
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
