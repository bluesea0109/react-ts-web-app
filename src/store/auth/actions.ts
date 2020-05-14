import client from '../../apollo-client';
import { fetchProjects } from '../projects/actions';
import { SET_PROJECT_FETCHING } from '../projects/types';
import { currentUser, updateActiveOrg } from './queries';
import { SET_ACTIVE_ORG, SET_ACTIVE_PROJECT, SIGN_IN, SIGN_OUT } from './types';

export const signIn = (user: any) => {
  return {
    type: SIGN_IN,
    payload: {
      user,
    },
  };
};

export const initialise = () => async (dispatch: any) => {
  const res = await client.query({
    query: currentUser,
  });

  dispatch({
    type: SET_ACTIVE_ORG,
    payload: {
      orgId: res.data.currentUser.activeOrg.id,
    },
  });
  dispatch({
    type: SET_ACTIVE_PROJECT,
    payload: {
      projectId: res.data.currentUser.activeProject.id,
    },
  });

  if (res.data.currentUser.activeOrg.id) {
    dispatch(fetchProjects(res.data.currentUser.activeOrg.id));
  }
};

export const signOut = () => ({ type: SIGN_OUT, payload: null });

export const setActiveOrg = (orgId: string) => async (dispatch: any) => {
  dispatch({
    type: SET_PROJECT_FETCHING,
    payload: true,
  });
  await client.mutate({
    mutation: updateActiveOrg,
    variables: {
      orgId,
    },
  });
  dispatch(fetchProjects(orgId));
  dispatch({
    type: SET_ACTIVE_ORG,
    payload: {
      orgId,
    },
  });
};
