export interface IUser {
  uid: string;
  email: string;
  name: string;
  orgs?: IOrg[];
  activeOrg: IOrg | null;
  activeProject: IProject | null;
}

export interface IOrg {
  id: string;
  name: string;
  members?: IMember[];
  projects?: IProject[];
  currentUserMember?: IMember;
}

export interface IMember {
  orgId: string;
  uid: string;
  role: string;
  user?: IUser;
}

export interface IProject {
  id: string;
  orgId: string;
  name: string;
}

export interface IAPIKey {
  orgId: string;
  projectId: string;
  orgName: string;
  projectName: string;
  key: string;
  domains: string[]
}
