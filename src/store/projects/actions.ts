import client from "../../apollo-client";
import { create, fetchAll } from "./queries";
import { ADD_PROJECT, FETCH_PROJECTS, SET_NEW_PROJECT_LOADER, SET_PROJECT_FETCHING } from "./types";

export const createProject = (name: string, orgId: string) => async (dispatch: any) => {
  dispatch({
    type: SET_NEW_PROJECT_LOADER,
    payload: true
  })
  const res = await client.mutate({
    mutation: create,
    variables: {
      name,
      orgId
    },
    refetchQueries: [{
      query: fetchAll,
      variables: {
        orgId
      }
    }]
  })
  dispatch({
    type: ADD_PROJECT,
    payload: {
      id: res.data.createProject.id,
      name: res.data.createProject.name,
      orgId: res.data.createProject.orgId
    }
  })
  dispatch({
    type: SET_NEW_PROJECT_LOADER,
    payload: false
  })
}

export const fetchProjects = (orgId: string) => async (dispatch: any) => {
  dispatch({
    type: SET_PROJECT_FETCHING,
    payload: true
  })
  const res = await client.query({
    query: fetchAll,
    variables: {
      orgId
    }
  });
  dispatch({
    type: FETCH_PROJECTS,
    payload: {
      data: res.data.projects
    }
  })
}
