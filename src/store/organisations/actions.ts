import client from "../../apollo-client";
import { create, fetchAll } from "./queries";
import { ADD_ORG, FETCH_ORGS } from "./types";

export const fetchOrgs = () => async (dispatch: any) => {
  const res = await client.query({
    query: fetchAll,
    variables: {},
  })
  dispatch({
    type: FETCH_ORGS,
    payload: {
      data: res.data.orgs
    }
  })
}
export const createOrg = (name: string) => async (dispatch: any) => {
  const res = await client.mutate({
    mutation: create,
    variables: {
      name
    }
  })
  dispatch({
    type: ADD_ORG,
    payload: {
      id: res.data.createOrg.id,
      name: res.data.createOrg.name,
      members: []
    }
  })
}
