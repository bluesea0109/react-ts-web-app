export interface IImageCollection {
  id: number;
  projectId: string;
  name: string;
}

export interface ICategorySet {
  id: number;
  name: string;
  categories: ICategory[];
}

export interface ICategory {
  categorySetName: string;
  categorySetId: number;
  name: string;
}

export interface IImage {
  id: number;
  collectionId: number;
  name: string;
  url: string;
  maskUrl: string | null;
  approvedBy: string[];
  labels: IImageLabel[];
}

export interface IImageLabel {
  id: number;
  shape: string;
  category: ICategory | null;
  value: string | null;
  creator: string;
}

export interface IImageLabelInput {
  id: number | null;
  shape: string;
  categorySetId: number | null;
  category: string | null;
  value: string | null;
}

export interface IBatchLabelingInput {
  imageId: number;
  categorySetId: number;
  category: string;
}

export interface ILabelQueueImage {
  collectionId: number;
  imageId: number;
  status: string;
  labeler: string;
}

export interface ILabelsExport {
  id: number;
  collectionId: number;
  status: string;
  creator: string;
  createdAt: string;
  signedUrl: string;
}

export interface IReviewQueue {
  id: number;
  collectionId: number;
  name: string;
  percentUnderReview: number;
  percentApproved: number;
}

export interface IReviewQueueImage {
  queueId: number;
  imageId: number;
  reviewer: string;
  status: string;
}

// chatbot service models
export enum ChatbotLanguage {
  EN_US,
  FR,
}

export interface IAgent {
  id: number;
  projectId: string;
  name: string;
  language: string;
}

export interface IExample {
  id: number;
  intentId: number;
  agentId: number;
  text: string;
  tags: any;
}

export interface IIntent {
  id: number;
  agentId: number;
  value: string;
}
export interface ITemplate {
  id: number;
  agentId: number;
  name: string;
  text: string;
}

export interface ITagType {
  id: number;
  agentId: number;
  value: string;
}

export interface IExampleInput {
  text: string;
  intent: string;
  tags: IExampleTagInput[];
}

export interface IExampleTagInput {
  tagType: string;
  start: number;
  end: number;
}
