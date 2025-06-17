<template>
  <!-- 录音按钮 -->
  <button @click="startRecord">
    <span>{{ recordText }}</span>
  </button>

  <!-- 录音控制面板（录音时显示） -->
  <div v-show="recordingStatus === 'recording'">
    <div>
      <div>
        <!-- 录音时长 -->
        <span>{{ formatTime(recordingDuration) }}</span>
        <!-- 录音波形 -->
        <span v-for="(wave, index) in recordingWaves" :key="index" class="wave-bar" :style="{ height: wave + 'px' }"></span>
      </div>
    </div>
    <div>
      <button @click="cancelRecording">取消</button>
      <button @click="finishRecording">完成</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// 录音相关状态
const mediaRecorder = ref<MediaRecorder | null>(null); // 解析器
const audioChunks = ref<Blob[]>([]); // 二进制数据
const recordingStatus = ref<string>('inactive'); //录音状态
const recordingDuration = ref<number>(0); // 录音时长
const recordingTimer = ref<any | null>(null); // 定时器
const recordingWaves = ref(Array(5).fill(2)); // 录音波形动画
const recordedAudioUrl = ref(''); // 录制完成的音频URL
const recordText = ref('按住说话'); // 录音按钮文字

// 组件事件
const emit = defineEmits(['startRecord', 'recordComplete']);

// 录音初始化
const init = async () => {
  try {
    // 请求麦克风权限
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    // 初始化MediaRecorder
    mediaRecorder.value = new MediaRecorder(stream);
    audioChunks.value = [];

    // 数据可用事件
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
    };
  } catch (error) {
    console.error('录音失败:', error);
  }
};

const startRecord = async () => {
  try {
    await init();

    // 开始录音
    mediaRecorder.value?.start();
    recordingStatus.value = 'recording';
    recordingDuration.value = 0;

    // 启动计时器更新时长
    recordingTimer.value = setInterval(() => {
      recordingDuration.value++;
      updateRecordingWaves();
    }, 1000);

    // 通知父组件
    emit('startRecord');
  } catch (error) {}
};

// 取消录音
const cancelRecording = () => {
  if (mediaRecorder.value) {
    mediaRecorder.value.stop();
    mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
  }
  clearInterval(recordingTimer.value as number);

  URL.revokeObjectURL(recordedAudioUrl.value);
  recordedAudioUrl.value = '';
  resetRecordingState();
};

// 完成录音
const finishRecording = async () => {
  if (mediaRecorder.value && recordingStatus.value === 'recording') {
    mediaRecorder.value.stop();
    // 释放麦克风资源
    mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
  }
  clearInterval(recordingTimer.value as number);
  recordingStatus.value = 'inactive';

  // 如果没有录制内容，直接返回
  if (!recordedAudioUrl.value) return;

  try {
    const content = `url=${recordedAudioUrl.value}$duration=${formatTime(recordingDuration.value)}`;

    recordedAudioUrl.value = '';
    resetRecordingState();

    // 将数据传递给父组件
    emit('recordComplete', content);
  } catch (error) {
    console.error('发送音频失败:', error);
  } finally {
  }
};

// 更新录音波形动画
const updateRecordingWaves = () => {};

// 重置录音状态
const resetRecordingState = () => {
  clearInterval(recordingTimer.value);
  recordingWaves.value = Array(5).fill(2);
  recordingDuration.value = 0;
};

// 格式化时间（秒转MM:SS）
const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const secs = (seconds % 60).toString().padStart(2, '0');
  return `${mins}:${secs}`;
};

// 清理资源
const unmounted = () => {
  if (mediaRecorder.value) {
    mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
  }
  // 清理定时器
  clearInterval(recordingTimer.value);
  // 清理 URL.createObjectURL(blob) 创建的URL
  URL.revokeObjectURL(recordedAudioUrl.value);
};

// 暴露给父组件的方法
defineExpose({
  unmounted,
});
</script>
