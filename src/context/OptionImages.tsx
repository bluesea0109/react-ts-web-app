import React from 'react';
import {IOptionImage} from '../models/chatbot-service';

// We define our type for the context properties right here
type OptionImagesContextProps = {
  optionImages: IOptionImage[],
};

// we initialise them without default values, to make that happen, we
// apply the Partial helper type.
export const OptionImagesContext =
  React.createContext<Partial<OptionImagesContextProps>>({});
