export interface IUser {
  uid: string;
  email: string;
  name: string;
  workspaces?: IWorkspace[];
  activeWorkspace: IWorkspace | null;
}

export interface IWorkspace {
  id: string;
  name: string;
  billingEnabled: boolean;
  members?: IMember[];
  currentUserMember?: IMember;
}

export interface IMember {
  workspaceId: string;
  uid: string;
  role: string;
  user?: IUser;
}

export interface IAPIKey {
  id: string;
  workspaceId: string;
  workspaceName: string;
  key: string;
  domains: string[];
}

export interface IInvitedMember {
  id: string;
  email: string;
  workspaceId: string;
  workspaceName: string;
  senderName: string;
  senderEmail: string;
  timestamp: string;
  role: string;
}
