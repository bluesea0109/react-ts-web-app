import { INLUExample } from '../../../models/chatbot-service';

export interface ExamplesQueryResults {
  ChatbotService_examples: INLUExample[] | undefined;
}

export interface CreateExampleMutationResult {
  ChatbotService_createExample: INLUExample;
}

export interface ExamplesFilter {
  intent?: string;
  offset?: number;
}

export interface InvalidExist {
  invalidExlist?: boolean;
}

export interface InvalidIntents {
  invalidIntents?: string[];
}

export enum ExamplesError {
  CREATE_ERROR_DUPLICATE_EXAMPLE,
}
