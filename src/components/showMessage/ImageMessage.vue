<template>
  <div class="message-bubble" @contextmenu="emit('contextmenu', $event)">
    <img
      :src="props.message.content"
      alt=""
      class="image"
      @click.prevent.left.stop="overlay = true"
      @click.right.prevent.stop="handleRightClick(props.message, $event)" />
  </div>
  <v-overlay v-model="overlay"></v-overlay>
</template>

<script setup lang="ts">
import type { MessageDetail } from './type';
import { CommonContentMenuItems, env, type contextEnv, eventEmitter, EventName } from '../../utils';
import type { ContextMenuItem } from '../../store/modules/types';
import { ref } from 'vue';

let overlay = ref(false);
const contextMenuItem = ref<ContextMenuItem[]>([
  {
    text: '下载',
    action: 'click',
    callback: (context: contextEnv) => {
      const base64Data = context.message.content; // 假设 props.message.content 是 Base64 数据
      saveBase64AsImage(base64Data, 'image.png'); //
    },
  },
]);

const saveBase64AsImage = (base64: string, filename: string, mimeType: string = 'image/png') => {
  const byteString = atob(base64.split(',')[1]);
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const int8Array = new Uint8Array(arrayBuffer);

  for (let i = 0; i < byteString.length; i++) {
    int8Array[i] = byteString.charCodeAt(i);
  }

  const blob = new Blob([arrayBuffer], { type: mimeType });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
// 右键菜单
const handleRightClick = (item: any, e: MouseEvent) => {
  // 合并，初始化
  env.GlobalMenuStore.initItem([...CommonContentMenuItems, ...contextMenuItem.value], {
    ...env,
    message: item,
  });
  e.preventDefault();
  console.log('item', item);
  try {
    env.GlobalMenuStore.showMenu(e.clientX, e.clientY);

    console.log('globalMenuStore', env.GlobalMenuStore.showContextMenu);
  } catch (error) {
    console.log('error', error);
  }
};
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
.image {
  max-width: 100%;
  max-height: 100%;
}
</style>
