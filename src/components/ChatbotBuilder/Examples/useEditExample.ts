import randomcolor from 'randomcolor';
import { MutableRefObject, useEffect, useRef, useState } from 'react';

export interface AnnotatorState {
  tag?: string;
  value: {
    start: number;
    end: number;
    tag: string;
  }[];
}

export const useEditExampleAnnotation = ({
  tags,
}: any): [MutableRefObject<any>, string, any, AnnotatorState, any] => {
  const colors = useRef<any>({});
  const [exampleText, setExampleText] = useState('');
  const [annotatorState, setAnnotatorState] = useState<AnnotatorState>({
    value: [],
  });

  useEffect(() => {
    const randColors = randomcolor({
      luminosity: 'light',
      count: tags.length,
    });

    let currIndex = 0;

    tags.forEach((tag: any) => {
      colors.current = {
        ...colors.current,
        [tag.value]: randColors[currIndex],
      };

      currIndex += 1;
    });
  }, [tags]);

  return [colors, exampleText, setExampleText, annotatorState, setAnnotatorState];
};
