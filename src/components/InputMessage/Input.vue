<template>
  <div class="container" @click="handleClick">
    <v-row :style="state.classChange ? 'align-items: flex-end' : ''">
      <v-col cols="1" class="justify-center">
        <v-icon v-if="state.actionState === 'text'" size="40" data-action="voice">mdi-microphone-outline</v-icon>
        <v-icon v-else size="40" data-action="text">mdi-keyboard-outline</v-icon>
      </v-col>
      <v-col cols="8">
        <input-text v-if="state.actionState === 'text'" @rows-change="(e:boolean) => (state.classChange = e)"></input-text>
        <input-voice v-else style="width: 100%"></input-voice>
      </v-col>
      <v-col cols="1" class="justify-center">
        <v-icon size="40" data-action="emoj" v-if="!sendState">mdi-emoticon-outline</v-icon>
      </v-col>
      <v-col cols="1" class="justify-center">
        <v-icon size="40" data-action="more" v-if="!sendState">mdi-plus-circle-outline</v-icon>
      </v-col>
    </v-row>

    <transition name="slide-up">
      <input-emoj v-if="state.actionState == 'emoj'"></input-emoj>
    </transition>

    <transition name="slide-up">
      <more-actions v-if="state.actionState == 'more'"></more-actions>
    </transition>

    <v-btn v-if="sendState" @click="sendMsg">发送</v-btn>
  </div>
</template>

<script setup lang="ts">
import InputText from './InputText.vue';
import { useUserInfoStore, useMessageStore } from '../../store';
import { MessageType } from '../../store/modules/types';
import { reactive, computed, onMounted } from 'vue';
// 异步加载非首屏资源
import { defineAsyncComponent } from 'vue';
import { eventEmitter, EventName } from '../../utils';
const InputEmoj = defineAsyncComponent(() => import('./InputEmoj.vue'));
const InputVoice = defineAsyncComponent(() => import('./InputVoice.vue'));
const moreActions = defineAsyncComponent(() => import('./moreActions.vue'));

const userInfoStore = useUserInfoStore();
const messageStore = useMessageStore();
const state = reactive({
  classChange: false,
  actionState: 'text',
});

const handleClick = (e: any) => {
  const action = e.target?.dataset.action;
  if (action) {
    switch (action) {
      case 'emoj':
        if (state.actionState === 'emoj') state.actionState = 'text';
        else state.actionState = 'emoj';
        break;
      case 'more':
        if (state.actionState === 'more') state.actionState = 'text';
        else state.actionState = 'more';
        break;
      case 'voice':
        state.actionState = 'voice';
        break;
      case 'text':
        state.actionState = 'text';
        break;
    }
  }
};

// 发送按钮
const sendState = computed(() => {
  return !!messageStore.currentMessage;
});

const sendMsg = () => {
  messageStore.sendMessage(userInfoStore.userId, messageStore.currentConversationId, messageStore.currentMessage, MessageType.TEXT);
  messageStore.currentMessage = '';
};

// 消息发送监听
const watchMessage = () => {
  eventEmitter.on(EventName.API_SEND_MESSAGE, (data: { content: string; type: MessageType }) => {
    messageStore.sendMessage(userInfoStore.userId, messageStore.currentConversationId, data.content, data.type);
  });
};

onMounted(() => {
  watchMessage();
});
</script>

<script lang="ts">
export default {
  name: 'InputMessage',
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
</style>
