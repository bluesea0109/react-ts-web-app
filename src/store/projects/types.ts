export const FETCH_PROJECTS = "FETCH_PROJECTS";
export const ADD_PROJECT = "ADD_PROJECT";
export const SET_NEW_PROJECT_LOADER = "SET_NEW_PROJECT_LOADER";
export const SET_PROJECT_FETCHING = "SET_PROJECT_FETCHING";
export const SET_UPDATE_PROJECT_LOADER = "SET_UPDATE_PROJECT_LOADER"

export interface ProjectState {
  isFetching: boolean;
  data: Array<ProjectType>;
  loader: {
    newProject: boolean;
    updateProject: boolean;
  }
}

export interface ProjectType {
  id: string;
  name: string;
}

export interface FetchProjectAction {
  type: typeof FETCH_PROJECTS;
  payload: ProjectState;
}

export interface AddProjectAction {
  type: typeof ADD_PROJECT;
  payload: ProjectType;
}

export interface ToggleNewProjectLoaderAction {
  type: typeof SET_NEW_PROJECT_LOADER;
  payload: boolean;
}

export interface SetProjectFetching {
  type: typeof SET_PROJECT_FETCHING;
  payload: boolean;
}

export interface SetProjectUpdating {
  type: typeof SET_UPDATE_PROJECT_LOADER;
  payload: boolean;
}

export type ProjectActionType = FetchProjectAction | AddProjectAction | ToggleNewProjectLoaderAction | SetProjectFetching | SetProjectUpdating;
