<template>
  <v-textarea
    ref="textAreaRef"
    variant="solo"
    rows="1"
    hide-details
    maxlength="4500"
    max-rows="6"
    auto-grow
    autofocus
    @input="onTextareaInput"></v-textarea>
</template>

<script setup lang="ts">
import * as lodash from 'lodash-es';
import { nextTick, onMounted, ref, type Ref } from 'vue';
import { useMessageStore } from '../../store';
import { EventName, eventEmitter } from '../../utils';

const messageStore = useMessageStore();
let textAreaRef = ref<null | Ref>(null);
// 行高
let lineHeight = ref(0);

// 事件
const emit = defineEmits(['rowsChange']);
// 输入事件
const onTextareaInput = lodash.debounce(async e => {
  messageStore.currentMessage = e.target.value;
  // 是否换行
  let isNewLineState = await isNewLine();
  emit('rowsChange', isNewLineState);
}, 500);

// 监听消息更新
const watchMessage = () => {
  console.log('watchMessage');
  eventEmitter.on(EventName.API_INPUT_UPDATE, (content: any) => {
    console.log('watchMessage', content);
    nextTick(() => {
      let dom = textAreaRef.value?.$el.querySelector('textarea');
      dom.focus();
      dom.value = content;
      // 手动触发 input 事件（Vuetify 会监听此事件来更新 UI）
      const inputEvent = new Event('input', { bubbles: true, cancelable: true });
      dom.dispatchEvent(inputEvent);
    });
  });
};

// 判断是否换行
const isNewLine = (): Promise<boolean> => {
  return new Promise(resolve => {
    nextTick(() => {
      const textareaEl = textAreaRef.value?.$el?.querySelector('.v-input__control');
      if (textareaEl) {
        let containerHeight = new Number(window.getComputedStyle(textareaEl).height.replace('px', '')) as number;
        containerHeight = containerHeight / 2;
        containerHeight > lineHeight.value ? resolve(true) : resolve(false);
      }
    });
  });
};

// 获取行高
const getLineHeight = (): Promise<number> => {
  return new Promise(resolve => {
    nextTick(() => {
      const textareaEl = textAreaRef.value?.$el?.querySelector('.v-textarea__sizer');
      if (textareaEl) {
        let lineHeight = window.getComputedStyle(textareaEl).height.replace('px', '');
        // 去除px转为number
        resolve(new Number(lineHeight) as number);
      } else {
        resolve(36);
      }
    });
  });
};

onMounted(async () => {
  lineHeight.value = await getLineHeight();
  watchMessage();
});
</script>

<script lang="ts">
export default {
  name: 'InputText',
};
</script>

<style scoped></style>
