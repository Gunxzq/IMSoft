import { defineStore } from 'pinia';
import { reactive, ref } from 'vue';
import type { ContextMenuItem } from './types';

export const useGlobalMenuStore = defineStore('globalMenu', () => {
  let showContextMenu = ref(false);
  let menuSize = reactive({
    menuX: 0,
    menuY: 0,
    menuHeight: 0,
    menuWidth: 0,
  });
  let menuItems = ref<ContextMenuItem[]>([]);
  //   回调函数的上下文环境
  let context = ref();

  // 初始化item
  function initItem(items: ContextMenuItem[], contextEnv: any) {
    menuItems.value = items;
    context.value = contextEnv;
  }

  //展示菜单
  function showMenu(
    // 点击坐标
    x: number,
    y: number,
  ) {
    console.log('showMenu', x, y);
    if (showContextMenu.value === false) showContextMenu.value = true;
    else hideMenu();
    //   菜单的坐标
    if (x + menuSize.menuWidth > window.innerWidth) menuSize.menuX = window.innerWidth - menuSize.menuWidth;
    else menuSize.menuX = x;
    menuSize.menuY = y;
    console.log('menuX', menuSize.menuX);
    console.log('menuY', menuSize.menuY);
  }

  const hideMenu = () => {
    showContextMenu.value = false;
  };

  return {
    showMenu,
    showContextMenu,
    initItem,
    hideMenu,
    menuSize,
    menuItems,
    context,
  };
});
