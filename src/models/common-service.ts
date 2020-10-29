import { IOptionImage } from './chatbot-service';

export interface IGetImageUploadSignedUrlQueryResult {
  ChatbotService_imageOptionUploadUrl: {
    url: string,
  };
}

export interface IGetOptionImagesQueryResult {
  ChatbotService_optionImages: IOptionImage[];
}
