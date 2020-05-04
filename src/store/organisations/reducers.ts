import { ADD_ORG, FETCH_ORGS, OrgActionTypes, OrgState } from "./types";

const initialState: OrgState = {
  isFetching: true,
  data: [],
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
    default:
      return state;
  }
}
