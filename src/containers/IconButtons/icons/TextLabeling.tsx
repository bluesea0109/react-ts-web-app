import React from 'react';
import IconTemplate from '../IconTemplate';

interface TextLabelingIconProps {
  active: boolean;
}

const TextLabelingIcon: React.FC<TextLabelingIconProps> = ({ active }) => {
  return (
    <IconTemplate active={active} name="Text Labeling" viewBox="0 0 512 512">
      <title>ionicons-v5-k</title>
      <path d="M428,224H288a48,48,0,0,1-48-48V36a4,4,0,0,0-4-4H144A64,64,0,0,0,80,96V416a64,64,0,0,0,64,64H368a64,64,0,0,0,64-64V228A4,4,0,0,0,428,224ZM336,384H176a16,16,0,0,1,0-32H336a16,16,0,0,1,0,32Zm0-80H176a16,16,0,0,1,0-32H336a16,16,0,0,1,0,32Z" />
      <path d="M419.22,188.59,275.41,44.78A2,2,0,0,0,272,46.19V176a16,16,0,0,0,16,16H417.81A2,2,0,0,0,419.22,188.59Z" />
    </IconTemplate>
  );
};

export default TextLabelingIcon;
