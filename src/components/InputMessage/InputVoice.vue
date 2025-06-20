<template>
  <div class="container">
    <v-btn @click="startRecord" style="width: 100%">{{ recordText }}</v-btn>
    <!-- 录音控制面板（录音时显示） -->
    <transition name="slide-up">
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
          <v-btn @click="cancelRecording" icon="mdi-close"></v-btn>
          <v-btn @click="finishRecording">完成</v-btn>
          <v-btn @click="downloadRecording">录音</v-btn>
          <v-btn @click="convertToText" icon>文</v-btn>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
// 录音相关状态
let mediaRecorder = ref<MediaRecorder | null>(null); // 解析器
let audioChunks = ref<Blob[]>([]); // 二进制数据
let recordingStatus = ref<string>('inactive'); //录音状态
let recordingDuration = ref<number>(0); // 录音时长
let recordingTimer = ref<any | null>(null); // 定时器
let recordingWaves = ref(Array(5).fill(2)); // 录音波形动画
let recordedAudioUrl = ref(''); // 录制完成的音频URL
let recordText = ref('按住说话'); // 录音按钮文字
let audioBlob = ref<Blob | null>(null);

let test = ref('');
// 识别相关状态
let isRecognizing = ref(false); // 是否正在识别
let finalResult = ref(''); // 最终识别结果
let interimResult = ref(''); // 临时识别结果
let recognition: SpeechRecognition | null = null; // 语音识别实例

// 组件事件
const emit = defineEmits(['startRecord', 'recordComplete', 'convertToTextComplete']);

// 初始化录音
const initMedia = async () => {
  try {
    // 请求麦克风权限
    const stream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: {
        echoCancellation: true, // 回声消除
        noiseSuppression: true, // 降噪
        channelCount: 1, // 单声道
        sampleRate: 44100, // 采样率
      },
    });

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
      audioBlob.value = new Blob(audioChunks.value, { type: 'audio/webm' });
      recordedAudioUrl.value = URL.createObjectURL(audioBlob.value);
      test.value = recordedAudioUrl.value;
      console.log(test.value);
    };
  } catch (error) {
    console.error('录音失败:', error);
  }
};

// 初始化识别
const initRecognizing = async () => {
  try {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognition = new SpeechRecognition();

      if (recognition) {
        // 配置参数
        recognition.lang = 'zh-CN'; // 识别语言（中文）
        recognition.interimResults = true; // 允许临时结果
        recognition.continuous = true; // 连续识别（不自动停止）

        // 重置状态
        finalResult.value = '';
        interimResult.value = '';
        isRecognizing.value = true;

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let tempInterim = '';
          let tempFinal = '';

          // 遍历所有识别结果
          for (let i = event.resultIndex; i < event.results.length; i++) {
            // 识别结果
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              tempFinal += transcript + ' '; // 最终结果累加
            } else {
              tempInterim += transcript; // 临时结果累加
            }
          }

          // 更新状态
          interimResult.value = tempInterim;
          finalResult.value += tempFinal.trim();
        };

        // 错误处理
        recognition.onerror = (event: SpeechRecognitionEvent) => {
          isRecognizing.value = false;
          console.error('识别错误:', event.error);
        };

        // 识别结束（非连续模式时触发）
        recognition.onend = () => {
          if (isRecognizing.value) {
            // 意外结束时重置状态
          }
        };
      }
    }
  } catch (error) {
    console.error('识别失败:', error);
  }
};
const startRecord = async () => {
  try {
    await initMedia();
    await initRecognizing();
    // 开始录音
    mediaRecorder.value?.start(100);
    if (recognition) recognition.start();
    recordingStatus.value = 'recording';
    recordingDuration.value = 0;
    // 启动计时器更新时长
    recordingTimer.value = setInterval(() => {
      recordingDuration.value++;
      updateRecordingWaves();
    }, 1000);
  } catch (error) {
    console.error('录音失败:', error);
    if (mediaRecorder.value?.state === 'recording') {
      mediaRecorder.value.stop();
      mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
    }
    recognition?.stop();
    clearInterval(recordingTimer.value as number);
    releaseAudioUrl();
    recordedAudioUrl.value = '';
    resetRecordingState();
  }
};
// 取消录音
const cancelRecording = () => {
  if (mediaRecorder.value) {
    mediaRecorder.value.stop();
    mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
    recognition?.stop();
  }
  clearInterval(recordingTimer.value as number);

  releaseAudioUrl();
  recordingStatus.value = 'inactive';
  resetRecordingState();
};

// 下载录音
const downloadRecording = async () => {
  await stopRecord();
  const url = recordedAudioUrl.value;
  const a = document.createElement('a');
  a.href = url;
  a.download = `录音_${new Date().toISOString().slice(0, 19).replace(/:/g, '-')}.webm`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  releaseAudioUrl();
  resetRecordingState();
};
// 停止录音
const stopRecord = () => {
  return new Promise((resolve, reject) => {
    if (!mediaRecorder.value && recordingStatus.value === 'recording') {
      resolve(true);
      return;
    }

    // 监听停止事件（关键：等待 onstop 完成）
    const onStop = () => {
      mediaRecorder.value?.removeEventListener('stop', onStop);
      // 确保生成 Blob URL（原 onstop 逻辑）
      if (audioChunks.value.length > 0) {
        audioBlob.value = new Blob(audioChunks.value, { type: mediaRecorder.value?.mimeType });
        recordedAudioUrl.value = URL.createObjectURL(audioBlob.value);
      }
      resolve(true);
    };
    // 监听错误事件（失败时拒绝 Promise）
    const onError = (event: Event) => {
      console.error('录音停止失败:', event);
      mediaRecorder.value?.removeEventListener('error', onError);
      reject(new Error('录音停止失败'));
    };

    // 注册事件监听
    mediaRecorder.value?.addEventListener('stop', onStop);
    mediaRecorder.value?.addEventListener('error', onError);

    clearInterval(recordingTimer.value as number);
    mediaRecorder.value?.stop();
    mediaRecorder.value?.stream.getTracks().forEach(track => track.stop());
    recognition?.stop();
  });
};
// 完成录音
const finishRecording = async () => {
  await stopRecord();
  // 如果没有录制内容，直接返回
  if (!recordedAudioUrl.value) return;

  try {
    const content = `url=${recordedAudioUrl.value}$duration=${formatTime(recordingDuration.value)}`;
    releaseAudioUrl();
    resetRecordingState();
    // 将数据传递给父组件
    emit('recordComplete', content);
  } catch (error) {
    console.error('发送音频失败:', error);
  } finally {
  }
};

// 转文字
const convertToText = async () => {
  await stopRecord();
  if (!recordedAudioUrl.value) return;

  try {
    const content = finalResult.value;
    recordedAudioUrl.value = '';
    resetRecordingState();
    // 将数据传递给父组件
    emit('convertToTextComplete', content);
  } catch (error) {
    console.error('发送音频失败:', error);
  } finally {
  }
};

// 更新录音波形动画
const updateRecordingWaves = () => {};

// 重置录音状态
const resetRecordingState = () => {
  recordingStatus.value = 'inactive';
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

const releaseAudioUrl = () => {
  if (recordedAudioUrl.value && recordedAudioUrl.value !== '') {
    URL.revokeObjectURL(recordedAudioUrl.value);
  }
  recordedAudioUrl.value = '';
};
// 清理资源
const unmounted = () => {
  if (mediaRecorder.value) {
    mediaRecorder.value.stream.getTracks().forEach(track => track.stop());
  }
  // 清理定时器
  clearInterval(recordingTimer.value);
  releaseAudioUrl();
  recognition?.stop();
  recognition = null;
};

// 暴露给父组件的方法
defineExpose({
  unmounted,
});
</script>

<script lang="ts">
export default {
  name: 'InputVoice',
};
</script>

<style lang="scss" scoped>
.container {
  position: relative;
}

// 进入和退出的过渡效果
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
  // position: absolute;
  width: 100%;
}
/* 进入动画：从下方滑入 */
.slide-up-enter-from {
  transform: translateY(100%); /* 初始位置：完全隐藏在下方 */
  opacity: 0; /* 可选：淡入效果 */
}

.slide-up-enter-to {
  transform: translateY(0); /* 最终位置：正常显示 */
  opacity: 1;
}

/* 离开动画：向下滑出 */
.slide-up-leave-from {
  transform: translateY(0); /* 初始位置：正常显示 */
  opacity: 1;
}

.slide-up-leave-to {
  transform: translateY(100%); /* 最终位置：完全隐藏在下方 */
  opacity: 0;
}
</style>
