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
  
  export interface IMember {
    orgId?: string;
    uid: string;
    memberType: string;
  }