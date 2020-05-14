
// auth
import { AppState } from '.';

export const getAuthState = (store: AppState) => store.auth;
export const getCurrentUser = (store: AppState) => store.auth.user;
export const getActiveOrg = (store: AppState) => store.auth.activeOrg;
export const getActiveProject = (store: AppState) => store.auth.activeProject;
