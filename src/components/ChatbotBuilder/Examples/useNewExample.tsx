import randomcolor from 'randomcolor';
import { MutableRefObject, useEffect, useRef, useState } from 'react';
import { IExample } from '../../../models/chatbot-service';
import { Maybe } from '../../../utils/types';

interface NewExampleState {
  state: any;
  intent: string;
  colors: MutableRefObject<any>;
  updatedExample: Maybe<IExample>;
}

interface NewExampleUpdateState {
  setState: (updatedState: any) => void | ((currentState: any) => any);
  setIntent: (updatedIntent: string) => void | ((currentIntent: string) => string);
  updateTagsOnText: (updatedTags: any[]) => void;
  onExampleTextChange: (e: any) => void;
}

export const useNewExample = ({
  example,
  intents,
  tags,
  onExampleUpdate,
}: {
  example: any;
  intents: any[];
  tags: any[];
  onExampleUpdate: any;
}): [NewExampleState, NewExampleUpdateState] => {
  const [currentExample, setCurrentExample] = useState<Maybe<IExample>>(example);
  const [state, setState] = useState<any>({});
  const [intent, setIntent] = useState<string>('');
  const colors = useRef<any>({});

  useEffect(() => {
    if (!!currentExample) {
      const currIntent = intents.find((i: any) => i.value === intent);
      onExampleUpdate({
        id: currentExample.id,
        agentId: currentExample.agentId,
        text: currentExample.text,
        intentId: currIntent?.id,
        intentName: currIntent?.name,
        tags: state.value?.map((tag: any) => ({
          start: tag.start,
          end: tag.end,
          tagType: {
            value: tag.tag,
            agentId: currentExample.agentId,
            id: tags.find((t: any) => t.value === tag.tag).id,
          },
        })) ?? [],
      });
    }
    // eslint-disable-next-line
  }, [currentExample, intent, intents, state.value, tags]);

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

  useEffect(() => {
    setCurrentExample(example);
    setState({
      value: example?.tags.map((tag: any) => {
        return {
          start: tag.start,
          end: tag.end,
          tag: tag.tagType.value,
        };
      }),
      tag: tags[0]?.value,
    });

    const intent = intents.find(({ id }: any) => id === example?.intentId);
    setIntent(intent?.value);
    // eslint-disable-next-line
  }, []);

  const updateTagsOnText = (updatedTags: any[]) => {
    setState({
      ...state,
      value: [ ...updatedTags ],
    });
  };

  const onExampleTextChange = (e: any) => {
    const updatedExample = { ...(currentExample as IExample) };
    updatedExample.text = e.target.value;

    setCurrentExample({ ...updatedExample });
  };

  const currIntent = intents.find((i: any) => i.value === intent);
  const updatedExample = !!currentExample ? {
    id: currentExample?.id,
    agentId: currentExample?.agentId,
    text: currentExample?.text,
    intentId: currIntent?.id,
    intentName: currIntent?.name,
    tags: state.value?.map((tag: any) => ({
      start: tag.start,
      end: tag.end,
      tagType: {
        value: tag.tag,
        agentId: currentExample?.agentId,
        id: tags.find((t: any) => t.value === tag.tag).id,
      },
    })) ?? [],
  } : null;

  return [
    { state, intent, colors, updatedExample },
    { setState, setIntent, updateTagsOnText, onExampleTextChange },
  ];
};
