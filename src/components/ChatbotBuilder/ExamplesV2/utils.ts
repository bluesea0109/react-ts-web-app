import { IExample, IIntent } from '../../../models/chatbot-service';

export const getMargeIntentData = (examplesData: IExample[], intentsData: IIntent[]) => examplesData.map(example => {
  const intent = intentsData.filter(intent => intent.id === example.intentId);
  return {
    ...example,
    intentName: intent?.[0]?.value,
  };
});

export const intentsArrToObj = (intents: IIntent[]) => intents
  .reduce((prev, curr) => ({ ...prev, [curr.id]: curr.value}), {});
