export const SIGN_IN = "SIGN_IN";
export const SIGN_OUT = "SIGN_OUT";

export interface AuthState {
  isLoggedIn: boolean;
  isFetching: boolean;
  user: any;
}

export interface SignInAction {
  type: typeof SIGN_IN;
  payload: AuthState;
}

export interface SignOutAction {
  type: typeof SIGN_OUT;
  payload: AuthState;
}

export type AuthActionTypes = SignInAction | SignOutAction;
