<template>
  <div
    :style="{ left: globalMenuStore.menuSize.menuX + 'px', top: globalMenuStore.menuSize.menuY + 'px' }"
    class="menu v-menu v-overlay"
    v-show="globalMenuStore.showContextMenu">
    <div class="v-overlay__content">
      <v-list dense data-aa="mm" ref="globalMenu">
        <v-list-item v-for="(item, i) in globalMenuStore.menuItems" :key="i" @click="handleMenuClick(item)">
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
    </div>
  </div>

  <!-- </v-menu> -->
</template>

<script setup lang="ts">
import { toRaw, ref, type Ref, watch, nextTick } from 'vue';
import { useGlobalMenuStore } from '../store/modules/globalMenu';
import type { ContextMenuItem } from '../store/modules/types/globalMenu';

const globalMenuStore = useGlobalMenuStore();
let globalMenu = ref<null | Ref>(null);
// 处于全局上下文
function handleMenuClick(item: ContextMenuItem) {
  console.log('执行操作:', item.text);
  console.log('当前菜单:', globalMenuStore.context);
  item.callback(toRaw(globalMenuStore.context));
}

watch(
  () => globalMenuStore.menuItems,
  () => {
    // 计算菜单位置
    nextTick(() => {
      let height = globalMenu.value.$el.offsetHeight;
      let width = globalMenu.value.$el.offsetWidth;
      globalMenuStore.menuSize.menuHeight = height;
      globalMenuStore.menuSize.menuWidth = width;
    });
  },
  { deep: true },
);
</script>

<script lang="ts">
export default {
  name: 'globalMenu',
};
</script>
<style scoped>
.menu {
  position: absolute;
  border-radius: 4px;
}

.v-menu > .v-overlay__content > .v-list {
  background: rgb(var(--v-theme-surface));
  border-radius: inherit;
  overflow: auto;
  height: 100%;
}
</style>
