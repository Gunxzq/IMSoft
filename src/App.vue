<template>
  <div class="container">
    <v-row :style="state.classChange ? 'align-items: flex-end' : ''">
      <v-col cols="1" class="justify-center">
        <v-icon v-if="state.VoiceOrText === 'text'" @click="state.VoiceOrText = 'voice'" size="40">mdi-microphone-outline</v-icon>

        <v-icon v-else @click="state.VoiceOrText = 'text'" size="40">mdi-keyboard-outline</v-icon>
      </v-col>
      <v-col cols="8">
        <input-text v-if="state.VoiceOrText === 'text'" @rows-change="e => (state.classChange = e)" @input="inputChangeEvent"></input-text>

        <input-voice v-else style="width: 100%"></input-voice>
      </v-col>
      <v-col cols="1" class="justify-center">
        <v-icon @click="toggleActions('emoj')" size="40">mdi-emoticon-outline</v-icon>
      </v-col>
      <v-col cols="1" class="justify-center">
        <v-icon size="40" :style="{ transform: `rotate(${plusRotate}deg)` }" @click="toggleActions('more')">mdi-plus-circle-outline</v-icon>
      </v-col>
    </v-row>

    <transition name="slide-up">
      <input-emoj v-show="moreState == 'emoj'"></input-emoj>
    </transition>

    <transition name="slide-up">
      <more-actions v-show="moreState == 'more'"></more-actions>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import moreActions from './components/InputMessage/moreActions.vue';
import InputEmoj from './components/InputMessage/InputEmoj.vue';
import InputVoice from './components/InputMessage/InputVoice.vue';
import InputText from './components/InputMessage/InputText.vue';
import { type Message, MessageType } from './store/modules/types/message';
import { generateMessageId } from './utils/tool';

const state = reactive({
  classChange: false,
  VoiceOrText: 'text',
});

let plusRotate = ref(0);
let moreState = ref('');
// 切换操作面板
const toggleActions = (e: string) => {
  if (moreState.value === e) moreState.value = '';
  else moreState.value = e;
  plusRotate.value = moreState.value ? 45 : 0;
};

const inputChangeEvent = (content: { content: string; type: MessageType }) => {
  //   组建消息对象
  let message: Message = {
    id: generateMessageId(),
    content: content.content,
    type: content.type,
    timestamp: Date.now(),
  };

  // 调用仓库中的发送消息
};
</script>

<style scoped lang="scss">
.container {
  width: 100vw;
  // position: absolute;
  // bottom: 0;
}

.justify-center {
  display: flex;
  align-items: center;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.more-actions {
  display: flex;
  justify-content: center;

  padding: 8px 0;
}

/* 动画 */
.v-icon {
  transition: 0.3s ease-in-out;
  cursor: pointer;
}

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
