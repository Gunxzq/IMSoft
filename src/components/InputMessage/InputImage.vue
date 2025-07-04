<template>
  <div @click="overlay = true">
    <v-icon size="40">{{ icon }}</v-icon>
    <span style="display: block">{{ label }}</span>
  </div>

  <v-overlay v-model="overlay">
    <div class="image-uploader" @click="overlay = false">
      <div
        class="upload-area"
        @dragover.prevent="handleDragOver"
        @drop.prevent="handleDrop"
        @dragleave="handleDragLeave"
        @click.stop="triggerFileInput">
        <input ref="fileInput" type="file" accept="image/*" multiple @change="handleFileSelect" style="display: none" />
        <div v-if="files.length === 0" class="placeholder">拖拽图片至此或点击上传</div>
      </div>
    </div>
  </v-overlay>
</template>

<script setup lang="ts">
import { onBeforeUnmount, ref, reactive } from 'vue';
import type { CompressedFile } from './type';
import { useUploadStore, useUserInfoStore, useMessageStore } from '../../store';
import { MessageType } from '../../store/modules/types/message';

const userInfoStore = useUserInfoStore();
const uploadStore = useUploadStore();
const messageStore = useMessageStore();
// 事件
const emit = defineEmits(['change', 'remove', 'upload']);

defineProps({
  icon: String,
  label: String,
});

let overlay = ref(false);
let files = reactive<CompressedFile[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);

const handleDragOver = (e: DragEvent) => {
  e.preventDefault();
  // console.log('handleDragOver', e.dataTransfer);
};

const handleDragLeave = (e: DragEvent) => {
  e.preventDefault();
  // console.log('handleDragLeave', e.dataTransfer);
};
// 处理文件选择
const handleFileSelect = async (e: Event) => {
  console.log('handleFileSelect');
  const input = e.target as HTMLInputElement;
  console.log(input.files);
  if (input.files) {
    const validFiles = Array.from(input.files).filter(file => file.type.startsWith('image/'));
    uploadStore.addFiles(validFiles, 'Image');
    // 压缩图片
    uploadStore.startProcessing('Image', data => {
      console.log('开始压缩图片');
      messageStore.sendMessage(userInfoStore.userId, messageStore.currentConversationId, data[0].base64, MessageType.IMAGE);
    });
  }
};
const handleDrop = async (e: DragEvent) => {
  e.preventDefault(); // 阻止默认行为
  // console.log('handleDrop', e.dataTransfer.files);

  if (!e.dataTransfer) {
    console.warn('dataTransfer is null or undefined');
    return;
  }
  const { files } = e.dataTransfer;

  if (!files || files.length === 0) {
    console.warn('No files were dropped.');
    return;
  }
  if (e.dataTransfer?.files) {
    const validFiles = Array.from(e.dataTransfer.files).filter(file => file.type.startsWith('image/'));

    uploadStore.addFiles(validFiles, 'Image');
    // 压缩图片
    uploadStore.startProcessing('Image', data => {
      console.log('开始压缩图片', data);
      messageStore.sendMessage(userInfoStore.userId, messageStore.currentConversationId, data[0].base64, MessageType.IMAGE);
    });
  }
};

// 触发文件选择
const triggerFileInput = () => {
  try {
    fileInput.value?.click();
    console.log('触发文件选择');
  } catch (error) {
    console.log(error);
  }
};

onBeforeUnmount(() => {
  uploadStore.clearFiles('Image');
});
</script>
<script lang="ts">
export default {
  name: 'InputImage',
};
</script>
<style scoped lang="scss">
.image-uploader {
  margin: 0 auto;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.upload-area {
  height: 80vh;
  width: 80vh;
  border: 2px dashed #ccc;
  border-radius: 8px;
  padding: 40px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
}

.upload-area:hover {
  border-color: #2196f3;
}

.placeholder {
  color: #666;
  margin-top: 50%;
  font-size: 16px;
}
</style>
