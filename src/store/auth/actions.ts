import client from "../../apollo-client";
import { fetchProjects } from "../projects/actions";
import { SET_PROJECT_FETCHING } from "../projects/types";
import { fetch, updateActiveOrg } from "./queries";
import { SET_ACTIVE_ORG, SET_ACTIVE_PROJECT, SIGN_IN, SIGN_OUT } from "./types";
export const signIn = (user: any) => {
  return {
    type: SIGN_IN,
    payload: {
      user,
    }
  }
}

export const initialise = () => async (dispatch: any) => {
  const res = await client.query({
    query: fetch
  })
  dispatch({
    type: SET_ACTIVE_ORG,
    payload: {
      orgId: res.data.currentUser.activeOrgId
    }
  })
  dispatch({
    type: SET_ACTIVE_PROJECT,
    payload: {
      projectId: res.data.currentUser.activeProjectId
    }
  })
  dispatch(fetchProjects(res.data.currentUser.activeOrgId));
}

export const signOut = () => ({ type: SIGN_OUT, payload: null });

export const setActiveOrg = (orgId: string) => async (dispatch: any) => {
  dispatch({
    type: SET_PROJECT_FETCHING,
    payload: true
  })
  await client.mutate({
    mutation: updateActiveOrg,
    variables: {
      orgId
    }
  })
  dispatch(fetchProjects(orgId));
  dispatch({
    type: SET_ACTIVE_ORG,
    payload: {
      orgId
    }
  })
}
