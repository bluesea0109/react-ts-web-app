export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const SET_ACTIVE_ORG = 'SET_ACTIVE_ORG';
export const SET_ACTIVE_PROJECT = 'SET_ACTIVE_PROJECT';

export interface AuthState {
  isLoggedIn: boolean;
  isFetching: boolean;
  user: any;
  activeOrg: string | null;
  activeProject: string | null;
}

export interface SignInAction {
  type: typeof SIGN_IN;
  payload: AuthState;
}

export interface SignOutAction {
  type: typeof SIGN_OUT;
  payload: AuthState;
}

export interface SetActiveOrgAction {
  type: typeof SET_ACTIVE_ORG;
  payload: { orgId: string };
}

export interface SetActiveProject {
  type: typeof SET_ACTIVE_PROJECT;
  payload: { projectId: string };
}

export type AuthActionTypes = SignInAction | SignOutAction | SetActiveOrgAction | SetActiveProject;
