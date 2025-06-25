<template>
  <div class="chat-container" style="height: 800px; width: 600px">
    <VirtualList :dataList="messages" :getItemHeight="getItemHeight" :buffer="200" @scroll="handleScroll">
      <!-- 自定义渲染插槽 -->
      <template #default="{ item, index }">
        <!-- <button @click.prevent="handleRightClick">nfdksdkj</button>
        <button @click.prevent="globalMenuStore.showContextMenu = false">nfdksdkj</button> -->
        <!-- {{ globalMenuStore.showContextMenu }} -->
        <!-- 消息内容（根据类型动态渲染） -->
        <component :is="getMessageComponent(item.type)" :message="item" @click.prevent.right.stop="handleRightClick" />
        <!-- </div> -->
      </template>
    </VirtualList>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VirtualList from '../virtualList/VirtualList.vue';
import { MessageType } from '../../store/modules/types/message';
import TextMessage from './TextMessage.vue';
import ImageMessage from './ImageMessage.vue';
import VoiceMessage from './VoiceMessage.vue';
import VideoMessage from './VideoMessage.vue';
import FileMessage from './FileMessage.vue';
import LocationMessage from './LocationMessage.vue';
import LinkMessage from './LinkMessage.vue';
import { useGlobalMenuStore } from '../../store/modules/globalMenu';
import type { ContextMenuItem } from '../../store/modules/types/globalMenu';
import type { Message } from '../../store/modules/types/message';

const klk = () => {
  console.log('klk');
};
const globalMenuStore = useGlobalMenuStore();
const props = defineProps({
  messages: { type: Array, required: true },
});

const height = 0;

// 计算单条消息的高度（关键函数）
const getItemHeight = (item: Message) => {
  switch (item.type) {
    case MessageType.TEXT:
      // 假设平均每行可以显示charsPerLine个字符
      const charsPerLine = 23; // 根据实际UI调整
      // 计算总字符数（包括空格等）
      const totalChars = item.content.length;
      // 计算大致行数（考虑两种换行情况）
      const explicitLineBreaks = (item.content.match(/\n/g) || []).length;
      const implicitLines = Math.ceil((totalChars - explicitLineBreaks) / charsPerLine);
      const totalLines = explicitLineBreaks + 1 + implicitLines; // +1是最后一行
      // 计算高度（基础高度 + 行高 × 行数）
      return 40 + totalLines * 20 + height;
    case MessageType.IMAGE:
      // 图片消息高度：缩略图高度（固定或根据宽高比计算）
      // return item.height || 200;
      return 'auto';
    case MessageType.VOICE:
      return 60;
    case MessageType.VIDEO:
      return 'auto';
    // return 60;
    case MessageType.FILE:
      return 100;
    case MessageType.LOCATION:
      return 100;
    case MessageType.LINK:
      return 100;
    default:
      return 60; // 默认高度
  }
};

// 处理滚动事件
const handleScroll = (scrollTop: number) => {
  console.log('当前滚动位置：', scrollTop);
};

// 根据消息类型获取渲染组件
const getMessageComponent = (type: MessageType) => {
  const componentMap = {
    [MessageType.TEXT]: TextMessage,
    [MessageType.IMAGE]: ImageMessage,
    [MessageType.VOICE]: VoiceMessage,
    [MessageType.VIDEO]: VideoMessage,
    [MessageType.FILE]: FileMessage,
    [MessageType.LOCATION]: LocationMessage,
    [MessageType.LINK]: LinkMessage,
  };
  return componentMap[type] || TextMessage;
};

// 右键菜单
const handleRightClick = (e: MouseEvent) => {
  e.preventDefault();
  console.log('handleRightClick', e);

  console.log('contextMenuItem', contextMenuItem.value);
  console.log('contextMenu', globalMenuStore.showMenu);
  try {
    globalMenuStore.showMenu(e.clientX, e.clientY, contextMenuItem.value, {
      isRight: true,
      isLeft: false,
      isMiddle: false,
      isCtrl: false,
    });

    console.log('globalMenuStore', globalMenuStore.showContextMenu);
  } catch (error) {
    console.log('error', error);
  }
};

const contextMenuItem = ref<ContextMenuItem[]>([
  {
    text: '菜单项1',
    action: 'click',
    callback: (context: any) => {
      console.log('菜单项1', context);
    },
  },
  {
    text: '菜单项2',
    action: 'click',
    callback: (context: any) => {
      console.log('菜单项2', context);
    },
  },
  {
    text: '菜单项3',
    action: 'click',
    callback: (context: any) => {
      console.log('菜单项3', context);
    },
  },
]);
</script>

<script lang="ts">
export default {
  name: 'MessageList',
};
</script>
