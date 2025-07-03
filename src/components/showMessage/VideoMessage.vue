<template>
  <div class="message-bubble">
    <div class="video-container" @click="togglePlay">
      <!-- 加载中状态 -->
      <div v-if="VideoDetail.playStatus === 'loading'" class="loading-overlay">
        <div class="spinner"></div>
        <span class="loading-text">加载中...</span>
      </div>

      <!-- 播放失败状态 -->
      <div v-else-if="VideoDetail.playStatus === 'error'" class="error-overlay">
        <svg class="error-icon" viewBox="0 0 24 24">
          <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
        </svg>
        <span class="error-text">播放失败</span>
        <button class="retry-btn" @click.stop="retryPlay">重试</button>
      </div>

      <!-- 视频预览/播放 -->
      <video
        v-show="VideoDetail.playStatus !== 'error'"
        ref="videoRef"
        :src="VideoDetail.url"
        :poster="VideoDetail.coverUrl || ''"
        class="video-element"
        @timeupdate="onTimeUpdate"
        @loadedmetadata="onLoadedMetadata"
        @play="onPlay"
        @pause="onPause"
        @ended="onEnded"
        @error="onError"></video>

      <!-- 播放进度条（仅播放时显示） -->
      <div v-if="VideoDetail.playStatus === 'playing'" class="progress-bar">
        <div class="progress-fill" :style="{ width: `${(VideoDetail.currentTime / VideoDetail.duration) * 100}%` }"></div>
      </div>
    </div>

    <!-- 视频信息区域 -->
    <div class="video-info">
      <!-- 时长显示 -->
      <span class="duration">{{ formattedDuration }}</span>

      <!-- 播放状态图标（可选） -->
      <span v-if="VideoDetail.playStatus === 'playing'" class="playing-icon">
        <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { MessageDetail, VideoMessage } from './type';
import { parseMessageContent } from '../../utils/tool';
// Props 定义
const props = defineProps<{ message: MessageDetail }>();

let obj = parseMessageContent(props.message.content);
let VideoDetail = ref<VideoMessage>({
  ...props.message,
  url: obj.url,
  coverUrl: obj.coverUrl,
  duration: obj.duration,
  currentTime: 0,
  playStatus: 'idle',
});
const videoRef = ref<HTMLVideoElement | null>(null);

// 计算属性：格式化后的时长（如 "0:15"）
const formattedDuration = computed(() => {
  const min = Math.floor(VideoDetail.value.duration / 60);
  const sec = VideoDetail.value.duration % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
});

// 播放状态管理（使用ref同步props）
const localPlayStatus = ref(VideoDetail.value.playStatus);

// 监听外部状态变化（如父组件更新播放状态）
watch(
  () => VideoDetail.value.playStatus,
  newStatus => {
    localPlayStatus.value = newStatus;
  },
);

const togglePlay = () => {
  console.log('togglePlay');
  if (!videoRef.value) return;

  if (localPlayStatus.value === 'playing') {
    videoRef.value.pause();
  } else {
    // 暂停其他可能正在播放的视频（全局管理）
    pauseAllOtherVideos();
    // videoRef.value.play();
  }
};

// 播放事件处理
const onPlay = () => {
  console.log('播放');
  localPlayStatus.value = 'playing';
  VideoDetail.value.playStatus = 'playing';
};

// 暂停事件处理
const onPause = () => {
  console.log('暂停');
  localPlayStatus.value = 'paused';
  VideoDetail.value.playStatus = 'paused';
};

// 结束事件处理
const onEnded = () => {
  console.log('ended');
  localPlayStatus.value = 'paused';
  VideoDetail.value.playStatus = 'paused';
  VideoDetail.value.currentTime = 0; // 重置进度
};

// 时间更新事件（更新当前播放进度）
const onTimeUpdate = () => {
  console.log('timeupdate');
  if (videoRef.value) {
    VideoDetail.value.currentTime = videoRef.value.currentTime;
  }
};

// 元数据加载完成（获取视频时长/尺寸）
const onLoadedMetadata = () => {
  console.log('onLoadedMetadata');
  if (videoRef.value) {
    // 同步视频元数据到消息对象（可选）
    VideoDetail.value.duration = videoRef.value.duration;
    localPlayStatus.value = 'loaded';
  }
};

// 错误处理
const onError = (e: any) => {
  console.log('onError', e);
  localPlayStatus.value = 'error';
  VideoDetail.value.playStatus = 'error';
};

// 重试播放
const retryPlay = () => {
  if (videoRef.value) {
    videoRef.value.load(); // 重新加载视频
    videoRef.value.play().catch(() => {
      localPlayStatus.value = 'error';
    });
  }
};

// 暂停其他视频（全局管理）
const pauseAllOtherVideos = () => {
  // 示例：调用全局视频管理器暂停其他视频
  // videoManager.pauseAllExcept(props.message.id);
};

// // 生命周期：组件卸载时暂停播放
// onMounted(() => {
//   return () => {
//     if (videoRef.value && localPlayStatus.value === 'playing') {
//       videoRef.value.pause();
//     }
//   };
// });
</script>

<script lang="ts">
export default {
  name: 'VideoMessage',
};
</script>

<style scoped lang="scss">
.message-bubble {
  display: flex;
  max-width: 70%;
  margin: 8px 0;
}

// 视频容器（点击区域）
.video-container {
  width: 100%;
  position: relative;
  cursor: pointer;
  background: #000; // 视频加载前背景色

  // 加载中状态
  .loading-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    color: white;

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #2196f3;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .loading-text {
      margin-top: 8px;
      font-size: 14px;
    }
  }

  // 错误状态
  .error-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.7);
    color: white;

    .error-icon {
      width: 48px;
      height: 48px;
      fill: #f44336;
    }

    .error-text {
      margin-top: 8px;
      font-size: 14px;
    }

    .retry-btn {
      margin-top: 12px;
      padding: 6px 16px;
      background: #2196f3;
      color: white;
      border: none;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;

      &:hover {
        background: #1976d2;
      }
    }
  }

  // 视频元素
  .video-element {
    width: 100%;
    height: auto;
    max-height: 300px; // 限制最大高度
    object-fit: contain;
  }

  // 进度条
  .progress-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 2px;

    .progress-fill {
      height: 100%;
      background: #2196f3;
      border-radius: 2px;
      transition: width 0.1s linear;
    }
  }
}

// 视频信息区域
.video-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: #666;

  .duration {
    white-space: nowrap;
  }

  .playing-icon {
    width: 20px;
    height: 20px;
    color: #2196f3;
  }
}

// 旋转动画
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
