import React from 'react';
import {IOptionImage} from '../models/chatbot-service';


type OptionImagesContextProps = {
  optionImages: IOptionImage[],
};

export const OptionImagesContext = React.createContext<Partial<OptionImagesContextProps>>({});
