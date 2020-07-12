import { Column } from 'material-table';
import { IExample, IIntent, ITagType } from '../../../models/chatbot-service';

export interface TagsQueryResult {
  ChatbotService_tagTypes: ITagType[] | undefined;
}

export interface IntentsQueryResults {
  ChatbotService_intents: IIntent[];
}

export interface ExamplesQueryResults {
  ChatbotService_examples: IExample[] | undefined;
}

export interface ExamplesFilter {
  intentId?: number;
  offset?: number;
}

export type MergedExample = IExample & IIntent;
