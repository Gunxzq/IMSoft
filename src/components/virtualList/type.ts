// 类型定义
export interface VirtualListItem<T = any> {
  id: string | number; // 唯一标识
  height: number | string; // 实际高度（动态计算后）
  originalIndex: number; // 原始数据中的索引（用于定位）
  data: T; // 原始数据
}

export interface Props<T = any> {
  dataList: T[]; // 原始数据列表
  //高度计算函数
  getItemHeight: (item: T, index: number) => number | string;
  //项预设高度
  estimatedItemHeight?: number;
  //   缓冲区
  buffer?: number;
  slotName?: string;
}
