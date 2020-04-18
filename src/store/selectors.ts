
// auth
import { AppState } from "."

export const getAuthState = (store: AppState) => store.auth;
export const getCurrentUser = (store: AppState) => store.auth.user;
