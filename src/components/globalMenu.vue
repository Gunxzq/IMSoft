<template>
  <div v-if="globalMenuStore.showContextMenu"></div>
  <v-menu
    v-model="globalMenuStore.showContextMenu"
    :position-x="globalMenuStore.menuX"
    :position-y="globalMenuStore.menuY"
    absolute
    offset-y
    close-on-content-click>
    <v-list dense>
      <v-list-item v-for="(item, i) in globalMenuStore.menuItems" :key="i" @click="handleMenuClick(item)">
        <v-list-item-title>{{ item.text }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script setup lang="ts">
import { toRaw } from 'vue';
import { useGlobalMenuStore } from '../store/modules/globalMenu';
import type { ContextMenuItem } from '../store/modules/types/globalMenu';
const globalMenuStore = useGlobalMenuStore();

// 处于全局上下文
function handleMenuClick(item: ContextMenuItem) {
  console.log('执行操作:', item.text);
  console.log('当前菜单:', globalMenuStore.context);
  item.callback(toRaw(globalMenuStore.context));
}
</script>

<script lang="ts">
export default {
  name: 'globalMenu',
};
</script>
<style scoped></style>
