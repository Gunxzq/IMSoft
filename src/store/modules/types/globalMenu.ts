export interface ContextMenuItem {
  text: string;
  action: string;
  callback: (context?: any) => void;
}

export interface globalMenu {
  showContextMenu: boolean;
  menuX: number;
  menuY: number;
  menuItems: ContextMenuItem[];
}
