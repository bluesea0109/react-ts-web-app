export interface IUser {
  uuid: string;
  email: string;
  name: string;
  orgs: IOrg[];
  activeOrg: IOrg | null;
  activeProject: IProject | null;
}

export interface IOrg {
  id: string;
  name: string;
  members: IMember[];
  projects: IProject[];
}

export interface IProject {
  id: string;
  orgId: string;
  name: string;
}

export interface IAgent {
  id: string;
  projectId: string;
  name: string;
  language: string;
}

export interface IMember {
  orgId?: string;
  uid: string;
  memberType: string;
}

// image labeling models
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
  shape: string | null;
  category: ICategory | null;
  value: string | null;
  creator: string;
}

export interface ILabelQueueImage {
  collectionId: number;
  imageId: number;
  status: string;
  labeler: string;
}

export enum ChatbotLanguage {
  EN_US,
  FR,
}
