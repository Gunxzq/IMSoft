import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { ContextMenuItem } from './types/globalMenu';

export const useGlobalMenuStore = defineStore('globalMenu', () => {
  let showContextMenu = ref(false);
  let menuX = ref(0);
  let menuY = ref(0);
  let menuItems = ref<ContextMenuItem[]>([]);
  //   回调函数的上下文环境
  let context = ref();
  //   展示菜单
  function showMenu(x: number, y: number, items: ContextMenuItem[], contextEnv: any) {
    console.log('显示菜单');
    showContextMenu.value = true;
    menuX.value = x;
    menuY.value = y;
    menuItems.value = items;
    context.value = contextEnv;
  }

  return {
    showMenu,
    showContextMenu,
    menuX,
    menuY,
    menuItems,
    context,
  };
});
