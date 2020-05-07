import { ADD_PROJECT, FETCH_PROJECTS, ProjectActionType, ProjectState, SET_NEW_PROJECT_LOADER, SET_PROJECT_FETCHING, SET_UPDATE_PROJECT_LOADER } from "./types";

const initialState: ProjectState = {
  isFetching: false,
  data: [],
  loader: {
    newProject: false,
    updateProject: false
  }
};

export const ProjectReducer = (state = initialState, action: ProjectActionType): ProjectState => {
  switch (action.type) {
    case ADD_PROJECT: {
      const { id, name } = action.payload;
      return {
        ...state,
        data: [...state.data, { id, name }]
      }
    }
    case SET_NEW_PROJECT_LOADER: {
      return {
        ...state,
        loader: {
          ...state.loader,
          newProject: action.payload
        }
      }
    }
    case SET_PROJECT_FETCHING: {
      return {
        ...state,
        isFetching: true
      }
    }
    case FETCH_PROJECTS: {
      return {
        ...state,
        isFetching: false,
        data: action.payload.data
      }
    }
    case SET_UPDATE_PROJECT_LOADER: {
      return {
        ...state,
        loader: {
          ...state.loader,
          updateProject: action.payload
        }
      }
    }
    default:
      return state;
  }
}
