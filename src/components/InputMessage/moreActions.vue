<template>
  <div>
    <v-row>
      <v-col cols="3" v-for="item in menuItems" :key="item.icon">
        <v-sheet elevation="2" class="card">
          <component :is="item.component" :icon="item.icon" :label="item.label" />
        </v-sheet>
      </v-col>
    </v-row>
    <!-- <v-pagination :length="paginationLength" color="primary" :total-visible="2" circle></v-pagination> -->
  </div>
</template>
<script setup lang="ts">
import { ref, computed } from 'vue';
import InputImage from './InputImage.vue';

let menuItems = [
  {
    icon: 'mdi-image-outline',
    label: '照片',
    component: InputImage,
  },
  //   {
  //     icon: 'mdi-camera-outline',
  //     label: '拍摄',
  //   },
  {
    icon: 'mdi-phone-outline',
    label: '语音通话',
  },
  {
    icon: 'mdi-video-outline',
    label: '视频通话',
  },
  {
    icon: 'mdi-map-marker-outline',
    label: '位置',
  },

  // 文件
  {
    icon: 'mdi-file-outline',
    label: '文件',
  },
  // 收藏
  {
    icon: 'mdi-star-outline',
    label: '收藏',
  },
  // 红包
  //   {
  //     icon: 'mdi-gift-outline',
  //     label: '红包',
  //   },
  // 转账
  //   {
  //     icon: 'mdi-cash-outline',
  //     label: '转账',
  //   },
  // 屏幕分享
  {
    icon: 'mdi-cast-outline',
    label: '屏幕分享',
  },
  // 戳一戳
  //   {
  //     icon: 'mdi-hand-pointing-right-outline',
  //     label: '戳一戳',
  //   },
  // 名片
  {
    icon: 'mdi-account-outline',
    label: '名片',
  },
  //   // 礼物
  //   {
  //     icon: 'mdi-gift-outline',
  //     label: '礼物',
  //   },
  //   // 一起听歌
  //   {
  //     icon: 'mdi-music-circle-outline',
  //     label: '一起听歌',
  //   },
];

const paginationLength = computed(() => Math.ceil(menuItems.length / 8));
</script>

<script lang="ts">
export default {
  name: 'moreActions',
};
</script>

<style lang="scss" scoped>
.card {
  width: fit-content;
  min-width: 8em;
}
</style>
