import randomcolor from 'randomcolor';
import { MutableRefObject, useEffect, useRef, useState } from 'react';

export interface AnnotatorState {
  tagType?: string;
  tags: {
    start: number;
    end: number;
    tag: string;
  }[];
}

export const useEditExampleAnnotation = ({
  tagTypes,
}: {
  tagTypes: string[];
}): [string, any, AnnotatorState, any, MutableRefObject<any>] => {
  const colors = useRef<any>({});
  const [exampleText, setExampleText] = useState('');
  const [annotatorState, setAnnotatorState] = useState<AnnotatorState>({
    tags: [],
  });

  useEffect(() => {
    const randColors = randomcolor({
      luminosity: 'light',
      count: tagTypes.length,
    });

    let currIndex = 0;

    tagTypes.forEach((tagType) => {
      colors.current = {
        ...colors.current,
        [tagType]: randColors[currIndex],
      };

      currIndex += 1;
    });
  }, [tagTypes]);

  return [
    exampleText,
    setExampleText,
    annotatorState,
    setAnnotatorState,
    colors,
  ];
};
