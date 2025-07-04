import { type ContextMenuItem } from '../store/modules/types/';
import Pinia from '../store';
import { useMessageStore, useGlobalMenuStore } from '../store';

export interface contextEnv {
  MessageStore: { currentMessage: string };
  GlobalMenuStore: { initItem: (...args: any[]) => void; showContextMenu: boolean; showMenu: (...args: any[]) => void };
  message?: any;
}

const MessageStore = useMessageStore(Pinia);
const GlobalMenuStore = useGlobalMenuStore(Pinia);

// 通常的消息处理操作
const CommonContentMenuItems = [
  {
    text: '回复',
    action: 'click',
    callback: (info: ContextMenuItem) => {
      console.log('点击了回复');
      console.log(info);
    },
  },
  {
    text: '转发',
    action: 'click',
    callback: () => {
      console.log('点击了转发');
    },
  },
  { text: '收藏', action: 'click', callback: () => {} },
  {
    text: '删除',
    action: 'click',
    callback: () => {
      console.log('点击了删除');
    },
  },
  { text: '举报', action: 'click', callback: () => {} },
  { text: '分享', action: 'click', callback: () => {} },
  { text: '查看上下文', action: 'click', callback: () => {} },
];

// 处理环境
const env: contextEnv = {
  MessageStore,
  GlobalMenuStore,
};

export { env, CommonContentMenuItems };
