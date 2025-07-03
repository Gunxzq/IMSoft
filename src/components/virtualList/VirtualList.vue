<template>
  <div ref="containerRef" class="virtual-list-container" @scroll="handleScroll">
    <!-- 滚动占位元素（撑开滚动条） -->
    <div class="virtual-list-phantom" :style="{ height: totalHeight + 'px' }"></div>
    <!-- 可视区域渲染内容 -->
    <div class="virtual-list-content" :style="{ transform: `translateY(${offsetY}px)` }">
      <div v-for="item in visibleItems" :key="item.id" :data-id="item.id" class="virtual-list-item" :style="{ height: item.height + 'px' }">
        <!-- 自定义渲染内容 -->
        <slot :item="item" :index="getOriginalIndex(item.id)"></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { debounce } from 'lodash-es'; // 可选，用于防抖
import type { Props, VirtualListItem } from './type';

// withDefaults设置默认值
const props = withDefaults(defineProps<Props>(), {
  estimatedItemHeight: 100,
  buffer: 200,
  slotName: 'default',
});

// 事件
const emit = defineEmits(['scroll', 'resize']);

// DOM实例
const containerRef = ref<HTMLElement | null>(null);

// 顶部距离
const scrollTop = ref(0);

//
const heightsCache = ref<Map<string | number, number>>(new Map());

const visibleRange = ref<{ start: number; end: number }>({ start: 0, end: 0 });

const visibleItems = ref<VirtualListItem[]>([]);

// 总高度
const totalHeight = ref(0);

const positions = ref<Map<string | number, number>>(new Map());

const calculateLayout = () => {
  if (!containerRef.value) return;

  //   容器高度，外部设定
  const containerHeight = containerRef.value.clientHeight;

  //   数据源
  const dataList = props.dataList;

  //   默认高度
  const estimatedHeight = props.estimatedItemHeight;

  //计算总高度
  let total = 0;

  //   清空数据
  heightsCache.value.clear();
  positions.value.clear();

  dataList.forEach((item, index) => {
    const id = item.id;
    let height = heightsCache.value.get(id);

    // 初始化高度
    if (height === undefined) {
      // 项高度不等于距离顶部的高度
      height = props.getItemHeight(item, index) as number;
      heightsCache.value.set(id, height as number);
    }

    total += height;
    positions.value.set(id, total);
  });

  totalHeight.value = total;

  //计算可见区域的起始和结束索引
  let currentScroll = scrollTop.value;
  let start = 0;
  let end = dataList.length;

  // 累积高度
  let height = 0;

  // 从顶部开始找第一个可见项
  for (let i = 0; i < dataList.length; i++) {
    // 累积高度
    height += heightsCache.value.get(dataList[i].id)!;

    if (currentScroll < height) {
      start = i;
      break;
    }
  }

  // 大于该值的内容,超出容器
  currentScroll = scrollTop.value + containerHeight;

  for (let i = start; i < dataList.length; i++) {
    height += heightsCache.value.get(dataList[i].id)!;
    if (currentScroll < height) {
      end = i + 1;
      break;
    }
  }

  // 缓冲区,estimatedHeighty  为预估高度
  //通过预设高度来计算缓冲区大小
  start = Math.max(0, start - Math.floor(props.buffer / estimatedHeight));

  end = Math.min(dataList.length, end + Math.ceil(props.buffer / estimatedHeight));

  visibleRange.value = { start, end };

  //
  visibleItems.value = dataList.slice(start, end).map((item, idx) => ({
    id: item.id,
    data: item,
    height: heightsCache.value.get(item.id)!,
    originalIndex: start + idx,
  }));
};

// 根据 ID 获取原始索引（用于插槽定位）
const getOriginalIndex = (id: string | number) => {
  const item = props.dataList.find(item => item.id === id);
  return item ? item.originalIndex : -1;
};

// 处理滚动事件（防抖优化）
const handleScroll = debounce((e: Event) => {
  scrollTop.value = (e.target as HTMLElement).scrollTop;
  emit('scroll', scrollTop.value);
}, 50);

// 监听数据变化，重新计算布局
watch(() => props.dataList, calculateLayout, { deep: true });
watch(scrollTop, () => {
  console.log('scrollTop', scrollTop.value);
  calculateLayout();
});

// 计算偏移量 offsetY
const offsetY = computed(() => {
  const start = visibleRange.value.start;
  let offset = 0;

  // 累加前面所有项的高度
  for (let i = 0; i < start; i++) {
    const id = props.dataList[i].id;
    const height = heightsCache.value.get(id) || props.estimatedItemHeight;
    offset += height;
  }

  return offset;
});

// 初始化
onMounted(() => {
  calculateLayout();
  emit('resize', { totalHeight: totalHeight.value, visibleCount: visibleItems.value.length });
});
</script>

<script lang="ts">
export default {
  name: 'VirtualList',
};
</script>

<style scoped>
.virtual-list-container {
  position: relative;
  overflow-y: auto;
  overflow-x: hidden;
  height: 100%;
  width: 100%;
}

.virtual-list-phantom {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  z-index: -1;
}

.virtual-list-content {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  will-change: transform;
}

.virtual-list-item {
  box-sizing: border-box;
  position: relative;
  width: 100%;
}

/* 隐藏滚动条 */
.virtual-list-container::-webkit-scrollbar {
  width: 100px;
  height: 10px;
}
</style>
