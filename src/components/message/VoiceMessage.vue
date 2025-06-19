<template>
  <div class="message-bubble">
    <div class="voice-container" @click="togglePlay">
      <!-- 波形图（动态/静态） -->
      <div class="waveform" :class="{ playing: VoliceDetail.playStatus === 'playing' }">
        <!-- 若有真实波形数据，渲染SVG；否则用CSS模拟 -->
        <!-- <template v-if="VoliceDetail.waveformData">
          <svg viewBox="0 0 100 40">
            <path :d="VoliceDetail.waveformData" fill="currentColor" />
          </svg>
        </template> -->
        <!-- <template v-else> -->
        <!-- 模拟波形（5个竖条，高度随机） -->
        <!-- <div v-for="i in 5" :key="i" class="wave-bar" :style="{ height: `${20 + Math.random() * 30}%` }"></div> -->
        <!-- </template> -->
      </div>

      <!-- 时长显示 -->
      <span class="duration">{{ formattedDuration }}</span>

      <!-- 播放状态图标（可选） -->
      <span v-if="VoliceDetail.playStatus === 'playing'" class="playing-icon">
        <svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /></svg>
      </span>
    </div>
    <!-- </div> -->
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { MessageDetail, VoiceMessage } from './type';
import { parseMessageContent } from '../../utils/tool';
// import

// Props 定义
const props = defineProps<{
  message: MessageDetail;
}>();

let obj = parseMessageContent(props.message.content);
let VoliceDetail = ref<VoiceMessage>({
  ...props.message,
  url: obj.url,
  duration: obj.duration,
  playStatus: 'idle',
});

const formattedDuration = computed(() => {
  const min = Math.floor(VoliceDetail.value.duration / 60);
  const sec = VoliceDetail.value.duration % 60;
  return `${min}:${sec.toString().padStart(2, '0')}`;
});

// 播放状态管理（使用ref避免响应式丢失）
const isPlaying = ref(VoliceDetail.value.playStatus === 'playing');

// 监听外部状态变化（如父组件更新播放状态）
watch(
  () => VoliceDetail.value.playStatus,
  newStatus => {
    isPlaying.value = newStatus === 'playing';
  },
);

// 切换播放/暂停
const togglePlay = async () => {
  if (isPlaying.value) {
    // 暂停当前播放
    await pauseAudio();
  } else {
    // 播放新语音（先暂停其他可能正在播放的语音）
    await stopAllOtherVoices();
    await playAudio();
  }
};

// 播放音频
const playAudio = () => {
  return new Promise((resolve, reject) => {
    const audio = new Audio(VoliceDetail.value.url);
    audio
      .play()
      .then(() => {
        isPlaying.value = true;
        VoliceDetail.value.playStatus = 'playing'; // 更新状态（需确保props可写或通过Vuex/Pinia同步）
        audio.onended = () => {
          isPlaying.value = false;
          VoliceDetail.value.playStatus = 'played';
          resolve(0);
        };
      })
      .catch(err => {
        console.error('播放失败:', err);
        // 显示错误状态（如红色图标）
        reject(err);
      });
  });
};

// 暂停音频
const pauseAudio = () => {
  const audio = new Audio(VoliceDetail.value.url);
  audio.pause();
  isPlaying.value = false;
  VoliceDetail.value.playStatus = 'idle';
};

// 停止其他语音（假设通过Pinia管理全局播放状态）
const stopAllOtherVoices = () => {
  // 示例：调用全局音频管理器暂停其他语音
  // audioManager.pauseAllExcept(props.message.id);
};
</script>

<style scoped lang="scss">
.message-bubble {
  display: flex;
  max-width: 70%;
  margin: 8px 0;
}
.voice-message {
  display: flex;
  margin: 12px 0;
  max-width: 70%; // 限制消息宽度

  // 单聊/群聊布局
  &.self {
    flex-direction: row-reverse;
    margin-left: auto;
  }
  &.group {
    margin-left: 8px;
  }

  // 头像（群聊时显示）
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin: 0 12px;
  }

  // 消息气泡
  .message-bubble {
    background: #fff;
    border-radius: 12px;
    padding: 12px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    gap: 12px;

    .self & {
      background: #e1f5fe; // 自己消息的背景色
    }
  }

  // 语音容器（点击区域）
  .voice-container {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    min-width: 80px; // 防止过窄

    &:hover {
      opacity: 0.9;
    }
  }

  // 波形图容器
  .waveform {
    flex: 1;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #666; // 未播放时颜色

    &.playing {
      color: #2196f3; // 播放中颜色
    }

    // 动态波形（若使用SVG）
    svg {
      width: 100%;
      height: 100%;
    }

    // 模拟波形（备用方案）
    .wave-bar {
      width: 4px;
      background: currentColor;
      border-radius: 2px;
      transition: height 0.2s ease;
    }
  }

  // 时长显示
  .duration {
    font-size: 12px;
    color: #999;
    white-space: nowrap;
  }

  // 播放状态图标（如扬声器）
  .playing-icon {
    width: 20px;
    height: 20px;
    color: #2196f3;
  }
}
</style>
