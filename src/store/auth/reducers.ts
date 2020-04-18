import { SIGN_IN, SIGN_OUT, AuthState, AuthActionTypes } from "./types";

const initialState: AuthState = {
  user: null,
  isFetching: true,
  isLoggedIn: false
};

export const authReducer = (state = initialState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case SIGN_IN: {
      const { user } = action.payload;
      return {
        user: user,
        isFetching: false,
        isLoggedIn: true
      };
    }
    case SIGN_OUT: {
      return {
        user: null,
        isFetching: false,
        isLoggedIn: false
      };
    }
    default:
      return state;
  }
}
