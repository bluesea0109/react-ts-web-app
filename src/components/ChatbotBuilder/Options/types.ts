export interface GetOptionsQueryResult {
  ChatbotService_userResponseOptions: IOption[];
}

export interface GetImageOptionUploadUrlQueryResult {
  ChatbotService_imageOptionUploadUrl: {
    url: string;
  };
}

export interface ICreateUserResponseOptionsMutationVars {
  agentId: number;
  userTextResponseOption: ITextOptionInput | undefined;
  userImageResponseOption: IImageOptionInput | undefined;
}

export enum IOptionType {
  IMAGE_LIST = 'IMAGE_LIST',
  TEXT = 'TEXT',
}

export interface ITextOptionInput {
  intentId: number;
  text: string;
  type: IOptionType;
}

export interface IImageOptionInput {
  intentId: number;
  text: string;
  imageUrl?: string;
  type: IOptionType;
}

export type IOptionInput = ITextOptionInput | IImageOptionInput;

export interface IOptionBase {
  id: number;
  intentId: number;
  agentId: number;
  intent: string;
  type: IOptionType;
}

export interface ITextOption extends IOptionBase {
  text: string;
}

export interface IImageOption extends IOptionBase {
  text: string;
  imageUrl: string;
}

export type IOption = ITextOption | IImageOption;
