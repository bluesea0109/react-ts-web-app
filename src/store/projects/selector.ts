import { AppState } from "..";

export const getProjects = (store: AppState) => store.projects.data;
export const getFetchingProjects = (store: AppState) => store.projects.isFetching;
export const getNewProjectLoader = (store: AppState) => store.projects.loader.newProject;
export const getUpdateProjectLoader = (store: AppState) => store.projects.loader.updateProject;
