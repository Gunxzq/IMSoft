<template>
  <v-textarea
    ref="textAreaRef"
    variant="solo"
    rows="1"
    hide-details
    maxlength="4500"
    max-rows="6"
    auto-grow
    @input="onTextareaInput"></v-textarea>
</template>

<script setup lang="ts">
import * as lodash from 'lodash-es';
import { nextTick, onMounted, ref, type Ref } from 'vue';
import { useMessageStore } from '../../store/modules/message';
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
});
</script>

<script lang="ts">
export default {
  name: 'InputText',
};
</script>

<style scoped></style>
