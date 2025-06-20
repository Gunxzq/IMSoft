<template>
  <v-container class="my-4">
    <!-- 网格行 -->
    <v-row class="gap-4" justify="center" align="center">
      <!-- 第一行：添加按钮 + 表情图标 -->
      <v-col v-for="(item, index) in firstRowItems" :key="index" cols="3" sm="3" md="3" lg="3">
        <v-card class="d-flex justify-center align-center" height="120px" outlined :class="{ 'dashed-border': item.isDashed }"></v-card>
      </v-col>

      <!-- 后续行：图片内容 -->
      <v-col v-for="(item, index) in imageItems" :key="index" cols="3" sm="3" md="3" lg="3">
        <v-card class="d-flex justify-center align-center" height="150px" outlined :class="{ 'dashed-border': item.isDashed }">
          <v-img :src="item.src" contain aspect-ratio="1" />
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      firstRowItems: [
        { type: 'button', isDashed: true }, // 加号按钮
        { type: 'icon', src: 'path/to/smile-icon.svg', isDashed: false }, // 表情图标
        // 其他第一行项目...
      ],
      imageItems: [
        { src: 'path/to/character1.jpg' },
        { src: 'path/to/character2.jpg' },
        { src: 'path/to/character2.jpg' },
        { src: 'path/to/character2.jpg' },
        { src: 'path/to/character2.jpg' },
        { src: 'path/to/character2.jpg' },
        { src: 'path/to/character2.jpg' },
        { src: 'path/to/character2.jpg' },
        // 动态加载更多图片...
      ],
    };
  },
  methods: {
    handleAddClick() {
      // 处理添加按钮点击事件
      console.log('Add button clicked');
    },
  },
};
</script>

<style scoped>
.dashed-border {
  border: 1px dashed #ccc;
  border-radius: 8px;
}
/* 可选：图片自适应高度 */
.v-img {
  object-fit: cover;
}
</style>
