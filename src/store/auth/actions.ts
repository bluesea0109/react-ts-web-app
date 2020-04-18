import {
  SIGN_IN, SIGN_OUT
} from "./types";

export const signIn = (user: any) => {
  return { 
    type: SIGN_IN, 
    payload: { 
      user,
    } 
  }
}

export const signOut = () => ({ type: SIGN_OUT, payload: null });
