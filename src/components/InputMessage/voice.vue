<template>
  <button
    class="record-btn"
    @click="toggleRecording"
    :class="{
      recording: recordingStatus === 'recording',
      inactive: recordingStatus === 'inactive',
    }">
    按住说话
  </button>
</template>

<script setup lang="ts">
// 录制音频的功能
import { ref, computed } from 'vue';

// 音频有关状态

// 解析器
const mediaRecorder = ref<MediaRecorder | null>(null);

// 音频二进制数据
const audioChunks = ref<Blob[]>([]);

// 录音器状态
const recordingStatus = ref('inactive');

// 录音时长
const recordingDuration = ref(0);

const recordingTimer = ref(null);

const recordingWaves = ref(Array(5).fill(2)); // 录音波形动画

const recordedAudioUrl = ref(''); // 录制完成的音频URL

const recordText = computed(() => {
  switch (recordingStatus.value) {
    case 'recording':
      return '松开结束';
    case 'paused':
      return '继续录音';
    default:
      return '按住说话';
  }
});

// 开始/暂停录音
const toggleRecording = async () => {
  if (recordingStatus.value === 'inactive') {
    await startRecording();
  } else if (recordingStatus.value === 'recording') {
    pauseRecording();
  } else if (recordingStatus.value === 'paused') {
    resumeRecording();
  }
};

// 开始录音
const startRecording = async () => {
  try {
    // 请求麦克风权限
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // 初始化MediaRecorder
    mediaRecorder.value = new MediaRecorder(stream);
    audioChunks.value = [];

    // 监听数据可用事件
    mediaRecorder.value.ondataavailable = event => {
      if (event.data.size > 0) {
        audioChunks.value.push(event.data);
      }
    };

    // 录音停止事件
    mediaRecorder.value.onstop = () => {
      // 生成音频Blob并创建URL
      const audioBlob = new Blob(audioChunks.value, { type: 'audio/webm' });
      recordedAudioUrl.value = URL.createObjectURL(audioBlob);

      // 将音频添加到输入内容（可选）
      inputContent.value += `[录音:${formatTime(recordingDuration.value)}]`;

      // 重置状态
      resetRecordingState();
    };

    // 开始录音
    mediaRecorder.value.start();
    recordingStatus.value = 'recording';
    recordingDuration.value = 0;

    // 启动计时器更新时长
    recordingTimer.value = setInterval(() => {
      recordingDuration.value++;
      updateRecordingWaves();
    }, 1000);
  } catch (error) {
    console.error('录音失败:', error);
    chatStore.setErrorMessage('无法访问麦克风，请检查权限设置');
  }
};

// 暂停录音
const pauseRecording = () => {
  if (mediaRecorder.value && mediaRecorder.value.state === 'recording') {
    mediaRecorder.value.pause();
    recordingStatus.value = 'paused';
    clearInterval(recordingTimer.value);
  }
};

// 继续录音
const resumeRecording = () => {
  if (mediaRecorder.value && mediaRecorder.value.state === 'paused') {
    mediaRecorder.value.resume();
    recordingStatus.value = 'recording';
    recordingTimer.value = setInterval(() => {
      recordingDuration.value++;
      updateRecordingWaves();
    }, 1000);
  }
};

// 取消录音
const cancelRecording = () => {
  if (mediaRecorder.value) {
    mediaRecorder.value.stop();
    mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
  }
  clearInterval(recordingTimer.value);
  URL.revokeObjectURL(recordedAudioUrl.value);
  recordedAudioUrl.value = '';
  resetRecordingState();
};

// 完成录音（发送）
const finishRecording = async () => {
  if (mediaRecorder.value && recordingStatus.value === 'recording') {
    mediaRecorder.value.stop();
    mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
  }

  clearInterval(recordingTimer.value);
  recordingStatus.value = 'inactive';

  // 如果没有录制内容，直接返回
  if (!recordedAudioUrl.value) return;

  // 将音频作为消息发送
  const audioMessage = {
    type: 'audio',
    content: recordedAudioUrl.value,
    duration: recordingDuration.value,
    timestamp: new Date(),
  };

  try {
    isSending.value = true;
    await chatStore.sendMessage(audioMessage);
    recordedAudioUrl.value = '';
    resetRecordingState();
  } catch (error) {
    console.error('发送音频失败:', error);
    chatStore.setErrorMessage('音频发送失败，请重试');
  } finally {
    isSending.value = false;
  }
};

// 更新录音波形动画
const updateRecordingWaves = () => {
  // 模拟录音波形效果
  recordingWaves.value = Array(5)
    .fill(0)
    .map(() => {
      return Math.floor(Math.random() * 10) + 2; // 2-12px随机高度
    });
};

// 重置录音状态
const resetRecordingState = () => {
  clearInterval(recordingTimer.value);
  recordingWaves.value = Array(5).fill(2);
  recordingDuration.value = 0;
};

// 格式化时间（秒转MM:SS）
const formatTime = seconds => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

// 发送消息（保留原有逻辑）
const handleSend = async () => {
  if (!canSend.value || isSending.value) return;

  const message = inputContent.value.trim();
  isSending.value = true;

  try {
    // 调用Pinia action发送消息
    await chatStore.sendMessage(message);
    inputContent.value = '';
    adjustTextareaHeight();

    // 聊天窗口滚动到底部
    nextTick(() => {
      chatStore.scrollToBottom();
    });
  } catch (error) {
    console.error('发送消息失败:', error);
    // 显示错误提示
    chatStore.setErrorMessage('消息发送失败，请重试');
  } finally {
    isSending.value = false;
  }
};

// 生命周期钩子：组件卸载前清理资源
onBeforeUnmount(() => {
  if (mediaRecorder.value) {
    mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
  }
  clearInterval(recordingTimer.value);
  URL.revokeObjectURL(recordedAudioUrl.value);
});

// 监听全局按键事件（如按Enter发送）
onMounted(() => {
  document.addEventListener('keydown', e => {
    // Ctrl+Enter发送消息
    if (e.ctrlKey && e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  });
});
</script>

<style scoped></style>
