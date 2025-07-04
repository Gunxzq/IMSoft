<template>
  <div class="message-bubble">
    <!-- 文件信息区域 -->
    <div class="file-info">
      <!-- 文件名（可点击下载/预览） -->
      <div class="file-name" @click="handleFileClick" :title="FileDetail.fileName">
        {{ FileDetail.fileName }}
      </div>

      <!-- 文件大小与状态 -->
      <div class="file-meta">
        <span class="file-size">{{ FileDetail.fileSize }}</span>

        <!-- 下载状态标签 -->
        <span class="status-tag" :class="statusClass">
          {{ statusText }}
          <span v-if="FileDetail.downloadStatus === 'downloading'" class="progress">{{ FileDetail.progress }}%</span>
        </span>
      </div>
    </div>

    <!-- 文件类型图标 -->
    <div class="file-icon">
      <img :src="FileDetail.typeIcon" alt="文件类型" />
    </div>
    <!-- 下载按钮（未下载时显示） -->
    <button v-if="FileDetail.downloadStatus === 'idle'" class="download-btn" @click.stop="downloadFile">下载</button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { MessageDetail, FileMessage } from './type';
import { parseMessageContent } from '../../utils';
// Props 定义
const props = defineProps<{ message: MessageDetail }>();

let obj = parseMessageContent(props.message.content);
let FileDetail = ref<FileMessage>({
  ...props.message,
  fileName: obj.fileName,
  fileSize: obj.fileSize,
  fileUrl: obj.fileUrl,
  typeIcon: obj.typeIcon,
  previewUrl: obj.previewUrl,
  downloadStatus: obj.downloadStatus,
  progress: 0,
});

const statusText = computed(() => {
  switch (FileDetail.value.downloadStatus) {
    case 'downloading':
      return '下载中';
    case 'downloaded':
      return '已下载';
    case 'failed':
      return '下载失败';
    default:
      return '点击下载';
  }
});

const statusClass = computed(() => {
  return {
    idle: FileDetail.value.downloadStatus === 'idle',
    downloading: FileDetail.value.downloadStatus === 'downloading',
    downloaded: FileDetail.value.downloadStatus === 'downloaded',
    failed: FileDetail.value.downloadStatus === 'failed',
  };
});

const downloadFile = async () => {
  try {
    // 更新状态为下载中
    FileDetail.value.downloadStatus = 'downloading';
    FileDetail.value.progress = 0;

    // 模拟下载进度（实际通过 XHR 或 Fetch API 监听进度）
    const response = await fetch(FileDetail.value.fileUrl);
    const blob = await response.blob();

    // 更新进度（示例：模拟5秒完成）
    for (let i = 0; i <= 100; i += 10) {
      FileDetail.value.progress = i;
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    // 生成下载链接并触发下载
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = FileDetail.value.fileName;
    a.click();
    window.URL.revokeObjectURL(url);

    // 更新状态为已下载
    FileDetail.value.downloadStatus = 'downloaded';
  } catch (error) {
    console.error('下载失败:', error);
    FileDetail.value.downloadStatus = 'failed';
  }
};

// 点击文件名/图标处理（预览或下载）
const handleFileClick = () => {
  if (FileDetail.value.downloadStatus === 'downloaded') {
    // 已下载：直接打开文件（或跳转到下载页）
    window.open(FileDetail.value.fileUrl);
  } else if (FileDetail.value.downloadStatus === 'idle') {
    // 未下载：触发下载
    downloadFile();
  }
};
</script>
<script lang="ts">
export default {
  name: 'FileMessage',
};
</script>
<style lang="scss">
// 文件类型图标
.file-icon {
  width: 30%;
  // height: 40px;
  aspect-ratio: 1/1;
  // background-color: black;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

// 文件信息区域
.file-info {
  flex: 1;
  min-width: 0; // 防止溢出
  .file-name {
    // 左对齐
    text-align: left;
    font-weight: 500;
    font-size: 30px;
    color: #333;
    margin-bottom: 4px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:hover {
      color: #2196f3;
    }
  }

  .file-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: #666;

    .file-size {
      color: #999;
    }

    .status-tag {
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 12px;

      &.idle {
        background: #f0f0f0;
      }
      &.downloading {
        background: #e3f2fd;
        color: #2196f3;
      }
      &.downloaded {
        background: #e8f5e9;
        color: #4caf50;
      }
      &.failed {
        background: #ffebee;
        color: #f44336;
      }

      .progress {
        margin-left: 4px;
      }
    }
  }

  .preview-thumbnail {
    width: 80px;
    height: 60px;
    border-radius: 4px;
    overflow: hidden;
    margin-top: 4px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

// 下载按钮
.download-btn {
  background: #2196f3;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 12px;
  font-size: 12px;
  cursor: pointer;
  margin-left: 8px;

  &:hover {
    background: #1976d2;
  }
}
</style>
