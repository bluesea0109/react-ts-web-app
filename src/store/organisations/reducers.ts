import { ADD_ORG, FETCH_ORGS, OrgActionTypes, OrgState, SET_NEW_ORG_LOADER } from "./types";

const initialState: OrgState = {
  isFetching: true,
  data: [],
  loader: {
    newOrg: false
  }
};

export const orgReducer = (state = initialState, action: OrgActionTypes): OrgState => {
  switch (action.type) {
    case FETCH_ORGS: {
      const { data } = action.payload;
      return {
        ...state,
        data: data,
        isFetching: false
      };
    }
    case ADD_ORG: {
      const { id, name, members } = action.payload;
      return {
        ...state,
        data: [...state.data, { id, name, members }]
      }
    }
    case SET_NEW_ORG_LOADER: {
      return {
        ...state,
        loader: {
          ...state.loader,
          newOrg: action.payload
        }
      }
    }
    default:
      return state;
  }
}
