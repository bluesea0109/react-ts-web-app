export const FETCH_ORGS = "FETCH_ORGS";
export const ADD_ORG = "ADD_ORG";
export const SET_NEW_ORG_LOADER = "SET_NEW_ORG_LOADER";

export interface OrgState {
  isFetching: boolean;
  loader: {
    newOrg: boolean;
  };
  data: Array<OrgType>;
}
export interface OrgType {
  id: string;
  name: string;
  members: Array<OrgMember>
}
export interface OrgMember {
  orgId: string;
  uid: string;
  memberType: string;
  user: any;
}

export interface FetchOrgAction {
  type: typeof FETCH_ORGS;
  payload: OrgState;
}

export interface AddOrgAction {
  type: typeof ADD_ORG;
  payload: OrgType;
}

export interface ToggleNewOrgLoaderAction {
  type: typeof SET_NEW_ORG_LOADER;
  payload: boolean;
}

export type OrgActionTypes = FetchOrgAction | AddOrgAction | ToggleNewOrgLoaderAction
