export interface ColorItem {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface BotSettings {
  name: string;
  icon?: string;
  primaryColor: ColorItem;
  primaryBg: ColorItem;
}
