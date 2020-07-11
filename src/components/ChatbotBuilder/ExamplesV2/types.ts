import { IExample, IIntent, ITagType } from '../../../models/chatbot-service';
import { Column } from 'material-table';

export interface TagsQueryResult {
  ChatbotService_tagTypes: ITagType[] | undefined;
}

export interface ExampleQueryResults {
  ChatbotService_intents: IIntent[];
  ChatbotService_examples: IExample[] | undefined;
}

export type MergedExample = IExample & IIntent;
