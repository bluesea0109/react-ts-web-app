import { AuthActionTypes, AuthState, SET_ACTIVE_ORG, SET_ACTIVE_PROJECT, SIGN_IN, SIGN_OUT } from "./types";

const initialState: AuthState = {
  user: null,
  isFetching: true,
  isLoggedIn: false,
  activeOrg: null,
  activeProject: null
};

export const authReducer = (state = initialState, action: AuthActionTypes): AuthState => {
  switch (action.type) {
    case SIGN_IN: {
      const { user } = action.payload;
      return {
        ...state,
        user: user,
        isFetching: false,
        isLoggedIn: true
      };
    }
    case SIGN_OUT: {
      return {
        ...state,
        user: null,
        isFetching: false,
        isLoggedIn: false
      };
    }
    case SET_ACTIVE_ORG: {
      const { orgId } = action.payload;
      return {
        ...state,
        activeOrg: orgId
      }
    }
    case SET_ACTIVE_PROJECT: {
      const { projectId } = action.payload;
      return {
        ...state,
        activeProject: projectId
      }
    }
    default:
      return state;
  }
}
