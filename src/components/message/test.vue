<template>
  <!-- <div style="height: 200px; width: 200px"> -->
  <video width="400" height="400" controls>
    <source src="./assets/1.mp4" type="video/mp4" />
  </video>
  <audio src="../public/1.mp4"></audio>
  <!-- </div> -->
  <!-- <messageList :messages="messages"></messageList> -->

  <img src="../public/1.PNG" alt="" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import MessageList from './components/message/messageList.vue';
// 模拟消息数据（含不定长高度）
const messages = ref([
  {
    id: '1',
    type: 'text',
    content: '这是一条长文本消息...（假设高度为80px）',
    isSelf: true,
    height: 80, // 实际高度由 getItemHeight 计算
  },
  {
    id: '2',
    type: 'image',
    content: 'https://n.sinaimg.cn/sinacn10111/492/w1920h972/20190526/9766-hxntqyy7987059.jpg',
    height: 200, // 实际高度由图片尺寸决定
    isSelf: false,
  },
  {
    id: '3',
    type: 'voice',
    content: 'duration=2$url=https://n.sinaimg.cn/sinacn10111/492/w1920h972/20190526/9766-hxntqyy7987059.jpg',
    height: 200, // 实际高度由图片尺寸决定
    isSelf: false,
  },
  {
    id: '4',
    type: 'video',
    content: 'duration=2$url=../public/1.mp4$coverUrl=../public/1.PNG',
    height: 200, // 实际高度由图片尺寸决定
    isSelf: false,
  },
  {
    id: '5',
    type: 'file',
    content:
      'fileName=1.jpg$fileSize=0.01MB$typeIcon=image/jpeg$fileurl=https://n.sinaimg.cn/sinacn10111/492/w1920h972/20190526/9766-hxntqyy7987059.jpg$downloadStatus=downloaded',
    height: 200, // 实际高度由图片尺寸决定
    isSelf: false,
  },
]);
</script>

<style scoped></style>
