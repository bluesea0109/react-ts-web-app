import client from '../../apollo-client';
import { SET_ACTIVE_PROJECT } from '../auth/types';
import { SET_UPDATE_PROJECT_LOADER } from '../projects/types';
import { create, fetchAll, updateActiveProject } from './queries';
import { ADD_ORG, FETCH_ORGS, SET_NEW_ORG_LOADER } from './types';

export const fetchOrgs = () => async (dispatch: any) => {
  const res = await client.query({
    query: fetchAll,
    variables: {},
  });
  dispatch({
    type: FETCH_ORGS,
    payload: {
      data: res.data.orgs,
    },
  });
};
export const createOrg = (name: string) => async (dispatch: any) => {
  dispatch({
    type: SET_NEW_ORG_LOADER,
    payload: true,
  });
  const res = await client.mutate({
    mutation: create,
    variables: {
      name,
    },
  });
  dispatch({
    type: ADD_ORG,
    payload: {
      id: res.data.createOrg.id,
      name: res.data.createOrg.name,
      members: [],
    },
  });
  dispatch({
    type: SET_NEW_ORG_LOADER,
    payload: false,
  });
};

export const setActiveProject = (orgId: string, projectId: string) => async (dispatch: any) => {
  dispatch({
    type: SET_UPDATE_PROJECT_LOADER,
    payload: true,
  });
  dispatch({
    type: SET_ACTIVE_PROJECT,
    payload: {
      projectId,
    },
  });
  await client.mutate({
    mutation: updateActiveProject,
    variables: {
      projectId,
      orgId,
    },
  });
  dispatch({
    type: SET_UPDATE_PROJECT_LOADER,
    payload: false,
  });
};
