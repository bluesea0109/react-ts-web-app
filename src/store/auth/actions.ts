import client from "../../apollo-client";
import { updateActiveOrg } from "./queries";
import { SET_ACTIVE_ORG, SIGN_IN, SIGN_OUT } from "./types";

export const signIn = (user: any) => {
  return {
    type: SIGN_IN,
    payload: {
      user,
    }
  }
}

export const signOut = () => ({ type: SIGN_OUT, payload: null });

export const setActiveOrg = (orgId: string) => async (dispatch: any) => {
  const res = await client.mutate({
    mutation: updateActiveOrg,
    variables: {
      orgId
    }
  })
  dispatch({
    type: SET_ACTIVE_ORG,
    payload: {
      orgId
    }
  })
}
