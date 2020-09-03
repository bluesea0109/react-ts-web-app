export interface ColorItem {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface BotSettings {
  name: string;
  title?: string;
  subtitle?: string;
  icon?: string;
  logo?: string;
  primaryColor: ColorItem;
  primaryBg: ColorItem;
  widgetBg: string;
}

export interface IBotIconUploadUrlQueryResult {
  ChatbotService_botIconUploadUrl: {
    url: string;
  };
}
